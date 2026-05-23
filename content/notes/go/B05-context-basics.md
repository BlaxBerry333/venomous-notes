---
slug: go-context-basics
lang: zh
---

# context.Context：超时、取消、请求追踪

> **本文解决什么问题**：`context.Context` 出现在几乎所有 Go 后端代码里——函数第一个参数永远是 `ctx context.Context`。本文讲清楚它是什么、四种创建方式各自的适用场景，以及为什么不能把它用来传业务数据。
>
> **前置知识**：[B03-goroutines](./B03-goroutines.md)（goroutine、channel、select 基础）

---

## context 是什么

`context.Context` 是一个接口，它携带三类信息，随调用链向下传递：

```
context.Context
├── 截止时间（Deadline）：这个操作最晚在什么时候结束
├── 取消信号（Done channel）：上层叫停时通知下层
└── 键值对（Value）：请求级别的元数据（trace ID、用户 ID）
```

TypeScript 里没有对应概念——因为 TypeScript 是单线程事件循环，用 `AbortSignal` 做取消，但没有跨函数调用链传递超时/取消的标准机制。Go 的 context 是专门为多 goroutine、跨服务调用设计的。

---

## 四种创建方式

### context.Background() 和 context.TODO()

根 context，不能被取消，没有截止时间：

```go
// 程序入口、main 函数、顶层 HTTP handler：用 Background
ctx := context.Background()

// 还不确定用哪个，作为占位符：用 TODO（IDE/lint 会提醒你补全）
ctx := context.TODO()
```

---

### context.WithCancel：主动取消

返回一个可以被取消的 context 和一个 `cancel` 函数：

```go
ctx, cancel := context.WithCancel(context.Background())
defer cancel()  // 必须调用，否则 goroutine 泄漏

go func() {
    select {
    case <-ctx.Done():
        fmt.Println("取消了:", ctx.Err())  // context canceled
    case result := <-doWork():
        fmt.Println("完成:", result)
    }
}()

time.Sleep(100 * time.Millisecond)
cancel()  // 主动取消，触发上面 goroutine 的 <-ctx.Done()
```

`cancel()` 的作用：关闭 `ctx.Done()` channel，所有监听这个 channel 的 goroutine 都会被通知到。

---

### context.WithTimeout：操作级超时

最常用，适合"这个 DB 查询/HTTP 请求最多等 500ms"：

```go
func fetchUser(id int) (*User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
    defer cancel()  // 无论超时还是正常完成，都要 cancel 释放资源

    return db.QueryUser(ctx, id)  // db 驱动在 ctx 超时时会中止查询
}
```

超时后 `ctx.Err()` 返回 `context.DeadlineExceeded`。

---

### context.WithDeadline：绝对时间截止

和 `WithTimeout` 类似，但指定的是具体时间点而不是持续时间：

```go
deadline := time.Now().Add(2 * time.Hour)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()
```

实际场景：业务批处理任务必须在凌晨 2 点前完成。大多数情况下 `WithTimeout` 更常用。

---

### context.WithValue：传递请求级数据

把键值对附加到 context，整个调用链都能读取：

```go
// 定义私有类型作为 key（避免与其他包冲突）
type ctxKeyReqID struct{}

// 写入
ctx = context.WithValue(ctx, ctxKeyReqID{}, "req-abc-123")

// 读取（需要类型断言）
if reqID, ok := ctx.Value(ctxKeyReqID{}).(string); ok {
    slog.Info("handling request", "req_id", reqID)
}
```

**为什么用私有结构体类型而不是字符串？**

```go
// ❌ 字符串 key：任何包都能读写 "user_id"，容易冲突覆盖
ctx = context.WithValue(ctx, "user_id", 42)

// ✅ 私有类型：只有定义它的包能访问，外部包无法意外覆盖
type ctxKeyUserID struct{}
ctx = context.WithValue(ctx, ctxKeyUserID{}, 42)
```

---

## 传递规范

```go
// 正确：ctx 永远是第一个参数，命名永远是 ctx
func (s *UserService) GetUser(ctx context.Context, id int) (*User, error)
func (r *UserRepo) FindByID(ctx context.Context, id int) (*User, error)

// 错误：把 context 藏进结构体
type BadService struct {
    ctx context.Context  // ❌ 不要这样做
}
```

**为什么不存在结构体里？** context 是**请求级别**的，每次请求都不同（不同的超时、不同的取消信号）。结构体是可以复用的，把请求级别的东西放进去会导致生命周期混乱。

---

## 取消信号的传播

context 的取消是**级联**的：父 context 取消，所有派生的子 context 也会被取消。

```
Background
  └── WithTimeout(5s) — 超时后取消
        └── WithCancel — 继承父超时，也可以被提前 cancel
              └── WithValue — 同上
```

```go
parent, parentCancel := context.WithTimeout(context.Background(), 5*time.Second)
defer parentCancel()

child, childCancel := context.WithCancel(parent)
defer childCancel()

// parent 超时 → child 的 Done channel 也会关闭
// childCancel() → 只影响 child，不影响 parent
```

---

## 什么不应该放进 context

`WithValue` 很方便，但容易被滥用：

| 应该放 | 不应该放 |
|--------|---------|
| Request ID / Trace ID | 函数参数（title、user input）|
| 认证信息（已验证的 user） | 数据库连接 |
| Span（分布式追踪） | 配置项 |

**判断标准**：如果去掉这个值，函数逻辑本身是否还能正确描述出来？能 → 用函数参数。不能（比如 trace ID，它对业务逻辑没有影响，但对可观测性不可少）→ 才考虑放 context。

---

## 检测 ctx 是否已取消

```go
func doWork(ctx context.Context) error {
    for {
        // 每轮循环检查一次
        select {
        case <-ctx.Done():
            return ctx.Err()  // context.Canceled 或 context.DeadlineExceeded
        default:
        }

        // 执行一轮工作
        if err := processNext(ctx); err != nil {
            return err
        }
    }
}
```

---

## 和 Gin 的关联

Gin 的 `*gin.Context` 内部包含一个 `context.Context`，通过 `c.Request.Context()` 获取。Gin 文档 [04-gin-with-context](../go-gin/04-gin-with-context.md) 的全部内容都建立在本文的基础上：

```go
// Gin handler 中的标准写法
func (h *BooksHandler) Get(c *gin.Context) {
    ctx, cancel := context.WithTimeout(c.Request.Context(), 500*time.Millisecond)
    defer cancel()

    book, err := h.service.GetBook(ctx, id)  // 传标准库 ctx，不传 *gin.Context
    // ...
}
```
