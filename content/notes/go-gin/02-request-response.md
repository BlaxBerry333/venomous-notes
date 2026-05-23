---
slug: gin-request-response
lang: zh
---

# Gin 请求与响应：参数绑定、校验、统一响应格式

> **本文解决什么问题**：如何从请求体/Query/Header 安全地提取数据并做校验，如何定义一套统一的 JSON 响应格式——这是每个生产级 API 都要解决的问题。
>
> **前置知识**：[01-gin-basics](01-gin-basics.md)、[B02 错误处理](../go/B02-errors.md)（理解 error 包装）

---

## 请求数据的三种来源

```
GET  /books?author=Donovan&limit=10    → Query 参数
GET  /books/42                         → 路径参数
POST /books  {"title": "...", ...}     → 请求体（JSON/Form）
```

---

## 路径参数与 Query 参数（回顾 + 类型转换）

```go
// GET /books/42
func (h *BooksHandler) Get(c *gin.Context) {
    // c.Param 永远返回字符串
    raw := c.Param("id")
    id, err := strconv.Atoi(raw)
    if err != nil {
        c.JSON(http.StatusBadRequest, errorResponse("id 必须是整数"))
        return
    }
    // ...
}

// GET /books?limit=5&offset=10
func (h *BooksHandler) List(c *gin.Context) {
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
    offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
    // ...
}
```

---

## JSON 请求体绑定

### ShouldBindJSON vs BindJSON

这是 Gin 里最常见的混淆点：

| | `ShouldBindJSON` | `BindJSON` |
|--|-----------------|------------|
| 绑定失败时 | 只返回 error，**不**自动响应 | 自动写 400 + error 信息到响应 |
| 推荐场景 | **生产代码**（自己控制错误格式） | 快速原型 |
| 对应 Express | `req.body`（配合 express-validator） | — |

**始终用 `ShouldBindJSON`**，自己决定错误长什么样。

### 完整示例：POST /api/v1/books

```go
// handler/books.go

type CreateBookRequest struct {
    Title  string `json:"title"  binding:"required,min=1,max=200"`
    Author string `json:"author" binding:"required"`
    Year   int    `json:"year"   binding:"required,min=1000,max=2100"`
}

func (h *BooksHandler) Create(c *gin.Context) {
    var req CreateBookRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
        return
    }

    book := h.store.Create(&store.Book{
        Title:  req.Title,
        Author: req.Author,
        Year:   req.Year,
    })
    c.JSON(http.StatusCreated, successResponse(book))
}
```

### struct tag 说明

```go
type CreateBookRequest struct {
    Title  string `json:"title"  binding:"required,min=1,max=200"`
    //                            ↑ validator 规则，多个用逗号分隔
    Year   int    `json:"year"   binding:"required,min=1000,max=2100"`
    Tags   []string `json:"tags" binding:"omitempty,max=10"`
    //                            ↑ omitempty：字段不存在时跳过校验
}
```

Gin 的 binding 校验底层用 [go-playground/validator](https://github.com/go-playground/validator)，常用规则：

| 规则 | 含义 |
|------|------|
| `required` | 不能为零值（空字符串、0、nil 均触发） |
| `min=N,max=N` | 字符串长度 / 数字范围 |
| `email` | 格式校验 |
| `url` | URL 格式 |
| `oneof=a b c` | 枚举值 |
| `omitempty` | 值为零时跳过其他规则 |
| `dive` | 校验 slice 内部元素 |

### 嵌套 struct 和 slice

```go
type OrderRequest struct {
    UserID int     `json:"user_id" binding:"required"`
    Items  []Item  `json:"items"   binding:"required,min=1,dive"`
    //                                              ↑ dive 表示递归校验 Items 里每个元素
}

type Item struct {
    BookID int `json:"book_id" binding:"required"`
    Qty    int `json:"qty"    binding:"required,min=1"`
}
```

---

## PUT：更新请求

```go
type UpdateBookRequest struct {
    Title  string `json:"title"  binding:"omitempty,min=1,max=200"`
    Author string `json:"author" binding:"omitempty"`
    Year   int    `json:"year"   binding:"omitempty,min=1000,max=2100"`
}

func (h *BooksHandler) Update(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, errorResponse("id 必须是整数"))
        return
    }

    var req UpdateBookRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
        return
    }

    book, ok := h.store.Update(id, req.Title, req.Author, req.Year)
    if !ok {
        c.JSON(http.StatusNotFound, errorResponse("书不存在"))
        return
    }
    c.JSON(http.StatusOK, successResponse(book))
}
```

---

## 读取 Header

```go
func (h *BooksHandler) Create(c *gin.Context) {
    token := c.GetHeader("Authorization")   // 等价 c.Request.Header.Get("Authorization")
    lang  := c.GetHeader("Accept-Language") // 不存在返回 ""
    // ...
}
```

---

## 统一响应格式

每个 API 都应该有一致的响应结构，前端好解析，日志好追踪。

### 定义响应 struct

```go
// response/response.go
package response

type Response struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data    any    `json:"data,omitempty"`
}

func Success(data any) Response {
    return Response{Code: 0, Message: "ok", Data: data}
}

func Error(code int, msg string) Response {
    return Response{Code: code, Message: msg}
}
```

### 在 handler 中使用

```go
import "github.com/yourname/books-api/response"

func (h *BooksHandler) Get(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, response.Error(400001, "id 格式错误"))
        return
    }

    book, ok := h.store.Get(id)
    if !ok {
        c.JSON(http.StatusNotFound, response.Error(404001, "书不存在"))
        return
    }

    c.JSON(http.StatusOK, response.Success(book))
}
```

响应示例：

```json
// 成功
{"code": 0, "message": "ok", "data": {"id": 1, "title": "..."}}

// 失败
{"code": 404001, "message": "书不存在"}
```

---

## 绑定 Form 表单

```go
type LoginForm struct {
    Username string `form:"username" binding:"required"`
    Password string `form:"password" binding:"required,min=8"`
}

func login(c *gin.Context) {
    var form LoginForm
    if err := c.ShouldBind(&form); err != nil {  // 注意：不是 ShouldBindJSON
        c.JSON(400, response.Error(400, err.Error()))
        return
    }
    // form.Username, form.Password 已经有值了
}
```

`ShouldBind`（无 JSON 后缀）根据 `Content-Type` 自动选择解析方式：
- `application/json` → JSON 绑定
- `application/x-www-form-urlencoded` → Form 绑定
- `multipart/form-data` → Multipart 绑定

---

## 文件上传

```go
func (h *BooksHandler) UploadCover(c *gin.Context) {
    file, err := c.FormFile("cover")  // "cover" 是 form field 名
    if err != nil {
        c.JSON(400, response.Error(400, "缺少文件"))
        return
    }

    // 保存到本地（生产环境应存 S3/OSS）
    dst := fmt.Sprintf("./uploads/%s", file.Filename)
    if err := c.SaveUploadedFile(file, dst); err != nil {
        c.JSON(500, response.Error(500, "保存失败"))
        return
    }

    c.JSON(200, response.Success(gin.H{"path": dst}))
}
```

---

## 完整路由注册

```go
// main.go
func main() {
    s := store.New()
    h := handler.NewBooksHandler(s)

    r := gin.Default()
    v1 := r.Group("/api/v1")
    {
        v1.GET("/books", h.List)
        v1.GET("/books/:id", h.Get)
        v1.POST("/books", h.Create)
        v1.PUT("/books/:id", h.Update)
        v1.DELETE("/books/:id", h.Delete)
    }

    r.Run(":8080")
}
```

测试所有端点：

```bash
# 列表
curl http://localhost:8080/api/v1/books

# 创建
curl -X POST http://localhost:8080/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Go in Action","author":"Kennedy","year":2016}'

# 校验失败（year 超范围）
curl -X POST http://localhost:8080/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Bad Book","author":"X","year":999}'

# 更新
curl -X PUT http://localhost:8080/api/v1/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# 删除
curl -X DELETE http://localhost:8080/api/v1/books/1
```
