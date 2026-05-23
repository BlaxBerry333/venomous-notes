---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__3.md
---

# Context 使用指南：取消传播、超时控制与值传递

**本文解决什么问题**：搞清楚 WithCancel/WithTimeout/WithDeadline/WithValue 的适用场景，理解为何 context 必须作为第一个参数，以及什么值该放进 context、什么不该放。

**前置知识**：[04-concurrency-model](./x04-concurrency-model.md)（goroutine）；[05-channel-patterns](./x05-channel-patterns.md)（done channel 概念）。

---

## TypeScript 类比：AbortController

如果你用过 `fetch` 的取消功能，Go 的 context 就很好理解：

```typescript
// TypeScript：AbortController 取消 fetch
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // 5 秒后取消

const resp = await fetch(url, { signal: controller.signal });
```

Go 的 context 做的是同样的事，但更彻底——它能贯穿整个调用链：

```go
// Go：WithTimeout 取消整个调用链
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// ctx 会传给所有下游调用，任何一层都能响应取消
result, err := service.DoWork(ctx)
```

对应关系：

| TypeScript (AbortController) | Go (context) |
|-----------------------------|-------------|
| `new AbortController()` | `context.WithCancel(ctx)` |
| `controller.abort()` | `cancel()` |
| `signal.aborted` | `ctx.Done()` 关闭 |
| 只影响单个 fetch | 影响整个调用树（自动传播给子 context） |

---

## Context 接口

```go
type Context interface {
    // Done 返回一个 channel，当 Context 被取消或超时时关闭
    // 如果 Context 永不取消，返回 nil
    Done() <-chan struct{}

    // Err 返回 Done 被关闭的原因
    // context.Canceled：被取消
    // context.DeadlineExceeded：超时
    // Done 未关闭时返回 nil
    Err() error

    // Deadline 返回截止时间
    // 未设置截止时间时 ok=false
    Deadline() (deadline time.Time, ok bool)

    // Value 返回与 key 关联的请求域值
    Value(key any) any
}
```

**设计要点**：

- `Done()` 返回的是 **receive-only channel**（`<-chan struct{}`），调用方只能接收，不能关闭或发送
- 这确保了子操作无法取消父 context——只有持有 `CancelFunc` 的调用方才能取消
- Context 形成树形结构：parent 被取消时，所有 derived contexts 自动取消

---

## 四个衍生函数对比

| 函数 | 触发取消条件 | 返回 CancelFunc？ | 典型场景 |
|------|-------------|-------------------|---------|
| `context.Background()` | 永不取消 | 否 | main、init、测试的根 context |
| `context.TODO()` | 永不取消 | 否 | 待确定 context 来源的占位符 |
| `WithCancel(parent)` | 手动调用 cancel() 或 parent 被取消 | 是 | 需要外部信号中止的长期操作 |
| `WithTimeout(parent, d)` | d 时间后或 parent 被取消 | 是 | RPC 调用、数据库查询 |
| `WithDeadline(parent, t)` | 到达绝对时间 t 或 parent 被取消 | 是 | 需要与请求截止时间对齐 |
| `WithValue(parent, k, v)` | 不取消（仅传值） | 否 | 传递 trace ID、auth token |

### WithCancel：手动取消

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func worker(ctx context.Context, id int) {
    for {
        select {
        case <-ctx.Done():
            fmt.Printf("worker %d stopped: %v\n", id, ctx.Err())
            return
        default:
            fmt.Printf("worker %d working...\n", id)
            time.Sleep(200 * time.Millisecond)
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel() // 确保资源释放

    for i := 0; i < 3; i++ {
        go worker(ctx, i)
    }

    time.Sleep(600 * time.Millisecond)
    cancel() // 广播取消信号，所有 worker 退出
    time.Sleep(100 * time.Millisecond)
    fmt.Println("all workers stopped")
}
```

### WithTimeout 和 WithDeadline

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func slowQuery(ctx context.Context) (string, error) {
    // 模拟耗时 2 秒的数据库查询
    result := make(chan string, 1)
    go func() {
        time.Sleep(2 * time.Second)
        result <- "query result"
    }()

    select {
    case r := <-result:
        return r, nil
    case <-ctx.Done():
        return "", fmt.Errorf("slowQuery: %w", ctx.Err())
    }
}

func main() {
    // WithTimeout：相对时间（1 秒后超时）
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()

    r, err := slowQuery(ctx)
    if err != nil {
        fmt.Println("error:", err) // error: slowQuery: context deadline exceeded
        return
    }
    fmt.Println(r)
}
```

**WithTimeout vs WithDeadline**：

```go
// WithTimeout 是 WithDeadline 的语法糖：
ctx, cancel := context.WithTimeout(parent, 5*time.Second)
// 等价于：
deadline := time.Now().Add(5 * time.Second)
ctx, cancel := context.WithDeadline(parent, deadline)
```

**Deadline 继承**：子 context 的实际 deadline = `min(自身设置的 deadline, parent 的 deadline)`。即使你设置了 10 秒超时，如果上游请求的 context 只剩 3 秒，子 context 会在 3 秒时取消。

```go
// HTTP handler 中的 deadline 继承示例
func handler(w http.ResponseWriter, r *http.Request) {
    // r.Context() 已包含入站请求的 deadline（由 HTTP server 设置）
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()
    // 实际超时 = min(5s, 请求剩余时间)
    result, err := db.QueryContext(ctx, "SELECT ...")
    // ...
}
```

---

## context 必须作为第一个参数

Google 的 Go 编码规范要求：**context 必须是函数签名的第一个参数，命名为 `ctx`**。

```go
// 正确
func Search(ctx context.Context, query string) (Results, error)
func FetchUser(ctx context.Context, userID int64) (*User, error)

// 错误：context 不应该嵌在结构体中
type Request struct {
    ctx context.Context // 不要这样做
    // ...
}
```

**原因**：

1. **统一约定**：所有 Go 开发者能立即识别函数是否支持取消和超时
2. **避免隐式传递**：结构体存储 context 容易造成"过时 context"被意外复用
3. **测试友好**：调用时可以传入 `context.Background()` 或带超时的 context，无需修改结构

---

## 什么该放进 context，什么不该

### 该放：请求域的横切关注点

```go
package main

import (
    "context"
    "fmt"
    "net"
)

// 使用未导出类型作为 key，防止不同包之间的 key 冲突
type contextKey int

const (
    traceIDKey contextKey = iota
    userIPKey
)

// 封装 setter/getter，不直接暴露 key
func WithTraceID(ctx context.Context, traceID string) context.Context {
    return context.WithValue(ctx, traceIDKey, traceID)
}

func TraceIDFromContext(ctx context.Context) (string, bool) {
    v, ok := ctx.Value(traceIDKey).(string)
    return v, ok
}

func WithUserIP(ctx context.Context, ip net.IP) context.Context {
    return context.WithValue(ctx, userIPKey, ip)
}

func UserIPFromContext(ctx context.Context) (net.IP, bool) {
    v, ok := ctx.Value(userIPKey).(net.IP)
    return v, ok
}

func main() {
    ctx := context.Background()
    ctx = WithTraceID(ctx, "abc-123")
    ctx = WithUserIP(ctx, net.ParseIP("192.168.1.1"))

    if id, ok := TraceIDFromContext(ctx); ok {
        fmt.Println("trace:", id)
    }
}
```

**适合放进 context 的值**：

- Trace ID / Span ID（链路追踪）
- 认证 token / 用户 ID（请求级别的身份信息）
- 调用来源 IP
- 实验标志（A/B 测试 flag）

### 不该放：业务数据

```go
// 错误：数据库连接、业务参数不应该放进 context
ctx = context.WithValue(ctx, "db", dbConn)        // 不要
ctx = context.WithValue(ctx, "userID", 12345)     // 不要（用函数参数）
ctx = context.WithValue(ctx, "pageSize", 20)      // 不要（用函数参数）
```

**判断标准**：如果这个值是某个特定调用的**业务参数**，用显式函数参数传递。context 只承载与请求**身份和生命周期**相关的横切数据。

---

## HTTP 和 gRPC 中的 deadline 自动传递

### net/http

```go
// HTTP server：每个请求的 context 在连接关闭时自动取消
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context() // 已经是带取消能力的 context
    // 向下传递 ctx，一旦客户端断开连接，ctx 被取消
    result, err := service.DoWork(ctx)
    // ...
}
```

### gRPC

gRPC 会将客户端设置的 deadline 序列化到请求元数据中，服务端自动恢复并创建对应的 context：

```go
// 客户端：设置 deadline
ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()
resp, err := client.SomeRPC(ctx, req) // deadline 通过 gRPC metadata 传递

// 服务端：ctx 已包含客户端设置的 deadline
func (s *server) SomeRPC(ctx context.Context, req *pb.Request) (*pb.Response, error) {
    // 如果客户端的 3 秒 deadline 到达，ctx 自动取消
    result, err := s.db.QueryContext(ctx, "SELECT ...")
    // ...
}
```
