---
slug: gin-with-context
lang: zh
---

# Gin 与 context.Context：超时、取消、请求追踪

> **本文解决什么问题**：`*gin.Context` 和 `context.Context` 是两个不同的东西——搞清楚它们的关系，以及如何在 Gin 的 handler → service → DB 调用链中正确传递标准库 context，实现超时和取消传播。
>
> **前置知识**：[03-middleware](03-middleware.md)、[Go x07-context-guide](../go/x07-context-guide.md)（context 基础）

---

## 两个 Context 的关系

```
*gin.Context                    context.Context（标准库）
──────────────────              ──────────────────────────
HTTP 请求/响应的容器              控制调用链的生命周期
c.Param / c.Query               ctx.Value / ctx.Done
c.JSON / c.Status               ctx.Err / ctx.Deadline
c.Set / c.Get                   context.WithCancel/Timeout
                                可以穿越 goroutine、gRPC、DB 调用
```

`*gin.Context` 包含一个标准库 context，通过 `c.Request.Context()` 获取：

```go
func handler(c *gin.Context) {
    // c 是 Gin 的 Context，用于 HTTP 层（读参数、写响应）
    ctx := c.Request.Context()  // 标准库 context，传给 service/DB 层
    
    result, err := myService.DoWork(ctx, params)  // ← 传 ctx，不传 c
    // ...
}
```

**原则：handler 层以下（service、repository、DB）只接受 `context.Context`，不接受 `*gin.Context`。** 这样 service 层就不依赖 Gin，可以被 CLI、gRPC 等复用。

---

## 为什么要传 context

当客户端断开连接（浏览器关闭、网络中断、代理超时），`c.Request.Context()` 会被取消。如果你的 handler 正在等待一个耗时的 DB 查询，正确传递 context 意味着：

```
客户端断开
  → c.Request.Context() 被取消
  → DB 查询的 ctx.Done() 触发
  → DB 驱动中止查询
  → 不浪费数据库资源
```

不传 context 则无法实现这个级联取消。

---

## 完整示例：带超时的 Service 调用

### Service 层（不依赖 Gin）

```go
// service/books.go
package service

import (
    "context"
    "fmt"
    "time"

    "github.com/yourname/books-api/store"
)

type BooksService struct {
    store *store.Store
}

func NewBooksService(s *store.Store) *BooksService {
    return &BooksService{store: s}
}

// GetBook 模拟一个可能耗时的操作（如 DB 查询）
func (s *BooksService) GetBook(ctx context.Context, id int) (*store.Book, error) {
    // 模拟 DB 延迟
    select {
    case <-time.After(100 * time.Millisecond):
        // 正常返回
    case <-ctx.Done():
        // ctx 已取消或超时
        return nil, fmt.Errorf("getBook: %w", ctx.Err())
    }

    book, ok := s.store.Get(id)
    if !ok {
        return nil, fmt.Errorf("getBook id=%d: %w", id, store.ErrNotFound)
    }
    return book, nil
}
```

### Handler 层：传递 context + 设置超时

```go
// handler/books.go
func (h *BooksHandler) Get(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, response.Error(400001, "id 格式错误"))
        return
    }

    // 从请求 context 派生，加 500ms 超时
    ctx, cancel := context.WithTimeout(c.Request.Context(), 500*time.Millisecond)
    defer cancel()  // 必须 defer cancel，否则 goroutine 泄漏

    book, err := h.service.GetBook(ctx, id)
    if err != nil {
        switch {
        case errors.Is(err, store.ErrNotFound):
            c.JSON(http.StatusNotFound, response.Error(404001, "书不存在"))
        case errors.Is(err, context.DeadlineExceeded):
            c.JSON(http.StatusGatewayTimeout, response.Error(504001, "查询超时"))
        case errors.Is(err, context.Canceled):
            // 客户端主动断开，不需要返回响应，记录日志即可
            slog.Warn("client disconnected", "id", id)
        default:
            c.JSON(http.StatusInternalServerError, response.Error(500001, "服务器错误"))
        }
        return
    }

    c.JSON(http.StatusOK, response.Success(book))
}
```

---

## 在中间件中传递数据 vs context.Value

两种方式都能把数据传递给 handler，区别：

| | `c.Set` / `c.Get` | `context.WithValue` |
|--|-------------------|---------------------|
| 作用域 | 当前 HTTP 请求的 Gin 处理链 | 整个调用树（包括 service/DB） |
| 类型安全 | `GetString/GetInt` 帮助方法 | 需要类型断言 |
| 适合存放 | HTTP 层数据（userID、reqID） | 跨层数据（trace ID、auth token） |
| 能否传出 Gin | 否（service 层没有 `*gin.Context`） | 是（标准库 context 可以传给任何函数） |

**推荐做法**：
- HTTP 层（中间件 → handler）：用 `c.Set` / `c.Get`
- handler → service → DB：通过 context.WithValue 或函数参数显式传递

```go
// 中间件：把 userID 存入 Gin context
func Auth(tokens map[string]int) gin.HandlerFunc {
    return func(c *gin.Context) {
        // ...验证逻辑...
        c.Set("user_id", userID)
        c.Next()
    }
}

// Handler：从 Gin context 取 userID，然后放入标准库 context 传给 service
func (h *BooksHandler) Create(c *gin.Context) {
    userID := c.GetInt("user_id")

    // 用标准库 context 传给 service（不传 *gin.Context）
    ctx := context.WithValue(c.Request.Context(), ctxKeyUserID{}, userID)
    // 或者直接作为参数传递（更清晰，推荐）
    book, err := h.service.CreateBook(ctx, userID, req)
    // ...
}
```

---

## 请求追踪：Correlation ID 全链路

让 Request ID 从 HTTP → service → 日志都可见：

```go
// middleware/request_id.go

type ctxKeyReqID struct{}

func RequestID() gin.HandlerFunc {
    return func(c *gin.Context) {
        reqID := c.GetHeader("X-Request-ID")
        if reqID == "" {
            reqID = fmt.Sprintf("%016x", rand.Int63())
        }

        // 1. 存入 Gin context（给 handler 层用）
        c.Set("req_id", reqID)
        // 2. 存入标准库 context（给 service 层用）
        ctx := context.WithValue(c.Request.Context(), ctxKeyReqID{}, reqID)
        c.Request = c.Request.WithContext(ctx)
        // 3. 回传给客户端
        c.Header("X-Request-ID", reqID)

        c.Next()
    }
}

// service 层从 context 提取 req_id 用于日志
func getReqID(ctx context.Context) string {
    if v, ok := ctx.Value(ctxKeyReqID{}).(string); ok {
        return v
    }
    return "unknown"
}

func (s *BooksService) GetBook(ctx context.Context, id int) (*store.Book, error) {
    slog.Info("getBook", "req_id", getReqID(ctx), "id", id)
    // ...
}
```

使用私有类型 `ctxKeyReqID{}` 作为 context key，避免与其他包的 key 冲突（这是 Go 标准做法）。

---

## Graceful Shutdown

HTTP 服务关闭时，应该等待**进行中的请求**处理完毕，而不是强制终止：

```go
// main.go
package main

import (
    "context"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    // ...注册路由...

    srv := &http.Server{
        Addr:    ":8080",
        Handler: r,
    }

    // 非阻塞启动
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            slog.Error("listen failed", "err", err)
            os.Exit(1)
        }
    }()
    slog.Info("server started", "addr", ":8080")

    // 等待 SIGINT / SIGTERM 信号（Docker stop、kubectl delete pod 都发这个）
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    slog.Info("shutting down...")
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        slog.Error("shutdown failed", "err", err)
        os.Exit(1)
    }
    slog.Info("server exited")
}
```

`srv.Shutdown` 会：
1. 停止接受新连接
2. 等待已有连接处理完毕（最多等 30 秒）
3. 超时后强制关闭

---

## 常见错误

### 错误：在 goroutine 里直接用 c

```go
// ❌ 错误：goroutine 启动后 c 可能已经被 Gin 回收
func handler(c *gin.Context) {
    go func() {
        time.Sleep(1 * time.Second)
        c.JSON(200, gin.H{"result": "done"})  // 危险！c 已无效
    }()
    c.JSON(200, gin.H{"status": "processing"})
}
```

```go
// ✅ 正确：复制需要的数据，或者用标准库 context
func handler(c *gin.Context) {
    ctx := c.Request.Context()  // 在 goroutine 外提取 context
    param := c.Param("id")      // 提取需要的参数

    go func() {
        // 只用 ctx 和 param，不用 c
        result, err := slowOperation(ctx, param)
        if err != nil {
            slog.Error("async op failed", "err", err)
        }
        slog.Info("async done", "result", result)
    }()

    c.JSON(202, gin.H{"status": "accepted"})
}
```

### 错误：忘记 defer cancel()

```go
// ❌ 泄漏：如果 handler 提前 return，context 不会被取消
ctx, cancel := context.WithTimeout(c.Request.Context(), 500*time.Millisecond)
// 某些 return 路径没有 cancel()
```

```go
// ✅ 始终 defer cancel
ctx, cancel := context.WithTimeout(c.Request.Context(), 500*time.Millisecond)
defer cancel()
```
