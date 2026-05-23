---
slug: go-net-http-basics
lang: zh
---

# net/http 基础：Handler、路由、中间件

> **本文解决什么问题**：Gin 是对 `net/http` 的封装——理解标准库的 `http.Handler` 接口、`ResponseWriter`、`*Request`，你就能看穿 Gin 在做什么，而不是死记 API。本文用标准库写一个完整的小服务，再对比 Gin 的做法。
>
> **前置知识**：[B01-interfaces](./B01-interfaces.md)（接口隐式实现）；[C02-project-layout](./C02-project-layout.md)（了解 internal/ 布局）

---

## 最简单的 HTTP 服务

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello, Go!")
    })
    http.ListenAndServe(":8080", nil) // nil 表示用默认的 DefaultServeMux
}
```

运行后访问 `http://localhost:8080/hello` 即可看到响应。

---

## 三个核心类型

### http.ResponseWriter（接口）

用来**写响应**的接口：

```go
type ResponseWriter interface {
    Header() http.Header      // 获取响应头 map，写入后调用 WriteHeader 才生效
    Write([]byte) (int, error) // 写响应体（自动调用 WriteHeader(200) 如果还没写状态码）
    WriteHeader(statusCode int) // 写状态码，只能调用一次
}
```

```go
func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated) // 201
    w.Write([]byte(`{"id": 1}`))

    // ❌ WriteHeader 只能调用一次，再调没有效果
    // w.WriteHeader(http.StatusOK)
}
```

**顺序很重要**：必须先 `Header().Set()`，再 `WriteHeader()`，再 `Write()`。一旦调用 `Write()`，headers 就已经发送出去了，再改 Header 无效。

### *http.Request（struct）

代表**收到的请求**：

```go
func handler(w http.ResponseWriter, r *http.Request) {
    r.Method          // "GET", "POST", etc.
    r.URL.Path        // "/api/v1/books"
    r.URL.Query()     // query 参数 map（?limit=10 → map["limit":["10"]]）
    r.Header          // 请求头
    r.Body            // 请求体（io.ReadCloser）
    r.Context()       // 标准库 context（用于超时/取消）
    r.PathValue("id") // Go 1.22+ 新路由提取路径参数
}
```

读取 JSON 请求体：

```go
import "encoding/json"

func handler(w http.ResponseWriter, r *http.Request) {
    var body struct {
        Title string `json:"title"`
    }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    // body.Title 已经有值
}
```

### http.Handler（接口）

任何实现了 `ServeHTTP` 方法的类型都是 HTTP handler：

```go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```

这就是 Gin 的 `gin.Engine` 实现的接口——你可以把 `gin.Engine` 直接传给 `http.Server`：

```go
r := gin.New()
srv := &http.Server{
    Addr:    ":8080",
    Handler: r,  // gin.Engine 实现了 http.Handler
}
```

---

## 路由

### http.HandleFunc（简单场景）

```go
http.HandleFunc("/", homeHandler)
http.HandleFunc("/about", aboutHandler)
```

### Go 1.22+ 的增强路由

Go 1.22 引入了带方法和路径参数的路由语法（无需第三方库）：

```go
mux := http.NewServeMux()

mux.HandleFunc("GET /books", listBooks)
mux.HandleFunc("GET /books/{id}", getBook)
mux.HandleFunc("POST /books", createBook)
mux.HandleFunc("DELETE /books/{id}", deleteBook)

http.ListenAndServe(":8080", mux)
```

提取路径参数：

```go
func getBook(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")  // Go 1.22+ 新增
    fmt.Fprintf(w, "book id: %s", id)
}
```

---

## 完整示例：Books CRUD（标准库版）

```go
package main

import (
    "encoding/json"
    "net/http"
    "strconv"
    "sync"
)

type Book struct {
    ID     int    `json:"id"`
    Title  string `json:"title"`
    Author string `json:"author"`
}

// 内存 store
var (
    mu    sync.RWMutex
    books = map[int]Book{}
    next  = 1
)

func listBooks(w http.ResponseWriter, r *http.Request) {
    mu.RLock()
    result := make([]Book, 0, len(books))
    for _, b := range books {
        result = append(result, b)
    }
    mu.RUnlock()

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

func createBook(w http.ResponseWriter, r *http.Request) {
    var b Book
    if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    mu.Lock()
    b.ID = next
    next++
    books[b.ID] = b
    mu.Unlock()

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(b)
}

func getBook(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.PathValue("id"))
    if err != nil {
        http.Error(w, "invalid id", http.StatusBadRequest)
        return
    }

    mu.RLock()
    b, ok := books[id]
    mu.RUnlock()

    if !ok {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(b)
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /books", listBooks)
    mux.HandleFunc("POST /books", createBook)
    mux.HandleFunc("GET /books/{id}", getBook)

    http.ListenAndServe(":8080", mux)
}
```

---

## 中间件模式

标准库的中间件是一个函数，接受 `http.Handler` 返回 `http.Handler`：

```go
// Logger 中间件
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)  // 调用下一个 handler
    })
}

// 使用
mux := http.NewServeMux()
mux.HandleFunc("GET /books", listBooks)

handler := Logger(mux)  // 包裹路由
http.ListenAndServe(":8080", handler)
```

链式中间件：

```go
handler := Logger(Auth(Recovery(mux)))
// 执行顺序：Logger → Auth → Recovery → handler → Recovery → Auth → Logger
```

---

## 对比：标准库 vs Gin

| 功能 | 标准库 | Gin |
|------|--------|-----|
| 路由 | `mux.HandleFunc("GET /x/{id}", h)` | `r.GET("/x/:id", h)` |
| 路径参数 | `r.PathValue("id")` | `c.Param("id")` |
| JSON 响应 | `json.NewEncoder(w).Encode(v)` | `c.JSON(200, v)` |
| 请求体绑定 | `json.NewDecoder(r.Body).Decode(&v)` | `c.ShouldBindJSON(&v)` |
| 中间件 | `func(http.Handler) http.Handler` | `gin.HandlerFunc` + `c.Next()` |
| 状态码 | `w.WriteHeader(201)` | `c.Status(201)` 或 `c.JSON(201, v)` |

Gin 的优势在于：请求体校验（binding tags）、更好的路由性能、更方便的 JSON 操作。底层机制是一样的。
