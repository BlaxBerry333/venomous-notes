---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__9.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__10.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__8.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
---

# Go 泛型实战：约束语法、适用场景与 interface{} 的取舍

**本文解决什么问题**：快速掌握 Go 1.18+ 泛型语法（Go 1.23 可用），能判断"这里该用泛型、接口还是 interface{}"，并结合实际项目代码理解泛型的价值。

**前置知识**：[08-interface-design](./x08-interface-design.md)（接口基础）。TypeScript 开发者天然熟悉泛型语法（`Array<T>`、`Promise<T>`），Go 泛型在 1.18 引入，语法类似但约束机制不同。

---

## 泛型语法快速上手

### 泛型函数

```go
package main

import "fmt"

// [T comparable] 是类型参数列表，comparable 是约束
// comparable：支持 == 和 != 操作的类型集合
func Contains[T comparable](slice []T, target T) bool {
    for _, v := range slice {
        if v == target {
            return true
        }
    }
    return false
}

func main() {
    // 隐式类型推导：T 从参数推导为 int
    fmt.Println(Contains([]int{1, 2, 3}, 2))          // true
    fmt.Println(Contains([]string{"a", "b"}, "c"))    // false

    // 显式类型实例化（类型推导失败时才需要）
    fmt.Println(Contains[int]([]int{1, 2, 3}, 4))     // false
}
```

### [T any]：无约束（等价于 interface{}）

```go
package main

import "fmt"

// any 是 interface{} 的别名，表示接受任意类型
func Map[T, U any](slice []T, f func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = f(v)
    }
    return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
    var result []T
    for _, v := range slice {
        if pred(v) {
            result = append(result, v)
        }
    }
    return result
}

func main() {
    nums := []int{1, 2, 3, 4, 5}

    doubled := Map(nums, func(n int) int { return n * 2 })
    fmt.Println(doubled) // [2 4 6 8 10]

    evens := Filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(evens) // [2 4]

    // 类型转换：int → string
    strs := Map(nums, func(n int) string { return fmt.Sprintf("%d", n) })
    fmt.Println(strs) // [1 2 3 4 5]
}
```

### ~int：底层类型约束

`~T` 表示"所有底层类型为 T 的类型"，包括 `type MyInt int` 这样的自定义类型。

```go
package main

import "fmt"

// 约束：底层类型为 int 或 float64 的类型
type Number interface {
    ~int | ~int32 | ~int64 | ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

// 自定义类型（底层类型为 int）也满足 ~int 约束
type Celsius float64
type Fahrenheit float64

type Temperature interface {
    ~float64
}

func MaxTemp[T Temperature](a, b T) T {
    if a > b {
        return a
    }
    return b
}

func main() {
    fmt.Println(Sum([]int{1, 2, 3, 4, 5}))      // 15
    fmt.Println(Sum([]float64{1.1, 2.2, 3.3}))  // 6.6000000000000005

    c1, c2 := Celsius(36.6), Celsius(37.2)
    fmt.Println(MaxTemp(c1, c2)) // 37.2
}
```

---

## 泛型类型：通用数据结构

```go
package main

import "fmt"

// 泛型栈（Stack）
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    var zero T
    if len(s.items) == 0 {
        return zero, false
    }
    last := len(s.items) - 1
    item := s.items[last]
    s.items = s.items[:last]
    return item, true
}

func (s *Stack[T]) Len() int {
    return len(s.items)
}

func main() {
    // int 栈
    var intStack Stack[int]
    intStack.Push(1)
    intStack.Push(2)
    intStack.Push(3)

    for intStack.Len() > 0 {
        v, _ := intStack.Pop()
        fmt.Print(v, " ") // 3 2 1
    }
    fmt.Println()

    // string 栈——同一实现，不同类型
    var strStack Stack[string]
    strStack.Push("go")
    strStack.Push("generics")
    v, _ := strStack.Pop()
    fmt.Println(v) // generics
}
```

---

## 何时用泛型、何时用 interface{}

这是面试必考的判断题。决策框架：

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 需要调用值上的方法 | 接口 | 简单直接，性能相同 |
| 不同类型有不同实现逻辑 | 接口 | 泛型无法区分类型行为 |
| 操作 slice/map/channel，不关心元素类型 | 泛型 | 类型安全，避免 interface{} 拆箱 |
| 通用数据结构（Stack/Queue/Tree） | 泛型 | 类型安全，无需类型断言 |
| 多种类型共享完全相同的实现 | 泛型 | 消除代码重复 |
| 类型在运行时才知道 | 反射 | 泛型在编译期确定 |

### 反例：不要用泛型替换接口

```go
// 错误：只需要调用 Read 方法，用泛型反而复杂
func ReadSome[T io.Reader](r T) ([]byte, error) {
    return io.ReadAll(r)
}

// 正确：接口参数更简洁，性能也一样
func ReadSome(r io.Reader) ([]byte, error) {
    return io.ReadAll(r)
}
```

---

## 实战：TTL Cache 中的泛型类型参数

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// TTLCache 是一个带过期时间的泛型缓存
// K 必须是可比较的（用作 map key）
// V 可以是任意类型
type TTLCache[K comparable, V any] struct {
    mu    sync.RWMutex
    items map[K]cacheItem[V]
    ttl   time.Duration
}

type cacheItem[V any] struct {
    value     V
    expiresAt time.Time
}

func NewTTLCache[K comparable, V any](ttl time.Duration) *TTLCache[K, V] {
    c := &TTLCache[K, V]{
        items: make(map[K]cacheItem[V]),
        ttl:   ttl,
    }
    // 启动后台清理 goroutine
    go c.cleanup()
    return c
}

func (c *TTLCache[K, V]) Set(key K, value V) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = cacheItem[V]{
        value:     value,
        expiresAt: time.Now().Add(c.ttl),
    }
}

func (c *TTLCache[K, V]) Get(key K) (V, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    item, ok := c.items[key]
    if !ok || time.Now().After(item.expiresAt) {
        var zero V
        return zero, false
    }
    return item.value, true
}

func (c *TTLCache[K, V]) cleanup() {
    ticker := time.NewTicker(c.ttl / 2)
    defer ticker.Stop()
    for range ticker.C {
        c.mu.Lock()
        now := time.Now()
        for k, item := range c.items {
            if now.After(item.expiresAt) {
                delete(c.items, k)
            }
        }
        c.mu.Unlock()
    }
}

func main() {
    // int key, string value 的缓存
    cache := NewTTLCache[int, string](5 * time.Second)
    cache.Set(1, "hello")
    cache.Set(2, "world")

    if v, ok := cache.Get(1); ok {
        fmt.Println(v) // hello
    }

    // string key, struct value 的缓存——同一实现
    type User struct{ Name string }
    userCache := NewTTLCache[string, User](10 * time.Second)
    userCache.Set("alice", User{Name: "Alice"})

    if u, ok := userCache.Get("alice"); ok {
        fmt.Println(u.Name) // Alice
    }
}
```

**泛型的价值**：不用泛型的话，需要为 `map[int]string` 和 `map[string]User` 写两份几乎相同的代码，或者用 `interface{}` 牺牲类型安全。

---

## 实战：Event Bus 中的泛型订阅

```go
package main

import (
    "fmt"
    "sync"
)

// EventBus 是泛型事件总线，事件类型由调用方决定
type EventBus[T any] struct {
    mu          sync.RWMutex
    subscribers []func(T)
}

func (b *EventBus[T]) Subscribe(handler func(T)) {
    b.mu.Lock()
    defer b.mu.Unlock()
    b.subscribers = append(b.subscribers, handler)
}

func (b *EventBus[T]) Publish(event T) {
    b.mu.RLock()
    handlers := make([]func(T), len(b.subscribers))
    copy(handlers, b.subscribers)
    b.mu.RUnlock()

    for _, h := range handlers {
        h(event)
    }
}

type OrderEvent struct {
    OrderID int
    Status  string
}

func main() {
    bus := &EventBus[OrderEvent]{}

    bus.Subscribe(func(e OrderEvent) {
        fmt.Printf("handler 1: order %d is %s\n", e.OrderID, e.Status)
    })
    bus.Subscribe(func(e OrderEvent) {
        fmt.Printf("handler 2: notify customer for order %d\n", e.OrderID)
    })

    bus.Publish(OrderEvent{OrderID: 42, Status: "shipped"})
    // handler 1: order 42 is shipped
    // handler 2: notify customer for order 42
}
```
