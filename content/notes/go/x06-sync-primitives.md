---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__4.md
---

# sync 原语：Mutex、WaitGroup、Once、atomic 与 errgroup

**本文解决什么问题**：掌握 Go 标准库同步原语的正确用法和常见陷阱，能在面试中清晰说出各原语的适用场景和选型依据，以及死锁的排查思路。

**前置知识**：[04-concurrency-model](./x04-concurrency-model.md)（goroutine 基础）；[05-channel-patterns](./x05-channel-patterns.md)（channel 与锁的边界）。

---

## 为什么 Go 需要锁，TypeScript 不需要

TypeScript 是单线程的——你的代码任意时刻只有一段在执行，所以不可能出现两段代码**同时**读写同一个变量：

```typescript
// TypeScript：绝对安全，counter++ 不可能被打断
let counter = 0;
async function increment() {
  counter++; // 这行执行时，其他 async 函数不会插入
}
```

Go 的 goroutine 是真并行的——两个 goroutine 可能在**同一微秒**内同时执行 `counter++`：

```go
var counter int

// 危险：两个 goroutine 同时执行
go func() { counter++ }() // goroutine 1 读取 counter=0，加 1，写入 1
go func() { counter++ }() // goroutine 2 同时读取 counter=0，加 1，写入 1
// 最终 counter 可能是 1，而不是 2 ← 数据竞态（data race）
```

`go test -race` 能检测到这类问题（见 [11-testing-patterns](./x11-testing-patterns.md)）。

**解决方案**：用锁（Mutex）确保同一时刻只有一个 goroutine 能进入"危险区域"：

```go
var mu sync.Mutex
var counter int

go func() {
    mu.Lock()   // 其他 goroutine 遇到 Lock() 会等待
    counter++
    mu.Unlock() // 释放锁，其他 goroutine 可以进入了
}()
```

锁的代价是性能（串行化），所以只在真正有共享状态时使用。**能用 channel 解决的，优先用 channel**。

---

## Mutex vs RWMutex

| 特性 | `sync.Mutex` | `sync.RWMutex` |
|------|-------------|----------------|
| 语义 | 互斥锁：写写、读写、读读均互斥 | 读写锁：读读并发，写写/读写互斥 |
| 适用场景 | 读写比例接近或以写为主 | 读多写少（读 >> 写） |
| 性能 | 单次 Lock/Unlock 更快 | 高并发读时吞吐量更高 |
| 方法 | `Lock()` / `Unlock()` | `Lock()`/`Unlock()` + `RLock()`/`RUnlock()` |

```go
package main

import (
    "fmt"
    "sync"
)

// 读多写少的计数器——用 RWMutex
type SafeCounter struct {
    mu sync.RWMutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()         // 写锁：独占
    defer c.mu.Unlock()
    c.v[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.RLock()         // 读锁：可并发
    defer c.mu.RUnlock()
    return c.v[key]
}

func main() {
    c := &SafeCounter{v: make(map[string]int)}
    var wg sync.WaitGroup

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc("key")
        }()
    }
    wg.Wait()
    fmt.Println(c.Value("key")) // 100
}
```

**锁不可复制**：`sync.Mutex` 和 `sync.RWMutex` 包含状态，复制后行为未定义。使用时必须通过指针传递包含锁的结构体。`go vet` 会检测锁复制。

```go
// 错误：复制了锁
c := SafeCounter{v: make(map[string]int)}
c2 := c // go vet 会报错：copies lock value

// 正确：传指针
func process(c *SafeCounter) { ... }
```

---

## WaitGroup：正确的 Add 位置

`sync.WaitGroup` 用于等待一组 goroutine 完成。

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup
    results := make([]int, 5)

    for i := 0; i < 5; i++ {
        wg.Add(1) // Add 必须在 goroutine 启动前调用
        go func(idx int) {
            defer wg.Done()
            results[idx] = idx * idx
        }(i)
    }

    wg.Wait()
    fmt.Println(results) // [0 1 4 9 16]
}
```

**常见错误：在 goroutine 内部调用 Add**

```go
// 错误：可能在 wg.Wait() 执行后才调用 wg.Add(1)
for i := 0; i < 5; i++ {
    go func(idx int) {
        wg.Add(1) // 竞态：wg.Wait() 可能已经返回了
        defer wg.Done()
        // ...
    }(i)
}
wg.Wait() // 可能在所有 goroutine 启动前就返回
```

规则：**`wg.Add(n)` 必须在启动对应 goroutine 之前调用**，且在 `wg.Wait()` 之前。

---

## sync.Once：线程安全单例

`sync.Once` 保证某段代码在整个程序生命周期内只执行一次，常用于单例初始化。

```go
package main

import (
    "fmt"
    "sync"
)

type Config struct {
    DSN string
}

var (
    instance *Config
    once     sync.Once
)

func GetConfig() *Config {
    once.Do(func() {
        // 只执行一次，即使多个 goroutine 同时调用
        instance = &Config{DSN: "postgres://localhost/mydb"}
        fmt.Println("config initialized")
    })
    return instance
}

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            cfg := GetConfig()
            _ = cfg
        }()
    }
    wg.Wait()
    // "config initialized" 只打印一次
}
```

**注意**：`once.Do` 中的 panic 不会重置 Once；即使第一次调用 panic，后续调用也不会再执行该函数。

---

## sync/atomic：无锁基础操作

`sync/atomic` 提供对整数和指针的原子操作，比 mutex 开销更低，但只适合**简单的单变量**操作。

```go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var counter int64

    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            atomic.AddInt64(&counter, 1) // 原子加 1
        }()
    }
    wg.Wait()
    fmt.Println(atomic.LoadInt64(&counter)) // 1000
}
```

| 操作 | 函数 |
|------|------|
| 原子加 | `atomic.AddInt64(&v, delta)` |
| 原子读 | `atomic.LoadInt64(&v)` |
| 原子写 | `atomic.StoreInt64(&v, val)` |
| CAS | `atomic.CompareAndSwapInt64(&v, old, new)` |
| Swap | `atomic.SwapInt64(&v, new)` |

Go 1.19+ 推荐使用 `atomic.Int64`（方法形式，更安全）：

```go
var counter atomic.Int64
counter.Add(1)
fmt.Println(counter.Load())
```

**何时用 atomic vs mutex**：单个整数/指针的读写用 atomic；多个变量需要原子性更新时用 mutex（atomic 无法保证跨变量的原子性）。

---

## errgroup：并发任务的错误聚合

`golang.org/x/sync/errgroup` 是 `sync.WaitGroup` 的增强版，支持收集并发任务的第一个错误。

```bash
go get golang.org/x/sync@v0.7.0
```

```go
package main

import (
    "context"
    "fmt"
    "net/http"

    "golang.org/x/sync/errgroup"
)

func fetchURL(ctx context.Context, url string) error {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return fmt.Errorf("fetch %s: %w", url, err)
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return fmt.Errorf("fetch %s: %w", url, err)
    }
    defer resp.Body.Close()
    fmt.Printf("fetched %s: %d\n", url, resp.StatusCode)
    return nil
}

func main() {
    urls := []string{
        "https://go.dev",
        "https://pkg.go.dev",
        "https://invalid.example.invalid", // 这个会失败
    }

    // WithContext：任意一个任务出错，ctx 会被取消
    g, ctx := errgroup.WithContext(context.Background())

    for _, url := range urls {
        url := url // Go 1.22 前需要创建副本
        g.Go(func() error {
            return fetchURL(ctx, url)
        })
    }

    if err := g.Wait(); err != nil {
        fmt.Println("first error:", err)
    }
}
```

**errgroup 的优势**：

- 自动等待所有 goroutine 完成（等价于 WaitGroup）
- 收集第一个非 nil error 并返回
- `errgroup.WithContext` 版本：任意一个任务出错，自动取消其他任务的 context

---

## 死锁排查思路

死锁发生时，Go runtime 会检测到所有 goroutine 都在等待，触发：

```
fatal error: all goroutines are asleep - deadlock!
```

**常见死锁模式**：

```go
// 模式 1：同一 goroutine 重复加锁（非可重入）
var mu sync.Mutex
mu.Lock()
mu.Lock() // 死锁：等待自己持有的锁

// 模式 2：A 等 B，B 等 A
var mu1, mu2 sync.Mutex
go func() { mu1.Lock(); mu2.Lock(); ... }
go func() { mu2.Lock(); mu1.Lock(); ... } // 循环等待

// 模式 3：向满了的无缓冲 channel 发送
ch := make(chan int)
ch <- 1 // 单 goroutine 死锁：没有接收者
```

**排查步骤**：

1. 运行程序，触发死锁，查看 Go runtime 输出的 goroutine 栈（会打印所有 goroutine 的阻塞位置）
2. 通过 pprof `/debug/pprof/goroutine?debug=2` 获取完整栈
3. 分析等待关系：找出"A 等 B，B 等 A"的循环
