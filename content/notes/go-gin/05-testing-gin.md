---
slug: gin-testing
lang: zh
---

# 测试 Gin Handler：httptest、Table-Driven、中间件测试

> **本文解决什么问题**：如何在不启动真实 HTTP 服务器的情况下测试 Gin handler 和中间件——用 `httptest` 包让测试快速、可重复、无端口冲突。
>
> **前置知识**：[01-gin-basics](01-gin-basics.md)、[03-middleware](03-middleware.md)、[Go x11-testing-patterns](../go/x11-testing-patterns.md)（table-driven 测试基础）

---

## 核心工具：httptest 包

Go 标准库 `net/http/httptest` 提供：

```go
// 创建一个虚假的 ResponseWriter，记录 handler 写入的内容
w := httptest.NewRecorder()

// 创建一个测试 HTTP 请求
req := httptest.NewRequest("GET", "/api/v1/books", nil)

// handler 执行后，通过 w 读取响应
w.Code           // HTTP 状态码
w.Body.String()  // 响应 body（字符串）
w.Body.Bytes()   // 响应 body（[]byte）
w.Header()       // 响应 headers
```

---

## 测试辅助函数

每个测试文件反复需要"创建 router → 发请求 → 读响应"，抽成辅助函数：

```go
// handler/testutil_test.go
package handler_test

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
)

func init() {
    // 关闭 Gin 的调试日志，让测试输出干净
    gin.SetMode(gin.TestMode)
}

// newTestRouter 构建测试用的 Gin Engine
func newTestRouter(t *testing.T) *gin.Engine {
    t.Helper()
    r := gin.New()  // 不用 Default，避免日志噪音
    return r
}

// doRequest 发送测试请求，返回 ResponseRecorder
func doRequest(t *testing.T, r *gin.Engine, method, path string, body any) *httptest.ResponseRecorder {
    t.Helper()
    var bodyReader *bytes.Reader
    if body != nil {
        b, err := json.Marshal(body)
        if err != nil {
            t.Fatalf("marshal body: %v", err)
        }
        bodyReader = bytes.NewReader(b)
    } else {
        bodyReader = bytes.NewReader(nil)
    }

    req := httptest.NewRequest(method, path, bodyReader)
    if body != nil {
        req.Header.Set("Content-Type", "application/json")
    }

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)  // 把请求直接交给 Gin Engine 处理
    return w
}

// parseJSON 解析响应体到目标 struct
func parseJSON(t *testing.T, w *httptest.ResponseRecorder, v any) {
    t.Helper()
    if err := json.Unmarshal(w.Body.Bytes(), v); err != nil {
        t.Fatalf("parse response body: %v\nbody: %s", err, w.Body.String())
    }
}
```

---

## 测试 GET Handler

```go
// handler/books_test.go
package handler_test

import (
    "net/http"
    "testing"

    "github.com/yourname/books-api/handler"
    "github.com/yourname/books-api/store"
)

func TestBooksHandler_Get(t *testing.T) {
    tests := []struct {
        name       string
        path       string
        wantStatus int
        wantTitle  string
    }{
        {
            name:       "存在的书",
            path:       "/api/v1/books/1",
            wantStatus: http.StatusOK,
            wantTitle:  "The Go Programming Language",
        },
        {
            name:       "不存在的书",
            path:       "/api/v1/books/999",
            wantStatus: http.StatusNotFound,
        },
        {
            name:       "非法 id",
            path:       "/api/v1/books/abc",
            wantStatus: http.StatusBadRequest,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // 每个 case 独立 Store，避免测试间相互影响
            s := store.New()
            h := handler.NewBooksHandler(s)

            r := newTestRouter(t)
            r.GET("/api/v1/books/:id", h.Get)

            w := doRequest(t, r, "GET", tt.path, nil)

            if w.Code != tt.wantStatus {
                t.Errorf("status = %d, want %d\nbody: %s",
                    w.Code, tt.wantStatus, w.Body.String())
            }

            if tt.wantTitle != "" {
                var resp struct {
                    Data struct {
                        Title string `json:"title"`
                    } `json:"data"`
                }
                parseJSON(t, w, &resp)
                if resp.Data.Title != tt.wantTitle {
                    t.Errorf("title = %q, want %q", resp.Data.Title, tt.wantTitle)
                }
            }
        })
    }
}
```

---

## 测试 POST Handler（带请求体）

```go
func TestBooksHandler_Create(t *testing.T) {
    tests := []struct {
        name       string
        body       any
        wantStatus int
        wantTitle  string
    }{
        {
            name:       "合法请求",
            body:       map[string]any{"title": "Go in Action", "author": "Kennedy", "year": 2016},
            wantStatus: http.StatusCreated,
            wantTitle:  "Go in Action",
        },
        {
            name:       "缺少 title",
            body:       map[string]any{"author": "Kennedy", "year": 2016},
            wantStatus: http.StatusBadRequest,
        },
        {
            name:       "year 超范围",
            body:       map[string]any{"title": "Bad", "author": "X", "year": 999},
            wantStatus: http.StatusBadRequest,
        },
        {
            name:       "非 JSON 请求体",
            body:       nil, // doRequest 会发空 body 但不设 Content-Type
            wantStatus: http.StatusBadRequest,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            s := store.New()
            h := handler.NewBooksHandler(s)

            r := newTestRouter(t)
            r.POST("/api/v1/books", h.Create)

            w := doRequest(t, r, "POST", "/api/v1/books", tt.body)

            if w.Code != tt.wantStatus {
                t.Errorf("status = %d, want %d\nbody: %s",
                    w.Code, tt.wantStatus, w.Body.String())
            }

            if tt.wantTitle != "" {
                var resp struct {
                    Data struct {
                        Title string `json:"title"`
                    } `json:"data"`
                }
                parseJSON(t, w, &resp)
                if resp.Data.Title != tt.wantTitle {
                    t.Errorf("title = %q, want %q", resp.Data.Title, tt.wantTitle)
                }
            }
        })
    }
}
```

---

## 测试中间件

### 测试 Auth 中间件

```go
// middleware/auth_test.go
package middleware_test

import (
    "net/http"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/yourname/books-api/middleware"
)

func TestAuthMiddleware(t *testing.T) {
    tokens := map[string]int{"valid-token": 42}

    tests := []struct {
        name       string
        authHeader string
        wantStatus int
        wantUserID int
    }{
        {
            name:       "合法 token",
            authHeader: "Bearer valid-token",
            wantStatus: http.StatusOK,
            wantUserID: 42,
        },
        {
            name:       "无效 token",
            authHeader: "Bearer wrong-token",
            wantStatus: http.StatusUnauthorized,
        },
        {
            name:       "缺少 header",
            authHeader: "",
            wantStatus: http.StatusUnauthorized,
        },
        {
            name:       "格式错误",
            authHeader: "valid-token",  // 缺少 "Bearer " 前缀
            wantStatus: http.StatusUnauthorized,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            gin.SetMode(gin.TestMode)
            r := gin.New()
            r.Use(middleware.Auth(tokens))
            r.GET("/protected", func(c *gin.Context) {
                userID := c.GetInt("user_id")
                c.JSON(200, gin.H{"user_id": userID})
            })

            req := httptest.NewRequest("GET", "/protected", nil)
            if tt.authHeader != "" {
                req.Header.Set("Authorization", tt.authHeader)
            }
            w := httptest.NewRecorder()
            r.ServeHTTP(w, req)

            if w.Code != tt.wantStatus {
                t.Errorf("status = %d, want %d\nbody: %s",
                    w.Code, tt.wantStatus, w.Body.String())
            }

            if tt.wantUserID > 0 {
                var resp struct {
                    UserID int `json:"user_id"`
                }
                if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
                    t.Fatal(err)
                }
                if resp.UserID != tt.wantUserID {
                    t.Errorf("user_id = %d, want %d", resp.UserID, tt.wantUserID)
                }
            }
        })
    }
}
```

### 测试 Recovery 中间件

```go
func TestRecoveryMiddleware(t *testing.T) {
    gin.SetMode(gin.TestMode)
    r := gin.New()
    r.Use(middleware.Recovery())
    r.GET("/panic", func(c *gin.Context) {
        panic("模拟 panic")
    })
    r.GET("/ok", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    t.Run("panic handler 返回 500", func(t *testing.T) {
        req := httptest.NewRequest("GET", "/panic", nil)
        w := httptest.NewRecorder()
        r.ServeHTTP(w, req)

        if w.Code != http.StatusInternalServerError {
            t.Errorf("got %d, want 500", w.Code)
        }
    })

    t.Run("正常 handler 不受影响", func(t *testing.T) {
        req := httptest.NewRequest("GET", "/ok", nil)
        w := httptest.NewRecorder()
        r.ServeHTTP(w, req)

        if w.Code != http.StatusOK {
            t.Errorf("got %d, want 200", w.Code)
        }
    })
}
```

---

## 测试需要鉴权的完整路由

模拟真实请求链路（中间件 + handler 一起测）：

```go
func TestCreateBookWithAuth(t *testing.T) {
    gin.SetMode(gin.TestMode)
    s := store.New()
    h := handler.NewBooksHandler(s)
    tokens := map[string]int{"test-token": 1}

    r := gin.New()
    r.Use(middleware.Recovery())

    public := r.Group("/api/v1")
    public.GET("/books", h.List)

    private := r.Group("/api/v1")
    private.Use(middleware.Auth(tokens))
    private.POST("/books", h.Create)

    body := map[string]any{"title": "Test Book", "author": "Me", "year": 2024}
    bodyBytes, _ := json.Marshal(body)

    t.Run("有 token 可以创建", func(t *testing.T) {
        req := httptest.NewRequest("POST", "/api/v1/books", bytes.NewReader(bodyBytes))
        req.Header.Set("Content-Type", "application/json")
        req.Header.Set("Authorization", "Bearer test-token")
        w := httptest.NewRecorder()
        r.ServeHTTP(w, req)

        if w.Code != http.StatusCreated {
            t.Errorf("got %d, want 201\nbody: %s", w.Code, w.Body.String())
        }
    })

    t.Run("无 token 返回 401", func(t *testing.T) {
        req := httptest.NewRequest("POST", "/api/v1/books", bytes.NewReader(bodyBytes))
        req.Header.Set("Content-Type", "application/json")
        w := httptest.NewRecorder()
        r.ServeHTTP(w, req)

        if w.Code != http.StatusUnauthorized {
            t.Errorf("got %d, want 401", w.Code)
        }
    })
}
```

---

## Benchmark：Handler 性能测试

```go
func BenchmarkBooksHandler_List(b *testing.B) {
    gin.SetMode(gin.TestMode)
    s := store.New()
    h := handler.NewBooksHandler(s)

    r := gin.New()
    r.GET("/api/v1/books", h.List)

    b.ReportAllocs()
    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        req := httptest.NewRequest("GET", "/api/v1/books", nil)
        w := httptest.NewRecorder()
        r.ServeHTTP(w, req)
    }
}
```

```bash
go test ./handler/... -bench=BenchmarkBooksHandler_List -benchmem
```

---

## 运行测试

```bash
# 运行所有测试
go test ./...

# 带 race detector（推荐）
go test -race ./...

# 带覆盖率
go test -race -coverprofile=coverage.out ./...
go tool cover -html=coverage.out  # 浏览器查看

# 运行特定测试
go test -run TestBooksHandler_Get ./handler/...

# verbose 输出
go test -v -run TestBooksHandler ./handler/...
```

---

## 完整项目目录结构

```
books-api/
├── go.mod
├── go.sum
├── main.go
├── handler/
│   ├── books.go
│   ├── books_test.go
│   └── testutil_test.go
├── middleware/
│   ├── auth.go
│   ├── auth_test.go
│   ├── logger.go
│   ├── recovery.go
│   └── request_id.go
├── service/
│   └── books.go
├── store/
│   ├── store.go
│   └── errors.go      // var ErrNotFound = errors.New("not found")
└── response/
    └── response.go
```
