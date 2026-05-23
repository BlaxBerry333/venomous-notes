---
slug: gin-basics
lang: zh
---

# Gin 基础：路由、Handler、第一个 HTTP 服务

> **本文解决什么问题**：Go 标准库 `net/http` 太底层，Gin 怎么让你 30 行写出一个完整的 REST API——路由、参数、JSON 响应一次搞清楚。
>
> **前置知识**：[B01 接口](../go/B01-interfaces.md)（理解 interface 的隐式实现）、[B02 错误处理](../go/B02-errors.md)、[A05 struct 与方法](../go/A05-structs-methods.md)

---

## 为什么用 Gin 而不是 net/http

Go 标准库 `net/http` 能写完整的 HTTP 服务，但路由匹配要自己写，参数解析要自己写，JSON 序列化要手动调 `encoding/json`。

| 能力 | net/http 裸写 | Gin |
|------|--------------|-----|
| 路由匹配 `/books/:id` | 自己解析 URL | `r.GET("/books/:id", ...)` |
| 读取 JSON 请求体 | `json.NewDecoder(r.Body).Decode(&v)` | `c.ShouldBindJSON(&v)` |
| 返回 JSON | `json.Marshal` + 设置 Content-Type | `c.JSON(200, obj)` |
| 中间件 | 手动包装 `http.Handler` | `r.Use(middleware)` |
| 路由组 | 自己管理前缀 | `r.Group("/api/v1")` |

TypeScript/Express 背景的读者：**Gin 就是 Go 版的 Express.js**，概念几乎一一对应。

---

## 安装

```bash
mkdir books-api && cd books-api
go mod init github.com/yourname/books-api
go get github.com/gin-gonic/gin
```

---

## gin.Default() vs gin.New()

```go
// gin.Default() = gin.New() + Logger 中间件 + Recovery 中间件
r := gin.Default()

// gin.New() 裸引擎，不带任何中间件——生产环境自己选中间件时用
r := gin.New()
```

开发阶段用 `gin.Default()`，生产环境按需用 `gin.New()` + 手动挂中间件（后文 03-middleware 讲）。

---

## Handler 函数签名

Gin 的一切从 `*gin.Context` 开始：

```go
func handlerFunc(c *gin.Context) {
    // c 包含：请求数据、响应方法、中间件通信
}
```

与 Express 对比：

| Express | Gin |
|---------|-----|
| `(req, res, next) => {}` | `func(c *gin.Context)` |
| `req.params.id` | `c.Param("id")` |
| `req.query.q` | `c.Query("q")` |
| `req.body` | `c.ShouldBindJSON(&v)` |
| `res.json(data)` | `c.JSON(200, data)` |
| `res.status(404).json(...)` | `c.JSON(404, ...)` |
| `next()` | `c.Next()` |

---

## 贯穿示例：书库 API

后续 5 篇文档共用同一个项目，逐步完善。这里先建数据层和最基础的路由。

### 数据层（共用）

```go
// store/store.go
package store

import "sync"

type Book struct {
    ID     int    `json:"id"`
    Title  string `json:"title"`
    Author string `json:"author"`
    Year   int    `json:"year"`
}

type Store struct {
    mu     sync.RWMutex
    books  map[int]*Book
    nextID int
}

func New() *Store {
    return &Store{
        books: map[int]*Book{
            1: {ID: 1, Title: "The Go Programming Language", Author: "Donovan & Kernighan", Year: 2015},
            2: {ID: 2, Title: "Concurrency in Go", Author: "Katherine Cox-Buday", Year: 2017},
        },
        nextID: 3,
    }
}

func (s *Store) List() []*Book {
    s.mu.RLock()
    defer s.mu.RUnlock()
    result := make([]*Book, 0, len(s.books))
    for _, b := range s.books {
        result = append(result, b)
    }
    return result
}

func (s *Store) Get(id int) (*Book, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    b, ok := s.books[id]
    return b, ok
}

func (s *Store) Create(b *Book) *Book {
    s.mu.Lock()
    defer s.mu.Unlock()
    b.ID = s.nextID
    s.nextID++
    s.books[b.ID] = b
    return b
}

func (s *Store) Delete(id int) bool {
    s.mu.Lock()
    defer s.mu.Unlock()
    if _, ok := s.books[id]; !ok {
        return false
    }
    delete(s.books, id)
    return true
}
```

### Handler 层

```go
// handler/books.go
package handler

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/yourname/books-api/store"
)

type BooksHandler struct {
    store *store.Store
}

func NewBooksHandler(s *store.Store) *BooksHandler {
    return &BooksHandler{store: s}
}

// GET /api/v1/books
func (h *BooksHandler) List(c *gin.Context) {
    c.JSON(http.StatusOK, h.store.List())
}

// GET /api/v1/books/:id
func (h *BooksHandler) Get(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id 必须是整数"})
        return
    }

    book, ok := h.store.Get(id)
    if !ok {
        c.JSON(http.StatusNotFound, gin.H{"error": "书不存在"})
        return
    }

    c.JSON(http.StatusOK, book)
}
```

### 主程序

```go
// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/yourname/books-api/handler"
    "github.com/yourname/books-api/store"
)

func main() {
    s := store.New()
    h := handler.NewBooksHandler(s)

    r := gin.Default()

    v1 := r.Group("/api/v1")
    {
        v1.GET("/books", h.List)
        v1.GET("/books/:id", h.Get)
    }

    r.Run(":8080") // 监听 0.0.0.0:8080
}
```

启动后试一下：

```bash
curl http://localhost:8080/api/v1/books
curl http://localhost:8080/api/v1/books/1
curl http://localhost:8080/api/v1/books/999   # 返回 404
```

---

## 路由详解

### HTTP 方法

```go
r.GET("/books", listBooks)
r.POST("/books", createBook)
r.PUT("/books/:id", updateBook)
r.DELETE("/books/:id", deleteBook)
r.PATCH("/books/:id", patchBook)
r.Any("/ping", pingHandler)        // 匹配任意方法
```

### 路径参数

```go
r.GET("/books/:id", func(c *gin.Context) {
    id := c.Param("id")   // 字符串，需自行转换
    fmt.Println(id)
})

// 通配符：匹配 /files/a/b/c
r.GET("/files/*path", func(c *gin.Context) {
    path := c.Param("path")  // "/a/b/c"
})
```

### Query 参数

```go
// GET /books?author=Donovan&limit=10
r.GET("/books", func(c *gin.Context) {
    author := c.Query("author")          // "Donovan"，不存在返回 ""
    limit  := c.DefaultQuery("limit", "20") // 不存在返回默认值 "20"
    page   := c.QueryArray("tag")        // 支持重复 key：?tag=go&tag=concurrency
})
```

### 路由组

```go
v1 := r.Group("/api/v1")
{
    v1.GET("/books", h.List)
    v1.POST("/books", h.Create)
    v1.GET("/books/:id", h.Get)
}

// 可嵌套
admin := r.Group("/admin")
admin.Use(authMiddleware())           // 只对 admin 路由生效
{
    admin.GET("/stats", h.Stats)
}
```

花括号是 Go 代码块，纯粹提高可读性，不影响作用域。

---

## 响应方法

```go
// JSON（最常用）
c.JSON(http.StatusOK, gin.H{"message": "ok"})
c.JSON(200, book)                              // 可以是任意 struct

// 纯文本
c.String(http.StatusOK, "pong")

// 仅设置状态码，无 body
c.Status(http.StatusNoContent)

// 重定向
c.Redirect(http.StatusMovedPermanently, "/new-path")
```

`gin.H` 是 `map[string]any` 的别名，用来快速构造 JSON 对象，不需要定义 struct。

---

## 请求提前终止

```go
func getBook(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "非法 id"})
        return   // 必须 return，c.JSON 不会停止执行
    }
    // ...继续处理
}
```

和 Express 不同：**Gin 的 `c.JSON` 不会自动停止 handler 执行**，需要显式 `return`。
