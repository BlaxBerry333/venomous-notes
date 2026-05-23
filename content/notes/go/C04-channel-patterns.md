---
slug: go-channel-patterns
lang: zh
---

# Channel 使用模式：Pipeline、Fan-out、Fan-in 与优雅退出

> **本文解决什么问题**：掌握 channel 的核心使用模式——Pipeline、Fan-out/Fan-in、done channel 广播取消，以及 select 的超时和非阻塞用法。这些是构建并发服务的基础积木。
>
> **前置知识**：[B03-goroutines](./B03-goroutines.md)（goroutine、channel 基础、select）

---

## Channel 是什么（TypeScript 类比）

TypeScript 里 goroutine 之间不需要通信渠道，因为代码是单线程的。Go 的 goroutine 真正并行，需要一种安全的方式在它们之间传递数据——这就是 channel。

| TypeScript 做法 | Go channel 等价 |
|----------------|----------------|
| `resolve(value)` + `await promise` | `ch <- value` 发送 + `<-ch` 接收 |
| `EventEmitter.emit('done')` | `close(ch)` 广播关闭信号 |
| 带背压的队列 | 有缓冲 channel `make(chan T, n)` |

最基础的用法：

```go
package main

import "fmt"

func main() {
    ch := make(chan string)

    go func() {
        ch <- "hello from goroutine"
    }()

    msg := <-ch
    fmt.Println(msg) // "hello from goroutine"
}
```

`<-ch` 会阻塞，直到有数据到来——类似 `await promise`，但不需要 async/await 标记。

---

## 无缓冲 vs 有缓冲：选型依据

| 特性 | 无缓冲 `make(chan T)` | 有缓冲 `make(chan T, n)` |
|------|---------------------|------------------------|
| 同步语义 | 发送和接收必须同时就绪（同步握手） | 发送不阻塞直到缓冲满；接收不阻塞直到缓冲空 |
| 适用场景 | goroutine 间需要确认信号（如"任务完成"） | 生产速度和消费速度不均匀时的缓冲 |
| 典型用途 | 完成通知、请求-响应配对 | 批量处理、限流信号量、任务队列 |
| 泄漏风险 | 高（接收者消失则发送者永久阻塞） | 较低（缓冲未满时发送不阻塞） |

**信号量模式（限制并发数）**：

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    const maxConcurrent = 3
    sem := make(chan struct{}, maxConcurrent) // 有缓冲 channel 作信号量

    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            sem <- struct{}{}        // 获取许可（缓冲满时阻塞）
            defer func() { <-sem }() // 释放许可

            fmt.Printf("task %d running\n", id)
        }(i)
    }
    wg.Wait()
}
```

---

## Pipeline 模式

Pipeline 将数据处理分解为多个串行 stage，每个 stage 是一个独立的 goroutine，通过 channel 传递数据。

```go
package main

import "fmt"

// Stage 1：生产者
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out) // 发完就关闭：告知下游没有更多数据
    }()
    return out
}

// Stage 2：变换
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in { // range channel 在 close 时自动退出
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // 串联 pipeline：generate → square → square → 消费
    for n := range square(square(generate(2, 3))) {
        fmt.Println(n) // 16, 81
    }
}
```

**关键约定**：
- 发送者负责关闭 channel（`close(out)`）
- 下游用 `for range ch` 接收，channel 关闭后自动退出循环
- 不要从接收方关闭 channel（会导致发送方 panic）

---

## Fan-out / Fan-in

Fan-out：多个 goroutine 从同一 inbound channel 读取，实现并行处理。  
Fan-in：将多个 channel 的结果合并到一个 channel。

```go
package main

import (
    "fmt"
    "sync"
)

func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums { out <- n }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in { out <- n * n }
        close(out)
    }()
    return out
}

// Fan-in：合并多个 channel 到一个
func merge(cs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)

    output := func(c <-chan int) {
        for n := range c { out <- n }
        wg.Done()
    }

    wg.Add(len(cs))
    for _, c := range cs {
        go output(c)
    }

    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}

func main() {
    in := generate(2, 3, 4, 5)

    // Fan-out：两个 goroutine 并行处理同一 channel
    c1 := square(in)
    c2 := square(in)

    // Fan-in：合并结果
    for n := range merge(c1, c2) {
        fmt.Println(n) // 4 9 16 25（顺序不固定）
    }
}
```

---

## done channel：优雅退出与广播取消

上面的 merge 有一个问题：如果消费者提前退出，`output` goroutine 会在 `out <- n` 永久阻塞，造成泄漏。

解决方案是传入一个 `done` channel，关闭它相当于向所有监听者广播"退出"信号。

```go
package main

import (
    "fmt"
    "sync"
)

func generate(done <-chan struct{}, nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            select {
            case out <- n:
            case <-done: // 收到取消信号，立即退出
                return
            }
        }
    }()
    return out
}

func square(done <-chan struct{}, in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            select {
            case out <- n * n:
            case <-done:
                return
            }
        }
    }()
    return out
}

func merge(done <-chan struct{}, cs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)

    output := func(c <-chan int) {
        defer wg.Done()
        for n := range c {
            select {
            case out <- n:
            case <-done:
                return
            }
        }
    }

    wg.Add(len(cs))
    for _, c := range cs {
        go output(c)
    }

    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}

func main() {
    done := make(chan struct{})
    defer close(done) // main 退出时广播取消信号，所有 goroutine 退出

    in := generate(done, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    c1 := square(done, in)
    c2 := square(done, in)

    // 只消费第一个值就退出——done channel 确保不泄漏
    fmt.Println(<-merge(done, c1, c2))
}
```

**为什么关闭 channel 而不是发送值**：`close(done)` 是广播机制——所有 `<-done` 的接收者**同时**收到零值，无需知道有多少个接收者。

---

## select：超时与非阻塞

### 超时控制

```go
package main

import (
    "fmt"
    "time"
)

func slowOperation() <-chan string {
    ch := make(chan string, 1)
    go func() {
        time.Sleep(2 * time.Second)
        ch <- "result"
    }()
    return ch
}

func main() {
    ch := slowOperation()
    select {
    case result := <-ch:
        fmt.Println("got:", result)
    case <-time.After(1 * time.Second):
        fmt.Println("timeout")
    }
}
```

### default：非阻塞操作

```go
func tryReceive(ch <-chan int) (int, bool) {
    select {
    case v := <-ch:
        return v, true
    default:
        return 0, false // channel 空时立即返回，不阻塞
    }
}

func trySend(ch chan<- int, v int) bool {
    select {
    case ch <- v:
        return true
    default:
        return false // channel 满时立即返回，不阻塞
    }
}
```

---

## 关闭 channel 的规范

**核心规则**：只有发送方才应该关闭 channel。

| 情况 | 规则 |
|------|------|
| 单发送者 | 发送者直接 `close(ch)` |
| 多发送者 | 用额外的 "stop" channel 或 `sync.Once` 确保只 close 一次 |
| 向已关闭 channel 发送 | panic |
| 关闭已关闭的 channel | panic |
| 从已关闭 channel 接收 | 返回零值，ok=false |
