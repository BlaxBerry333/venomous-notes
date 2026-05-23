---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__5.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
---

# Go 错误处理：wrap 链、errors.Is/As、sentinel error 与 panic 边界

**本文解决什么问题**：掌握 Go 1.13+ 的错误处理体系（`%w` wrap、`errors.Is`、`errors.As`），能在面试中清晰区分各种错误处理方式的适用场景，以及 panic/recover 的合理边界。

**前置知识**：[01-go-vs-others](./x01-go-vs-others.md)（error 是值的概念）；[08-interface-design](./x08-interface-design.md)（nil 接口陷阱）。

---

## error 接口基础

```go
// Go 内置的 error 接口，只有一个方法
type error interface {
    Error() string
}
```

任何实现了 `Error() string` 方法的类型都可以作为 error 值。

---

## errors.New vs fmt.Errorf("%w")

### errors.New：创建简单的静态错误

```go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) error {
    if id == 0 {
        return ErrNotFound
    }
    return nil
}

func main() {
    err := findUser(0)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("user not found")
    }
}
```

`errors.New` 每次调用返回不同的指针，即使文本相同，`==` 比较也不相等。这就是为什么 sentinel error 要用包级变量（`var ErrNotFound = errors.New(...)`）而不是每次 `return errors.New(...)`。

### fmt.Errorf("%w")：带上下文的错误包装（Go 1.13+）

```go
package main

import (
    "errors"
    "fmt"
    "os"
)

var ErrPermission = errors.New("permission denied")

func readConfig(path string) error {
    _, err := os.Open(path)
    if err != nil {
        // %w 将 err 包装进新 error，保留 error 链
        return fmt.Errorf("readConfig %q: %w", path, err)
    }
    return nil
}

func loadApp() error {
    if err := readConfig("/etc/app/config.yaml"); err != nil {
        return fmt.Errorf("loadApp: %w", err)
    }
    return nil
}

func main() {
    err := loadApp()
    if err != nil {
        fmt.Println(err)
        // 输出：loadApp: readConfig "/etc/app/config.yaml": open /etc/app/config.yaml: no such file or directory

        // errors.Is 递归检查 error 链
        if errors.Is(err, os.ErrNotExist) {
            fmt.Println("config file does not exist")
        }
    }
}
```

**`%w` vs `%v` 的区别**：

| 包装方式 | 能被 `errors.Is/As` 解包？ | 用途 |
|---------|--------------------------|------|
| `fmt.Errorf("ctx: %w", err)` | 是 | 保留 error 链，供调用方检查原始错误 |
| `fmt.Errorf("ctx: %v", err)` | 否 | 仅附加上下文文本，丢弃原始 error |
| `errors.New("...")` | 否（自身就是原始） | 创建新的 sentinel error |

---

## errors.Is：值比较（沿 error 链查找）

```go
package main

import (
    "errors"
    "fmt"
)

var ErrDatabase = errors.New("database error")
var ErrConnection = errors.New("connection refused")

func queryDB() error {
    return fmt.Errorf("queryDB: %w", fmt.Errorf("connect: %w", ErrConnection))
}

func main() {
    err := queryDB()

    // errors.Is 递归展开 %w 包装的 error 链
    fmt.Println(errors.Is(err, ErrConnection)) // true
    fmt.Println(errors.Is(err, ErrDatabase))   // false

    // 标准库 sentinel errors
    // errors.Is(err, io.EOF)
    // errors.Is(err, os.ErrNotExist)
    // errors.Is(err, context.Canceled)
    // errors.Is(err, context.DeadlineExceeded)
}
```

---

## errors.As：类型断言（沿 error 链查找）

```go
package main

import (
    "errors"
    "fmt"
    "net"
)

type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error: field=%s, msg=%s", e.Field, e.Message)
}

func validateInput(name string) error {
    if name == "" {
        return &ValidationError{Field: "name", Message: "cannot be empty"}
    }
    return nil
}

func processRequest(name string) error {
    if err := validateInput(name); err != nil {
        return fmt.Errorf("processRequest: %w", err)
    }
    return nil
}

func main() {
    err := processRequest("")

    // errors.As 解包 error 链，找到第一个匹配 *ValidationError 的错误
    var valErr *ValidationError
    if errors.As(err, &valErr) {
        fmt.Printf("field: %s, message: %s\n", valErr.Field, valErr.Message)
        // 可以访问具体错误的字段，而不仅是 Error() 字符串
    }

    // 标准库中的常见用法
    var netErr *net.OpError
    if errors.As(err, &netErr) {
        fmt.Println("network operation:", netErr.Op)
    }
}
```

**`errors.Is` vs `errors.As` 的选择**：

| 场景 | 用哪个 |
|------|--------|
| 检查是否是特定的 sentinel error | `errors.Is` |
| 检查 error 链中是否有某种类型的错误 | `errors.As` |
| 需要访问错误的额外字段 | `errors.As` |
| 判断 error 来源（如 `io.EOF`） | `errors.Is` |

---

## sentinel error：定义与场景

sentinel error 是包级别预定义的 error 值，用于让调用方通过 `errors.Is` 判断错误类型。

```go
package store

import "errors"

// 包级 sentinel errors——使用 var，而不是 const（error 是接口不能是 const）
var (
    ErrNotFound     = errors.New("store: not found")
    ErrAlreadyExist = errors.New("store: already exists")
    ErrForbidden    = errors.New("store: forbidden")
)
```

**命名约定**：`Err` 开头 + 驼峰；包含包名前缀避免歧义（`store.ErrNotFound`）。

**何时不用 sentinel**：错误只在模块内部处理、不需要让调用方区分的情况。用 `fmt.Errorf` 格式化即可。

---

## 自定义错误类型

```go
package main

import (
    "errors"
    "fmt"
    "net/http"
)

// 自定义错误类型：包含额外上下文信息
type HTTPError struct {
    StatusCode int
    Body       string
}

func (e *HTTPError) Error() string {
    return fmt.Sprintf("http error %d: %s", e.StatusCode, e.Body)
}

func fetchData(url string) error {
    resp, err := http.Get(url)
    if err != nil {
        return fmt.Errorf("fetchData: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 400 {
        return &HTTPError{
            StatusCode: resp.StatusCode,
            Body:       http.StatusText(resp.StatusCode),
        }
    }
    return nil
}

func main() {
    err := fetchData("https://httpbin.org/status/404")
    if err != nil {
        var httpErr *HTTPError
        if errors.As(err, &httpErr) {
            fmt.Printf("got HTTP %d\n", httpErr.StatusCode)
            // 可以根据 StatusCode 做特定处理
        } else {
            fmt.Println("other error:", err)
        }
    }
}
```

---

## panic/recover：合理边界

### 何时使用 panic

```go
package main

import "fmt"

// 场景 1：程序初始化时发现无法继续的配置错误
func mustGetEnv(key string) string {
    v := getenv(key) // 假设是读环境变量
    if v == "" {
        // 使用 must 前缀的函数惯例是：失败就 panic
        panic(fmt.Sprintf("required env var %q not set", key))
    }
    return v
}

func getenv(key string) string {
    // 模拟
    if key == "DB_URL" {
        return "postgres://localhost/mydb"
    }
    return ""
}

// 场景 2：库内部的编程错误（断言）
func divide(a, b int) int {
    if b == 0 {
        panic("divide: divisor must not be zero") // 编程错误，不是运行时错误
    }
    return a / b
}

func main() {
    dsn := mustGetEnv("DB_URL")
    fmt.Println(dsn)
}
```

### recover：在库边界拦截 panic

```go
package main

import "fmt"

// safeExec 在库/框架边界将内部 panic 转换为 error，不暴露给调用方
func safeExec(fn func()) (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered panic: %v", r)
        }
    }()
    fn()
    return nil
}

func riskyOperation() {
    panic("something went wrong internally")
}

func main() {
    if err := safeExec(riskyOperation); err != nil {
        fmt.Println("caught:", err)
        // caught: recovered panic: something went wrong internally
    }
}
```

**panic/recover 使用准则**：

| 用途 | 合理？ |
|------|-------|
| 程序启动配置检查失败 | 合理 |
| 库内部断言（不可能发生的状态） | 合理 |
| HTTP 框架在 handler 边界 recover | 合理（标准做法） |
| 替代 error 返回作为普通错误处理 | **不合理（面试红线）** |
| 跨 goroutine 传播错误 | **不合理**（recover 无法跨 goroutine） |
