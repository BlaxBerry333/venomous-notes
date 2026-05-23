---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__8.md
---

# Go 并发模型：goroutine、GMP 调度与泄漏排查

**本文解决什么问题**：从原理层面理解 goroutine 为什么比线程轻量，掌握 GMP 调度模型的面试级表述，并学会用 runtime 和 pprof 定位 goroutine 泄漏。

**前置知识**：[01-go-vs-others](./x01-go-vs-others.md)；[00-go-basics](./x00-go-basics.md) 中 goroutine 的简要介绍。

---

## TypeScript 开发者需要的思维转换

TypeScript 是单线程的。即使你写了很多 `async/await`，任意时刻只有一段代码在执行：

```
TypeScript 运行时：
  main()
    ↓
  await fetch(url)  ← 挂起，把控制权交给事件循环
    │
    └── 事件循环等待 I/O 完成
    │
  ← 恢复，继续执行下一行
```

**race condition 在 TypeScript 里几乎不存在**，因为你的变量同一时刻只会被一段代码访问。

Go 是真并行的。多个 goroutine 可以同时运行在不同 CPU 核上：

```
Go 运行时：
  goroutine 1 ──→ CPU core 0 ← 同时
  goroutine 2 ──→ CPU core 1 ← 同时
  goroutine 3 ──→ 等待调度
```

这意味着两个 goroutine 可以在**同一微秒**内都在读写同一个变量——这是 TypeScript 没有的问题，也是 Go 需要 channel 和 sync 原语的根本原因。

| | TypeScript async/await | Go goroutine |
|--|----------------------|-------------|
| 并发方式 | 单线程事件循环，交替执行 | M:N 调度，真正同时运行 |
| 启动后台任务 | `fetchData().then(...)` | `go fetchData()` |
| 等待结果 | `await promise` | `<-channel` 或 `wg.Wait()` |
| 竞态风险 | 极低（单线程） | 存在，需主动防护 |
| 最大并发数 | 受事件循环限制 | 轻松数十万 goroutine |

---

## goroutine vs OS Thread

| 特性 | OS Thread | goroutine |
|------|----------|-----------|
| 栈大小 | 固定，通常 1-8 MB | 初始 2-8 KB，按需自动扩展 |
| 创建开销 | 系统调用，微秒级 | 用户态，纳秒级 |
| 调度 | 内核调度器（抢占式） | Go runtime 调度器（协作式 + 抢占式） |
| 上下文切换 | 需保存所有寄存器，微秒级 | 只保存少量寄存器，纳秒级 |
| 最大并发数 | 受限于系统（通常数千） | 可轻松创建百万个 |
| 通信 | 共享内存 + 锁 | channel（推荐）+ 共享内存 |

goroutine 的轻量来自两点：

1. **可扩展栈（segmented/copyable stack）**：初始只分配几 KB，超出后 Go runtime 自动扩容（复制到新的更大内存区域），最大上限约 1 GB（可配置）
2. **M:N 调度**：多个 goroutine 复用少量 OS thread，切换在用户态完成，无需系统调用

```go
package main

import (
    "fmt"
    "runtime"
    "sync"
)

func main() {
    var wg sync.WaitGroup
    // 创建 100 万个 goroutine 是正常的
    for i := 0; i < 1_000_000; i++ {
        wg.Add(1)
        go func(n int) {
            defer wg.Done()
            // 每个 goroutine 只做极少工作
            _ = n * 2
        }(i)
    }
    wg.Wait()
    fmt.Println("goroutines after wait:", runtime.NumGoroutine())
}
```

---

## GMP 调度模型

GMP 是 Go runtime 调度器的三要素：

- **G（Goroutine）**：goroutine，包含栈、程序计数器、goroutine 状态
- **M（Machine）**：OS 线程，实际执行代码的实体
- **P（Processor）**：逻辑处理器，持有本地 goroutine 队列和执行 goroutine 所需的资源

### 调度流程

```
全局队列 (Global Run Queue)
     |
     |  steal
     ↓
P1 [本地队列] → M1 → CPU Core 0
P2 [本地队列] → M2 → CPU Core 1
...
PN [本地队列] → MN → CPU Core N-1
```

1. 新创建的 G 优先进入当前 P 的**本地队列**（最多 256 个）
2. 本地队列满了，放入**全局队列**（带锁，性能较低）
3. M 从绑定 P 的本地队列取 G 执行；本地队列空时，从全局队列或其他 P 的本地队列 **work stealing**
4. G 发生阻塞系统调用时：M 与 P 解绑，P 绑定到新 M（或唤醒空闲 M）继续执行其他 G
5. 系统调用返回：原 M 尝试绑定一个空闲 P；若无空闲 P，G 放回全局队列，M 进入休眠

### GOMAXPROCS

```go
import "runtime"

func main() {
    // 查询当前 P 的数量（默认等于 CPU 核数）
    fmt.Println(runtime.GOMAXPROCS(0))

    // 设置 P 的数量（影响真实并行度）
    runtime.GOMAXPROCS(4)
}
```

```bash
# 也可以通过环境变量设置
GOMAXPROCS=4 ./myprogram
```

**面试要点**：

- `GOMAXPROCS` 控制的是同时**并行执行**的 goroutine 数上限，不是 goroutine 总数
- IO 密集型服务提高 `GOMAXPROCS` 收益有限（大量 goroutine 在等 IO，不需要更多 CPU）
- CPU 密集型服务设为 CPU 核数即可，设更高反而增加上下文切换开销

---

## goroutine 泄漏的 4 种常见场景

goroutine 泄漏是指：goroutine 启动后因某种原因永远无法退出，导致内存持续增长。

### 场景 1：channel send 无接收者

```go
// 错误示例
func leak1() {
    ch := make(chan int) // 无缓冲
    go func() {
        ch <- 1 // 永远阻塞：没有人接收
    }()
    // 函数返回，但 goroutine 还在
}
```

修复：确保有接收者，或使用带缓冲 channel，或传入 done channel 信号。

### 场景 2：channel receive 无发送者

```go
// 错误示例
func leak2() {
    ch := make(chan int)
    go func() {
        v := <-ch // 永远阻塞：没有人发送
        _ = v
    }()
}
```

### 场景 3：HTTP/数据库连接没有超时

```go
// 错误示例：context 没有 deadline，goroutine 会一直等
func leak3(url string) {
    go func() {
        resp, err := http.Get(url) // 如果服务器不响应，永远等待
        if err != nil {
            return
        }
        resp.Body.Close()
    }()
}

// 正确：使用带 timeout 的 context
func noLeak3(url string) {
    go func() {
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        req, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
        resp, err := http.DefaultClient.Do(req)
        if err != nil {
            return
        }
        resp.Body.Close()
    }()
}
```

### 场景 4：for-select 没有退出条件

```go
// 错误示例
func leak4(ch <-chan int) {
    go func() {
        for {
            select {
            case v := <-ch: // ch 从不关闭，goroutine 永远运行
                _ = v
            }
        }
    }()
}

// 正确：加入 done channel
func noLeak4(ch <-chan int, done <-chan struct{}) {
    go func() {
        for {
            select {
            case v := <-ch:
                _ = v
            case <-done: // 收到退出信号
                return
            }
        }
    }()
}
```

---

## 泄漏排查：runtime.NumGoroutine + pprof

### 快速检查：NumGoroutine

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func main() {
    fmt.Println("goroutines before:", runtime.NumGoroutine())

    for i := 0; i < 10; i++ {
        ch := make(chan int)
        go func() { ch <- 1 }() // 制造泄漏
    }

    time.Sleep(100 * time.Millisecond)
    fmt.Println("goroutines after:", runtime.NumGoroutine())
    // 预期输出：goroutines after: 11（比前多了 10 个泄漏的）
}
```

### pprof goroutine profile

在 HTTP 服务中注册 pprof 端点后：

```bash
# 抓取 goroutine profile 并进入交互模式
go tool pprof http://localhost:6060/debug/pprof/goroutine

(pprof) top10      # 显示 goroutine 数量最多的调用栈
(pprof) list leak  # 显示包含 "leak" 的函数的详细信息
```

在测试中验证无泄漏：

```go
package mypackage_test

import (
    "runtime"
    "testing"
    "time"
)

func TestNoGoroutineLeak(t *testing.T) {
    before := runtime.NumGoroutine()

    // 执行被测代码
    doSomethingConcurrent()

    time.Sleep(50 * time.Millisecond) // 等待 goroutine 退出
    after := runtime.NumGoroutine()

    if after > before+1 { // 允许 1 个误差
        t.Errorf("goroutine leak: before=%d after=%d", before, after)
    }
}
```
