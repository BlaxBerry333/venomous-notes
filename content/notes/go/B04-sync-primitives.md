---
slug: go-sync-primitives
lang: zh
---

# sync 包：互斥锁、读写锁、Once、WaitGroup

> **本文解决什么问题**：B03 里的 goroutine 和 channel 能协调"谁先谁后"，但多个 goroutine 同时读写同一块内存时，channel 并不是最合适的工具——`sync` 包才是。本文讲清楚 Mutex/RWMutex/Once/WaitGroup 各自的适用场景，以及最常见的踩坑方式。
>
> **前置知识**：[B03-goroutines](./B03-goroutines.md)（goroutine、WaitGroup 基础、data race 概念）

---

## 为什么需要锁

Go 的内存模型不保证两个 goroutine 对同一变量的访问是原子的。即使是最简单的 `counter++`，编译后也是"读 → 加 → 写"三条指令，多个 goroutine 并发执行时会产生 **data race**：

```go
var counter int

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter++  // ← data race！
        }()
    }
    wg.Wait()
    fmt.Println(counter)  // 结果不确定，可能不是 1000
}
```

`go test -race` 或 `go run -race` 会检测到这个问题：

```
WARNING: DATA RACE
Write at 0x... by goroutine 7:
  main.main.func1()
```

---

## sync.Mutex：互斥锁

同一时刻只允许一个 goroutine 进入临界区：

```go
type SafeCounter struct {
    mu    sync.Mutex
    value int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()  // 始终用 defer，避免提前 return 时忘记解锁
    c.value++
}

func (c *SafeCounter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}
```

**两条铁律**：
1. `Lock` 和 `Unlock` 必须成对——用 `defer c.mu.Unlock()` 紧跟 `Lock` 调用
2. `Mutex` 不能复制——结构体含 `sync.Mutex` 字段时，接收者必须是指针（`*SafeCounter`），否则每次调用都拿到副本，锁失效

---

## sync.RWMutex：读写锁

读多写少的场景下，`Mutex` 让读操作也互斥，性能浪费。`RWMutex` 允许多个 goroutine 同时读，但写时独占：

```go
type Store struct {
    mu    sync.RWMutex
    books map[int]Book
}

func (s *Store) Get(id int) (Book, bool) {
    s.mu.RLock()          // 读锁：多个 goroutine 可同时持有
    defer s.mu.RUnlock()
    b, ok := s.books[id]
    return b, ok
}

func (s *Store) Set(id int, b Book) {
    s.mu.Lock()           // 写锁：独占，等所有读锁释放后才能获取
    defer s.mu.Unlock()
    s.books[id] = b
}
```

对比 TypeScript：TypeScript 是单线程事件循环，没有真正的并发读写问题，也没有对应概念。

| 场景 | 用什么 |
|------|--------|
| 读写比例接近 1:1 | `sync.Mutex` |
| 读 >> 写（缓存、只读配置） | `sync.RWMutex` |
| 只有写，没有读 | `sync.Mutex` |

---

## sync.WaitGroup：等待一组 goroutine 完成

B03 已经介绍过基础用法，这里补充最关键的**踩坑点**：

```go
var wg sync.WaitGroup

// ❌ 错误：在 goroutine 内部 Add，可能 Wait 先执行
for i := 0; i < 5; i++ {
    go func() {
        wg.Add(1)  // ← goroutine 还没启动时 Wait 可能已经返回了
        defer wg.Done()
        // ...
    }()
}
wg.Wait()

// ✅ 正确：在 goroutine 启动前 Add
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        // ...
    }()
}
wg.Wait()
```

**原则：`wg.Add(n)` 必须在对应的 goroutine 启动之前调用**，否则 `Wait` 可能在 `Add` 执行前就返回。

---

## sync.Once：只执行一次

用于初始化单例，保证并发安全：

```go
var (
    instance *Config
    once     sync.Once
)

func GetConfig() *Config {
    once.Do(func() {
        // 这段代码在整个程序生命周期中只执行一次
        // 即使 100 个 goroutine 同时调用 GetConfig，也只会初始化一次
        instance = loadFromFile("config.yaml")
    })
    return instance
}
```

对比 TypeScript 中的单例：

```typescript
// TypeScript（单线程，不需要锁）
let instance: Config | null = null;
function getConfig(): Config {
    if (!instance) instance = loadConfig();
    return instance;
}
```

Go 里直接用 `if instance == nil` 判断是 **data race**（读和写没有同步），必须用 `sync.Once`。

---

## sync/atomic：无锁原子操作

对**单个数值**的简单操作，`atomic` 比 `Mutex` 快——它直接映射到 CPU 的原子指令：

```go
import "sync/atomic"

var counter int64

func inc() {
    atomic.AddInt64(&counter, 1)
}

func get() int64 {
    return atomic.LoadInt64(&counter)
}
```

适合场景：计数器、标志位、ID 生成器。不适合需要保护多个变量一致性的场景（那种情况用 Mutex）。

Go 1.19 引入了泛型版 `atomic.Int64`、`atomic.Bool` 等类型，更易用：

```go
var counter atomic.Int64

counter.Add(1)
fmt.Println(counter.Load())
```

---

## 常见错误

### 锁拷贝

```go
type Cache struct {
    mu    sync.Mutex
    data  map[string]string
}

// ❌ 值接收者 → 每次调用都复制 Cache，包括 Mutex，锁失效
func (c Cache) Get(key string) string {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.data[key]
}

// ✅ 指针接收者
func (c *Cache) Get(key string) string {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.data[key]
}
```

`go vet` 会检测"copying lock value"错误，配合 `golangci-lint` 能在 CI 中自动拦截。

### 持有锁时调用外部函数

```go
// ❌ 持有锁时调用可能也需要锁的函数，导致死锁
func (c *Cache) GetOrLoad(key string) string {
    c.mu.Lock()
    defer c.mu.Unlock()
    if v, ok := c.data[key]; ok {
        return v
    }
    return c.Load(key)  // 如果 Load 内部也要加锁 → 死锁
}
```

持有锁时只做最小操作，避免调用任何可能也需要同一把锁的函数。

---

## 和 Gin 的关联

Gin 文档 [01-gin-basics](../go-gin/01-gin-basics.md) 里的 `store.Store` 正是用 `sync.RWMutex` 保护内存中的 book 列表：

```go
type Store struct {
    mu    sync.RWMutex
    books map[int]*Book
    next  int
}

func (s *Store) Get(id int) (*Book, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    b, ok := s.books[id]
    return b, ok
}
```

读懂这段代码所需要的所有知识都在本文。
