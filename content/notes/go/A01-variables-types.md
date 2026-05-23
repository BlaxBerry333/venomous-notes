---
slug: go-interview-guide
lang: zh
---

# 变量、类型与零值

**本文解决什么问题**：搞清楚 Go 的变量声明方式、基础类型体系、零值机制，以及为什么 Go 不需要 `null`/`undefined`。

**前置知识**：[00-go-basics](./A00-go-basics.md)（Go 是编译型语言，类型在编译期确定）。

---

## TypeScript 对比：声明方式

TypeScript 里你有三种声明方式：

```typescript
let name: string = "Alice";   // 显式类型
let age = 25;                  // 类型推断
const MAX = 100;               // 常量
```

Go 有对应的三种：

```go
var name string = "Alice"   // 显式类型
age := 25                   // 短变量声明（类型推断）:=
const MAX = 100             // 常量
```

**关键区别**：`:=` 只能在函数内部用，包级别变量必须用 `var`。

```go
package main

import "fmt"

var globalCount int = 0  // 包级别：必须用 var

func main() {
    name := "Alice"      // 函数内：可以用 :=
    var age int = 25     // 函数内也可以用 var（等价）

    fmt.Println(name, age)
}
```

---

## 基础类型一览

| Go 类型 | TypeScript 对应 | 说明 |
|---------|----------------|------|
| `bool` | `boolean` | `true` / `false` |
| `string` | `string` | UTF-8 字节序列 |
| `int` | `number` | 平台相关（64 位系统上是 64 位） |
| `int8/16/32/64` | — | 固定位宽整数 |
| `float32/64` | `number` | 浮点数（常用 `float64`） |
| `byte` | — | `uint8` 的别名，表示一个字节 |
| `rune` | — | `int32` 的别名，表示一个 Unicode 字符 |
| `any` | `unknown` / `any` | Go 1.18+，`interface{}` 的别名 |

```go
package main

import "fmt"

func main() {
    var b bool = true
    var s string = "hello"
    var i int = 42
    var f float64 = 3.14
    var bt byte = 'A'    // byte = uint8
    var r rune = '中'    // rune = int32，存 Unicode 码点

    fmt.Println(b, s, i, f, bt, r)
    // true hello 42 3.14 65 20013
}
```

---

## 零值：Go 没有 undefined

TypeScript 里，声明但未初始化的变量是 `undefined`，这是很多 bug 的来源：

```typescript
let count: number;
console.log(count); // undefined（不是 0！）
```

**Go 的零值机制**：每个类型都有明确的默认值（零值），声明变量后直接可用，绝对不会是 `undefined` 或 `null`。

```go
package main

import "fmt"

func main() {
    var i int       // 零值 = 0
    var f float64   // 零值 = 0.0
    var b bool      // 零值 = false
    var s string    // 零值 = ""（空字符串）

    fmt.Println(i, f, b, s)
    // 0 0 false 
}
```

| 类型 | 零值 |
|------|------|
| 数值类型（int/float...） | `0` |
| `bool` | `false` |
| `string` | `""` |
| 指针、slice、map、channel、接口 | `nil` |
| struct | 所有字段各自的零值 |

---

## 类型转换：Go 是显式的

TypeScript 有隐式类型转换（臭名昭著的 `"5" + 3 = "53"`）。Go **没有任何隐式转换**，所有类型转换必须显式写出来。

```go
package main

import "fmt"

func main() {
    var i int = 42
    var f float64 = float64(i)  // int → float64，必须显式转换
    var u uint = uint(f)        // float64 → uint，截断小数

    fmt.Println(i, f, u) // 42 42 42

    // 字符串和字节切片互转
    s := "hello"
    b := []byte(s)   // string → []byte
    s2 := string(b)  // []byte → string
    fmt.Println(b, s2) // [104 101 108 108 111] hello
}
```

**编译器会拒绝不同类型之间的运算**：

```go
var i int = 10
var f float64 = 3.14
// result := i + f   // 编译错误：mismatched types int and float64
result := float64(i) + f  // 正确：显式转换后运算
fmt.Println(result) // 13.14
```

---

## 多重赋值与空白标识符

Go 支持一次给多个变量赋值，这在函数返回多个值时很常用（后文讲函数时会详细说）：

```go
package main

import "fmt"

func main() {
    // 多重赋值
    x, y := 1, 2
    fmt.Println(x, y) // 1 2

    // 交换值（不需要临时变量）
    x, y = y, x
    fmt.Println(x, y) // 2 1

    // 空白标识符 _：忽略不需要的值
    a, _ := 10, 20   // 20 被忽略
    fmt.Println(a)    // 10
}
```

**`_`（空白标识符）** 相当于"我知道这里有个值，但我不想要它"。Go 不允许声明未使用的变量，`_` 是合法的"丢弃"方式。

---

## const 与 iota

Go 的常量比 TypeScript 的 `const` 更强大，支持 `iota` 自动递增枚举：

```go
package main

import "fmt"

// 普通常量
const Pi = 3.14159
const AppName = "MyApp"

// iota：从 0 开始自动递增的整数
type Weekday int

const (
    Sunday Weekday = iota // 0
    Monday                // 1
    Tuesday               // 2
    Wednesday             // 3
    Thursday              // 4
    Friday                // 5
    Saturday              // 6
)

// iota 配合位移：常用于权限标志
type Permission int

const (
    Read    Permission = 1 << iota // 1 (1 << 0)
    Write                          // 2 (1 << 1)
    Execute                        // 4 (1 << 2)
)

func main() {
    fmt.Println(Monday, Friday)        // 1 5
    fmt.Println(Read, Write, Execute)  // 1 2 4
}
```

TypeScript 的 `enum` 对应的就是 Go 这种 `const + iota` 的写法。
