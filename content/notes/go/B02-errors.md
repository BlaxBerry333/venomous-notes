---
slug: go-interview-guide
lang: zh
---

# 错误处理：Go 的 error 系统

**本文解决什么问题**：搞清楚 Go 的错误处理机制——为什么不用 try/catch，`error` 是什么，如何包装和判断错误。

**前置知识**：[B01-interfaces](./B01-interfaces.md)（接口）；[A04-functions](./A04-functions.md)（多返回值）。

---

## TypeScript 的异常 vs Go 的错误值

TypeScript 用异常（exception）处理错误：发生问题时 `throw`，调用方用 `try/catch` 捕获：

```typescript
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("cannot divide by zero");
  return a / b;
}

try {
  const result = divide(10, 0);
} catch (e) {
  console.log(e.message);
}
```

**问题**：你看函数签名完全看不出它会抛出错误，错误路径是隐式的。

Go 把错误作为**普通返回值**——错误是函数的输出之一，不是"例外情况"：

```go
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("错误:", err)
        return
    }
    fmt.Println(result) // 5
}
```

**优点**：看函数签名就知道有没有可能出错，调用方被迫处理错误（编译器会警告未使用的变量）。

---

## error 接口

`error` 不是内置类型，它是 Go 标准库定义的一个接口（正好对应上一篇讲的接口概念）：

```go
// Go 标准库里的实际定义
type error interface {
    Error() string
}
```

任何实现了 `Error() string` 方法的类型，都是 `error`。

`errors.New` 创建一个最简单的 error：

```go
import "errors"

err := errors.New("something went wrong")
fmt.Println(err.Error()) // something went wrong
fmt.Println(err)         // something went wrong（fmt 会自动调用 Error()）
```

---

## fmt.Errorf：给错误加上下文

`errors.New` 只能创建静态消息。`fmt.Errorf` 支持格式化，可以把变量包进错误信息：

```go
package main

import (
    "fmt"
)

func loadUser(id int) error {
    // 假设数据库查询失败
    return fmt.Errorf("loadUser: user %d not found", id)
}

func main() {
    err := loadUser(42)
    fmt.Println(err) // loadUser: user 42 not found
}
```

---

## 错误包装：%w

在调用链里，每一层都可以用 `%w` 把原始错误"包进"新错误，形成错误链：

```go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func queryDB(id int) error {
    return fmt.Errorf("queryDB id=%d: %w", id, ErrNotFound)
}

func loadUser(id int) error {
    err := queryDB(id)
    if err != nil {
        return fmt.Errorf("loadUser: %w", err)
    }
    return nil
}

func main() {
    err := loadUser(42)
    fmt.Println(err)
    // loadUser: queryDB id=42: not found

    // errors.Is 沿链向下查找：哪怕包了好几层也能找到
    fmt.Println(errors.Is(err, ErrNotFound)) // true
}
```

**`%w` vs `%v` 的区别**：
- `%v`：把错误转成字符串拼进去，**断开链**（无法用 `errors.Is` 向上追溯）
- `%w`：包装错误，**保留链**，支持 `errors.Is` / `errors.As` 查找

---

## errors.Is：检查是否是某个特定错误

```go
package main

import (
    "errors"
    "fmt"
)

var ErrPermission = errors.New("permission denied")
var ErrNotFound   = errors.New("not found")

func fetchData(id int) error {
    return fmt.Errorf("fetchData: %w", ErrNotFound)
}

func main() {
    err := fetchData(1)

    // errors.Is 递归解包，找到链中任意层的目标错误
    if errors.Is(err, ErrNotFound) {
        fmt.Println("资源不存在，可以返回 404")
    }
    if errors.Is(err, ErrPermission) {
        fmt.Println("权限不足") // 不会执行
    }
}
```

类比 TypeScript：`err instanceof SomeError`，但能穿透包装层。

---

## errors.As：提取特定类型的错误

当你需要访问错误里的具体字段时（不只是判断类型），用 `errors.As`：

```go
package main

import (
    "errors"
    "fmt"
)

// 自定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error: %s - %s", e.Field, e.Message)
}

func validate(name string) error {
    if name == "" {
        return fmt.Errorf("validate: %w", &ValidationError{
            Field:   "name",
            Message: "cannot be empty",
        })
    }
    return nil
}

func main() {
    err := validate("")

    var ve *ValidationError
    if errors.As(err, &ve) {
        // ve 现在指向链中的 *ValidationError
        fmt.Println("字段:", ve.Field)     // 字段: name
        fmt.Println("原因:", ve.Message)   // 原因: cannot be empty
    }
}
```

**两者区别总结**：

| | `errors.Is` | `errors.As` |
|--|------------|------------|
| 作用 | 检查链中是否有某个**值** | 从链中提取某个**类型**的错误 |
| 类比 | `err === ErrNotFound` | `err instanceof ValidationError` |
| 返回 | `bool` | `bool`，目标通过指针输出 |

---

## Sentinel Error：包级别的预定义错误

Sentinel（哨兵）错误是定义在包级别的具名错误，方便调用方用 `errors.Is` 判断：

```go
package store

import "errors"

// 惯例：Err 开头命名
var ErrNotFound  = errors.New("store: not found")
var ErrDuplicate = errors.New("store: duplicate key")

func Get(id int) (*User, error) {
    // ...
    return nil, ErrNotFound
}
```

```go
// 调用方
user, err := store.Get(42)
if errors.Is(err, store.ErrNotFound) {
    // 处理"不存在"的情况
}
```

---

## 错误处理惯用模式

```go
// 模式 1：尽早返回（最常见）
func process(id int) error {
    user, err := loadUser(id)
    if err != nil {
        return fmt.Errorf("process: %w", err)
    }

    result, err := compute(user)
    if err != nil {
        return fmt.Errorf("process: %w", err)
    }

    return save(result)
}

// 模式 2：忽略错误（只在你确实不需要的时候用）
fmt.Println("hello") // fmt.Println 返回 error，这里忽略是惯例
```

---

## panic 和 recover：不是正常控制流

`panic` 对应 TypeScript 的"程序崩溃"场景，**不是** `throw` 的替代品：

```go
// ✓ 正确：只在"不可能发生的情况"用 panic
func mustParseInt(s string) int {
    n, err := strconv.Atoi(s)
    if err != nil {
        panic(fmt.Sprintf("mustParseInt: %s is not a number", s))
    }
    return n
}

// ✗ 错误：用 panic 代替正常错误处理
func divide(a, b int) int {
    if b == 0 {
        panic("divide by zero") // 应该返回 error，不该 panic
    }
    return a / b
}
```

`recover` 只能在 `defer` 里使用，用于捕获 panic，防止整个程序崩溃：

```go
func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil
}
```

**简单规则**：
- 业务错误（文件不存在、参数非法）→ 返回 `error`
- 编程错误（索引越界、nil 解引用）→ 让 panic 暴露 bug，不要 recover 掩盖
- 库的边界处理 panic → 可以用 recover 转成 error
