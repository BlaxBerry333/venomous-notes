---
slug: go-interview-guide
lang: zh
---

# Goroutine 与 Channel 入门

**本文解决什么问题**：理解 Go 的并发基础——goroutine 是什么、channel 怎么传数据、如何等待多个 goroutine 完成，以及最常见的泄漏是怎么发生的。

**前置知识**：[B02-errors](./B02-errors.md)（error 处理）；[A04-functions](./A04-functions.md)（函数是一等公民）。

---

## TypeScript 的并发 vs Go 的并发

TypeScript 用 `async/await` 处理异步——本质是**单线程事件循环**，一次只跑一件事，遇到 I/O 时让出控制权：

```typescript
async function fetchUser(id: number) {
  const user = await db.query(id);   // 等待，但不阻塞线程
  return user;
}
```

Go 用 **goroutine**——每个 goroutine 是一个轻量级执行流，Go runtime 把它们调度到真实的 OS 线程上，**可以真正并行执行**：

```go
go fetchUser(id)  // 启动 goroutine，立即返回，不等结果
```

| | TypeScript async/await | Go goroutine |
|--|----------------------|-------------|
| 并发模型 | 单线程事件循环 | M:N 调度，可真正并行 |
| 启动开销 | 几乎无 | 极低（~2KB 初始栈） |
| 数量上限 | 受事件队列限制 | 可以开百万个 |
| 语法 | `async/await` | `go func()` |
| 通信 | Promise / callback | channel |

---

## 启动 goroutine

`go` 关键字后跟函数调用，立即启动一个新 goroutine：

```go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    fmt.Println("Hello,", name)
}

func main() {
    go sayHello("Alice") // 启动 goroutine，main 不等它
    go sayHello("Bob")

    // 如果 main 在这里直接退出，两个 goroutine 可能还没跑完
    time.Sleep(100 * time.Millisecond) // 临时方案，实际用 WaitGroup
}
```

**注意**：`main` 函数退出时，所有 goroutine 都会被强制终止，不管它们有没有跑完。

---

## sync.WaitGroup：等待一组 goroutine 完成

实际代码里不用 `time.Sleep` 等待，用 `sync.WaitGroup`：

```go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done() // goroutine 结束时调用 Done()
    fmt.Printf("worker %d 开始\n", id)
    // 模拟工作...
    fmt.Printf("worker %d 完成\n", id)
}

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1)            // 在启动 goroutine 之前调用 Add！
        go worker(i, &wg)
    }

    wg.Wait() // 阻塞，直到所有 Done() 被调用
    fmt.Println("全部完成")
}
```

**关键规则**：`wg.Add(1)` 必须在 `go` 语句**之前**调用。如果在 goroutine 内部调用 `Add`，可能 `Wait` 已经返回了，`Add` 才执行，导致竞态。

---

## Channel：goroutine 间通信

Channel 是 Go 的核心通信机制——goroutine 通过 channel 互发数据，不需要共享内存：

```go
package main

import "fmt"

func main() {
    // 创建一个无缓冲 int channel
    ch := make(chan int)

    // 启动 goroutine 发送数据
    go func() {
        ch <- 42  // 发送：阻塞到有人接收
    }()

    v := <-ch  // 接收：阻塞到有人发送
    fmt.Println(v) // 42
}
```

**无缓冲 channel 的特点**：发送方和接收方必须同时就绪，像"握手"。发送会阻塞，直到有接收方；接收会阻塞，直到有发送方。

---

## 有缓冲 channel

```go
package main

import "fmt"

func main() {
    // 缓冲大小为 3：可以存 3 个值，不用立即有接收方
    ch := make(chan int, 3)

    ch <- 1  // 不阻塞
    ch <- 2  // 不阻塞
    ch <- 3  // 不阻塞
    // ch <- 4  // 这里会阻塞，缓冲满了

    fmt.Println(<-ch) // 1
    fmt.Println(<-ch) // 2
    fmt.Println(<-ch) // 3
}
```

| | 无缓冲 `make(chan T)` | 有缓冲 `make(chan T, n)` |
|--|---------------------|----------------------|
| 发送阻塞条件 | 没有接收方时 | 缓冲已满时 |
| 接收阻塞条件 | 没有发送方时 | 缓冲为空时 |
| 适用场景 | 同步信号、确保对方处理完 | 任务队列、限制并发量 |

---

## 用 channel 收集结果

```go
package main

import (
    "fmt"
    "sync"
)

func square(n int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    results <- n * n
}

func main() {
    results := make(chan int, 5)
    var wg sync.WaitGroup

    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go square(i, results, &wg)
    }

    // 等所有 goroutine 完成后关闭 channel
    go func() {
        wg.Wait()
        close(results) // 关闭信号：不会再有数据了
    }()

    // range channel：自动在 channel 关闭后退出循环
    for v := range results {
        fmt.Println(v)
    }
}
```

**channel 方向标注**：
- `chan<- int`：只能发送（send-only）
- `<-chan int`：只能接收（receive-only）
- `chan int`：双向

---

## select：同时等多个 channel

`select` 类似 `switch`，但每个 `case` 是一个 channel 操作，哪个 channel 先就绪就执行哪个：

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "来自 ch1"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "来自 ch2"
    }()

    // 等待其中一个先到达
    select {
    case msg := <-ch1:
        fmt.Println(msg)
    case msg := <-ch2:
        fmt.Println(msg)
    case <-time.After(500 * time.Millisecond):
        fmt.Println("超时了")
    }
}
```

`time.After` 返回一个 channel，在指定时间后发送一个值——这是 Go 实现超时的惯用法。

---

## 最常见的 goroutine 泄漏

泄漏是指 goroutine 永远无法退出，占用内存直到程序结束。

**泄漏场景 1：channel 发送方，没有接收方**

```go
func leak() {
    ch := make(chan int)
    go func() {
        ch <- 1 // 永远阻塞——没有人接收
    }()
    // 函数返回，但 goroutine 仍在内存里等待
}
```

**泄漏场景 2：channel 接收方，没有发送方也没有关闭**

```go
func leak2(ch chan int) {
    go func() {
        v := <-ch // 如果 ch 永远没有数据且不被关闭，永远阻塞
        fmt.Println(v)
    }()
}
```

**排查工具**：`runtime.NumGoroutine()` 查看当前 goroutine 数量，测试里持续增加说明有泄漏。

```go
import "runtime"

fmt.Println("goroutine 数量:", runtime.NumGoroutine())
```

---

## 完整示例：并发请求 + 收集结果

```go
package main

import (
    "fmt"
    "sync"
)

type Result struct {
    ID    int
    Value string
    Err   error
}

func fetchItem(id int) (string, error) {
    // 模拟工作
    return fmt.Sprintf("item-%d", id), nil
}

func main() {
    ids := []int{1, 2, 3, 4, 5}
    results := make(chan Result, len(ids))
    var wg sync.WaitGroup

    for _, id := range ids {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            val, err := fetchItem(id)
            results <- Result{ID: id, Value: val, Err: err}
        }(id) // 注意：把 id 作为参数传入，避免闭包捕获循环变量
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    for r := range results {
        if r.Err != nil {
            fmt.Printf("ID %d 出错: %v\n", r.ID, r.Err)
            continue
        }
        fmt.Printf("ID %d: %s\n", r.ID, r.Value)
    }
}
```

**闭包捕获循环变量**的注意事项（上面代码里已处理）：把 `id` 作为参数传给 goroutine 函数，避免所有 goroutine 共享同一个 `id` 变量。
