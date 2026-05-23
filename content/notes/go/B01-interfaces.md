---
slug: go-interview-guide
lang: zh
---

# 接口：Go 的多态基础

**本文解决什么问题**：理解 Go 的 interface 如何工作、为什么不需要 `implements` 关键字，以及 nil interface 这个常见陷阱。

**前置知识**：[A05-structs-methods](./A05-structs-methods.md)（struct 和方法）。

---

## TypeScript 的接口 vs Go 的接口

TypeScript 里接口是**显式声明**的——你要写 `implements`，编译器才知道这个类实现了哪个接口：

```typescript
interface Shape {
  area(): number;
}

class Circle implements Shape {  // 必须写 implements
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2; }
}
```

Go 的接口是**隐式实现**的——只要一个类型有接口要求的所有方法，它就自动满足这个接口，不需要任何声明：

```go
package main

import (
    "fmt"
    "math"
)

type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

// Circle 没有声明"我实现了 Shape"
// 但它有 Area() float64 方法，所以自动满足 Shape 接口
func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func printArea(s Shape) {
    fmt.Printf("面积: %.2f\n", s.Area())
}

func main() {
    printArea(Circle{Radius: 5})       // 面积: 78.54
    printArea(Rectangle{Width: 3, Height: 4}) // 面积: 12.00
}
```

**这就是 Go 的 duck typing**："如果它走路像鸭子，叫声像鸭子，那它就是鸭子"——不需要显式声明，方法签名匹配即满足接口。

---

## 接口的本质：两个字段的结构

Go 接口值在内部是一对 `(类型, 指针)`：

```
interface 值:
┌──────────┬───────────┐
│  type    │   data    │
│ *Circle  │ 指向数据  │
└──────────┴───────────┘
```

这个内部结构决定了后面讲的 nil 陷阱。

---

## 接口让函数不依赖具体类型

这是接口最重要的用途——函数依赖行为（方法），而不是具体类型：

```go
package main

import (
    "fmt"
    "strings"
)

// 任何有 Write([]byte)(int, error) 方法的类型都满足此接口
type Writer interface {
    Write(p []byte) (n int, err error)
}

// 不管传进来是文件、网络连接还是内存 buffer，都能用
func writeMessage(w Writer, msg string) {
    w.Write([]byte(msg))
}

// 简单的内存 buffer 实现
type MemBuffer struct {
    buf strings.Builder
}

func (m *MemBuffer) Write(p []byte) (int, error) {
    return m.buf.Write(p)
}

func (m *MemBuffer) String() string {
    return m.buf.String()
}

func main() {
    buf := &MemBuffer{}
    writeMessage(buf, "hello interface")
    fmt.Println(buf.String()) // hello interface
}
```

---

## 空接口：any

`any`（Go 1.18+ 起是 `interface{}` 的别名）表示"接受任何类型"：

```go
package main

import "fmt"

func printAnything(v any) {
    fmt.Println(v)
}

func main() {
    printAnything(42)
    printAnything("hello")
    printAnything([]int{1, 2, 3})
}
```

类比 TypeScript 的 `unknown`——用 `any` 时你丢失了类型信息，使用时需要类型断言：

```go
package main

import "fmt"

func process(v any) {
    // 类型断言：v.(T)
    // 如果 v 实际不是 string，下面这行会 panic
    // s := v.(string)

    // 安全写法：comma-ok
    s, ok := v.(string)
    if ok {
        fmt.Println("是字符串:", s)
    } else {
        fmt.Println("不是字符串")
    }
}

func main() {
    process("hello") // 是字符串: hello
    process(42)      // 不是字符串
}
```

**类型 switch**：多个类型判断时更清晰：

```go
func describe(v any) string {
    switch val := v.(type) {
    case int:
        return fmt.Sprintf("整数: %d", val)
    case string:
        return fmt.Sprintf("字符串: %s", val)
    case bool:
        return fmt.Sprintf("布尔: %v", val)
    default:
        return fmt.Sprintf("未知类型: %T", val)
    }
}
```

---

## nil interface 陷阱

这是 Go 里最容易踩的坑之一。

```go
package main

import "fmt"

type MyError struct{ msg string }

func (e *MyError) Error() string { return e.msg }

// 这个函数有 bug！
func getError(fail bool) error {
    var err *MyError // nil 指针
    if fail {
        err = &MyError{msg: "出错了"}
    }
    return err // 问题在这里！
}

func main() {
    err := getError(false)
    if err != nil {
        fmt.Println("有错误:", err) // 这行会执行！
    } else {
        fmt.Println("没有错误")
    }
}
```

**为什么会这样**：返回 `err` 时，Go 创建了一个接口值 `(type=*MyError, data=nil)`。这个接口值本身**不是** nil（它有类型信息），所以 `err != nil` 为 `true`。

**正确写法**：

```go
func getError(fail bool) error {
    if fail {
        return &MyError{msg: "出错了"}
    }
    return nil // 直接返回 nil，不要用中间变量
}
```

**规则**：函数返回 `error` 时，成功路径直接 `return nil`，不要先声明具体类型的变量再返回。

---

## 指针接收者与接口实现

这是 Go 初学者最高频的编译错误来源，也是 A05 讲接收者时故意留到这里的伏笔。

**规则只有一条**：

```
值接收者方法    → T 和 *T 都满足接口
指针接收者方法  → 只有 *T 满足接口，T 不满足
```

看代码：

```go
type Writer interface {
    Write(p []byte) (int, error)
}

type MemBuffer struct{ buf []byte }

// 指针接收者
func (m *MemBuffer) Write(p []byte) (int, error) {
    m.buf = append(m.buf, p...)
    return len(p), nil
}

var _ Writer = &MemBuffer{} // ✅ *MemBuffer 满足 Writer
var _ Writer = MemBuffer{}  // ❌ 编译错误：MemBuffer does not implement Writer
```

为什么？因为 `Write` 是定义在 `*MemBuffer` 上的方法，Go 编译器只保证 `*MemBuffer` 的方法集包含它，`MemBuffer`（值类型）的方法集不包含指针接收者方法。

**错误信息长这样**（面试 Go 时经常被考）：

```
cannot use MemBuffer{} (type MemBuffer) as type Writer:
    MemBuffer does not implement Writer (Write method has pointer receiver)
```

**怎么用**：

```go
// ✅ 用指针
buf := &MemBuffer{}
writeMessage(buf, "hello")

// ❌ 用值——编译失败
buf := MemBuffer{}
writeMessage(buf, "hello")  // 报错
```

**背后的逻辑**：值类型的方法集只包含值接收者方法，因为你拿到一个值类型的副本后，没有办法取到它的地址再调用指针方法——Go 不允许这种隐式转换发生在接口赋值时（虽然在直接调用方法时可以自动取址，但接口赋值时不行）。

**实践规则**：只要结构体的任何一个方法用了指针接收者，就把整个结构体的所有方法统一用指针接收者，然后始终用 `&T{}` 或 `new(T)` 创建它。

---

## 标准库常用接口

了解这些接口，读标准库代码就不会懵：

| 接口 | 方法 | 用途 |
|------|------|------|
| `io.Reader` | `Read(p []byte) (n int, err error)` | 可读取字节流：文件、网络、内存 |
| `io.Writer` | `Write(p []byte) (n int, err error)` | 可写入字节流 |
| `fmt.Stringer` | `String() string` | 自定义 `fmt.Println` 输出格式 |
| `error` | `Error() string` | 错误类型（下一篇详解） |
| `sort.Interface` | `Len/Less/Swap` | 自定义排序 |

```go
package main

import "fmt"

type Point struct{ X, Y int }

// 实现 fmt.Stringer 接口：自定义打印格式
func (p Point) String() string {
    return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

func main() {
    p := Point{3, 4}
    fmt.Println(p)         // (3, 4)  ← 调用了 String() 方法
    fmt.Printf("%v\n", p) // (3, 4)
}
```

---

## 组合接口

接口可以嵌套组合，标准库里很常见：

```go
// io 包里的实际定义
type ReadWriter interface {
    Reader  // 嵌入 io.Reader
    Writer  // 嵌入 io.Writer
}

// 自定义组合
type ReadCloser interface {
    io.Reader
    Close() error
}
```
