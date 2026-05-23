---
slug: gin-middleware
lang: zh
---

# Gin 中间件：日志、鉴权、Panic Recovery

> **本文解决什么问题**：不修改 handler 代码的情况下，如何统一添加日志、鉴权、限流等横切逻辑——中间件的写法、执行顺序、Abort 机制一次看清楚。
>
> **前置知识**：[01-gin-basics](01-gin-basics.md)（Handler 签名）、[02-request-response](02-request-response.md)（响应格式）

---

## 中间件是什么

Gin 中间件和 Express 中间件概念完全相同：在请求到达 handler **之前**（或之后）执行的函数。

```
请求 → 中间件A → 中间件B → Handler → 中间件B（后置） → 中间件A（后置） → 响应
```

这是一个**洋葱模型**：`c.Next()` 把控制权交给下一个，`return` 之后执行"洋葱内层返回后"的逻辑。

```go
func MyMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // ① 前置逻辑（请求进来时执行）
        fmt.Println("before")

        c.Next()  // 执行后续中间件和 handler

        // ② 后置逻辑（handler 执行完后执行）
        fmt.Println("after")
    }
}
```

与 Express 对比：

| Express | Gin |
|---------|-----|
| `(req, res, next) => { next() }` | `func(c *gin.Context) { c.Next() }` |
| `next(err)` 传递错误 | `c.AbortWithStatus(500)` 终止链 |
| `app.use(mw)` | `r.Use(mw)` |
| `router.use(mw)` | `group.Use(mw)` |

---

## c.Next() vs c.Abort()

```go
func AuthMiddleware(secret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        if token != "Bearer "+secret {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
            c.Abort()  // ← 终止中间件链，后续中间件和 handler 都不执行
            return     // ← Abort 后还需要 return，否则当前函数继续执行
        }

        c.Next()  // ← 通过验证，继续执行
    }
}
```

| 方法 | 作用 |
|------|------|
| `c.Next()` | 执行链中下一个处理函数（可选，省略等同于在末尾调用） |
| `c.Abort()` | 终止链，已写入的响应不受影响 |
| `c.AbortWithStatus(code)` | 终止链 + 写入状态码 |
| `c.AbortWithStatusJSON(code, obj)` | 终止链 + 写入 JSON 响应 |

---

## 实战：Logger 中间件

记录每个请求的方法、路径、耗时、状态码：

```go
// middleware/logger.go
package middleware

import (
    "log/slog"
    "time"

    "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path  := c.Request.URL.Path

        c.Next()  // 先执行后续 handler

        // handler 执行完后，状态码才确定
        slog.Info("request",
            "method",   c.Request.Method,
            "path",     path,
            "status",   c.Writer.Status(),
            "latency",  time.Since(start),
            "client_ip", c.ClientIP(),
        )
    }
}
```

使用 Go 1.21 引入的 `log/slog`（结构化日志，适合接入 ELK/云日志）。

---

## 实战：RequestID 中间件

为每个请求注入唯一 ID，方便追踪日志：

```go
// middleware/request_id.go
package middleware

import (
    "fmt"
    "math/rand"

    "github.com/gin-gonic/gin"
)

const RequestIDKey = "X-Request-ID"

func RequestID() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 优先使用客户端传来的 ID（如果有），否则生成新的
        reqID := c.GetHeader(RequestIDKey)
        if reqID == "" {
            reqID = fmt.Sprintf("%016x", rand.Int63())
        }

        // 写入 context，后续 handler 可读取
        c.Set(RequestIDKey, reqID)
        // 回传给客户端（方便客户端关联日志）
        c.Header(RequestIDKey, reqID)

        c.Next()
    }
}

// 在 handler 中读取
func someHandler(c *gin.Context) {
    reqID, _ := c.Get(RequestIDKey)
    slog.Info("handling", "req_id", reqID)
}
```

---

## 实战：Auth 中间件（JWT 简化版）

```go
// middleware/auth.go
package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

const UserIDKey = "user_id"

// 简化版：生产环境应该用真正的 JWT 库验证签名
func Auth(validTokens map[string]int) gin.HandlerFunc {
    return func(c *gin.Context) {
        header := c.GetHeader("Authorization")
        if !strings.HasPrefix(header, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "缺少 Authorization header",
            })
            return
        }

        token := strings.TrimPrefix(header, "Bearer ")
        userID, ok := validTokens[token]
        if !ok {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "无效 token",
            })
            return
        }

        // 把 userID 存入 context，下游 handler 直接读取
        c.Set(UserIDKey, userID)
        c.Next()
    }
}

// handler 中读取
func protectedHandler(c *gin.Context) {
    userID := c.GetInt(UserIDKey)
    c.JSON(200, gin.H{"user_id": userID})
}
```

---

## 实战：Panic Recovery 中间件

`gin.Default()` 内置的 Recovery 捕获 panic，但你通常需要自定义格式，返回统一的 500 响应：

```go
// middleware/recovery.go
package middleware

import (
    "log/slog"
    "net/http"

    "github.com/gin-gonic/gin"
)

func Recovery() gin.HandlerFunc {
    return gin.CustomRecovery(func(c *gin.Context, recovered any) {
        // recovered 是 panic 的值，可以是 error 或任意类型
        slog.Error("panic recovered",
            "error", recovered,
            "path",  c.Request.URL.Path,
        )
        c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
            "error": "服务器内部错误",
        })
    })
}
```

---

## 全局中间件 vs 路由组中间件

```go
r := gin.New()  // 不用 Default，自己挂中间件

// 全局：对所有路由生效
r.Use(middleware.Recovery())
r.Use(middleware.RequestID())
r.Use(middleware.Logger())

// 公开路由：不需要鉴权
public := r.Group("/api/v1")
{
    public.GET("/books", h.List)
    public.GET("/books/:id", h.Get)
}

// 需要鉴权的路由
tokens := map[string]int{"secret-token": 1}  // token → userID
private := r.Group("/api/v1")
private.Use(middleware.Auth(tokens))
{
    private.POST("/books", h.Create)
    private.PUT("/books/:id", h.Update)
    private.DELETE("/books/:id", h.Delete)
}
```

---

## 中间件执行顺序可视化

假设注册顺序：`Recovery → RequestID → Logger → [Auth →] Handler`

```
请求进来
  ↓
Recovery.前置（设置 defer，捕获 panic）
  ↓
RequestID.前置（生成/读取 ID，c.Set）
  ↓
Logger.前置（记录 start time）
  ↓
Auth.前置（验证 token，失败则 Abort）
  ↓
Handler（业务逻辑）
  ↓
Logger.后置（记录耗时、状态码）
  ↓
RequestID.后置（写 response header）
  ↓
Recovery.后置（如果 panic 已经被捕获，走自定义响应）
  ↓
响应发送
```

Abort 之后，**已经执行过 `c.Next()` 的中间件的后置逻辑仍会运行**（因为 Abort 只阻止后续中间件，不影响已经进入 Next 的调用栈）。

---

## c.Set / c.Get 类型安全读取

```go
// 写入
c.Set("user_id", 42)
c.Set("user_name", "alice")

// 读取——类型安全的帮助方法
userID   := c.GetInt("user_id")       // int
userName := c.GetString("user_name")  // string
flag     := c.GetBool("is_admin")     // bool

// 泛型方式（Go 1.18+）
// 注意：Gin 暂无原生泛型 Get，用类型断言
val, exists := c.Get("user_id")
if !exists { /* 处理不存在 */ }
id, ok := val.(int)
```

---

## 完整 main.go（集成所有中间件）

```go
// main.go
package main

import (
    "github.com/yourname/books-api/handler"
    "github.com/yourname/books-api/middleware"
    "github.com/yourname/books-api/store"
    "github.com/gin-gonic/gin"
)

func main() {
    s := store.New()
    h := handler.NewBooksHandler(s)

    r := gin.New()
    r.Use(middleware.Recovery())
    r.Use(middleware.RequestID())
    r.Use(middleware.Logger())

    public := r.Group("/api/v1")
    {
        public.GET("/books", h.List)
        public.GET("/books/:id", h.Get)
    }

    tokens := map[string]int{"my-secret-token": 1}
    private := r.Group("/api/v1")
    private.Use(middleware.Auth(tokens))
    {
        private.POST("/books", h.Create)
        private.PUT("/books/:id", h.Update)
        private.DELETE("/books/:id", h.Delete)
    }

    r.Run(":8080")
}
```

测试：

```bash
# 公开接口，无 token 可访问
curl http://localhost:8080/api/v1/books

# 需要鉴权
curl -X POST http://localhost:8080/api/v1/books \
  -H "Authorization: Bearer my-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Me","year":2024}'

# 无 token 返回 401
curl -X POST http://localhost:8080/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Me","year":2024}'
```
