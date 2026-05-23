---
slug: go-interface-design
lang: zh
---

# 接口设计：小接口原则与依赖注入

> **本文解决什么问题**：B01 讲了接口**是什么**（隐式实现、duck typing）。本文讲接口**怎么用**——小接口原则、组合、依赖注入模式、"接受接口返回结构体"法则。这些是写出可测试、可维护 Go 代码的核心手法。
>
> **前置知识**：[B01-interfaces](./B01-interfaces.md)（接口基础）；[C04-channel-patterns](./C04-channel-patterns.md)（了解 goroutine 并发背景）

---

## 小接口原则

Go 的设计哲学：**接口越小越好**。标准库中大量单方法接口是最好的示范。

```go
// 标准库中的单方法接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

// 组合：需要更多能力时，组合小接口
type ReadWriter interface {
    Reader
    Writer
}
```

**为什么小接口优于大接口**：

| 维度 | 大接口（10+ 方法） | 小接口（1-3 方法） |
|------|------------------|--------------------|
| 实现难度 | 高：实现者必须实现所有方法 | 低：任何有该方法的类型自动实现 |
| 测试 mock | 难：mock 需要实现所有方法 | 易：只需实现 1-2 个方法 |
| 耦合度 | 高：接口定义决定了实现的全部形态 | 低：实现者自由 |

命名约定：单方法接口用 **方法名 + "-er"** 后缀：`Reader`、`Writer`、`Formatter`、`Stringer`。

---

## 标准库经典接口

### io.Reader / io.Writer

```go
package main

import (
    "bytes"
    "fmt"
    "io"
    "strings"
)

// 接受 io.Reader，可以处理文件、网络连接、字节缓冲——任何实现了 Read 的类型
func countBytes(r io.Reader) (int, error) {
    buf := make([]byte, 1024)
    total := 0
    for {
        n, err := r.Read(buf)
        total += n
        if err == io.EOF {
            return total, nil
        }
        if err != nil {
            return total, err
        }
    }
}

func main() {
    n, _ := countBytes(strings.NewReader("hello, world"))
    fmt.Println(n) // 12

    buf := bytes.NewBufferString("go interface")
    n, _ = countBytes(buf)
    fmt.Println(n) // 12
}
```

### http.Handler

```go
// http.Handler 接口只有一个方法
// type Handler interface {
//     ServeHTTP(ResponseWriter, *Request)
// }

type HelloHandler struct{ greeting string }

func (h *HelloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "%s!", h.greeting)
}
```

### fmt.Stringer

```go
type Point struct{ X, Y float64 }

func (p Point) String() string {
    return fmt.Sprintf("(%.1f, %.1f)", p.X, p.Y)
}

func main() {
    p := Point{3.5, 4.2}
    fmt.Println(p) // (3.5, 4.2)：自动调用 String()
}
```

---

## 依赖注入：接受接口，返回结构体

Go 中的依赖注入不需要框架，用接口参数即可。

```go
package main

import (
    "context"
    "fmt"
)

// 接口定义在使用方的包里（不在实现方的包里）
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
}

type EmailSender interface {
    Send(to, subject, body string) error
}

type User struct {
    ID    int64
    Email string
    Name  string
}

// UserService 接受接口，不接受具体类型
type UserService struct {
    repo   UserRepository
    mailer EmailSender
}

// 返回具体结构体指针，不返回接口
func NewUserService(repo UserRepository, mailer EmailSender) *UserService {
    return &UserService{repo: repo, mailer: mailer}
}

func (s *UserService) WelcomeUser(ctx context.Context, userID int64) error {
    user, err := s.repo.FindByID(ctx, userID)
    if err != nil {
        return fmt.Errorf("WelcomeUser: find user: %w", err)
    }
    return s.mailer.Send(user.Email, "Welcome!", "Hello "+user.Name)
}

// 测试时注入 mock 实现
type mockRepo struct{}

func (m *mockRepo) FindByID(_ context.Context, id int64) (*User, error) {
    return &User{ID: id, Email: "test@example.com", Name: "Test"}, nil
}

type mockMailer struct{ sent []string }

func (m *mockMailer) Send(to, subject, body string) error {
    m.sent = append(m.sent, to)
    return nil
}

func main() {
    svc := NewUserService(&mockRepo{}, &mockMailer{})
    fmt.Println(svc.WelcomeUser(context.Background(), 1))
}
```

**"接受接口，返回结构体"的含义**：
- 函数**参数**用接口类型 → 提升可测试性，可以注入 mock
- 函数**返回值**用具体类型 → 调用方能访问具体类型的全部方法，不被接口限制

---

## 接口应该定义在哪里

**在使用方的包里定义，不在实现方的包里。**

```
// ❌ 在实现方（db 包）里定义接口
package db
type UserRepo interface { FindByID(...) }
type PostgresRepo struct{} // 实现这个接口

// ✅ 在使用方（service 包）里定义接口
package service
type UserRepo interface { FindByID(...) } // 只声明 service 需要的方法
// db.PostgresRepo 只要有这个方法就自动满足，不需要显式声明
```

好处：接口声明了调用方的**需求**，而不是实现方的**能力**。这让接口自然地保持小巧。

---

## 何时定义接口

不要为所有 struct 都创建接口——只在**真正需要多态或可替换性**时才定义：

| 需要接口 | 不需要接口 |
|---------|-----------|
| 测试时需要 mock（DB、发邮件、支付）| 只有一个实现且不打算 mock |
| 同一逻辑需要多种实现（文件/DB/内存缓存） | 具体类型功能已足够 |
| 跨包暴露行为而不暴露实现细节 | 同一包内使用 |

过早抽象接口会增加无谓的间接层，Go 社区的惯例是先写具体类型，等到真正需要替换时再提取接口。
