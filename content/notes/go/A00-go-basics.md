---
slug: go-interview-guide
lang: zh
---

# Go 语法基础：给 TypeScript 开发者的速查手册

**本文解决什么问题**：在你读后续任何一篇文档之前，先搞清楚 Go 程序是怎么组织的、怎么跑起来的，再过一遍基础语法，让后面的代码示例不会让你看懵。

**前置知识**：TypeScript/JavaScript 日常开发经验即可。

---

## Go 是编译型语言，和 JS/TS 完全不同

TypeScript 的工作流：

```
写 .ts 文件 → tsc 编译成 .js → node 解释执行
```

Go 的工作流：

```
写 .go 文件 → go build 编译成二进制 → 直接运行（无需 runtime）
```

**实际影响**：

| | TypeScript / Node.js | Go |
|--|---------------------|-----|
| 运行一个文件 | `node app.js`（解释执行） | 需先 `go build` 或用 `go run`（内部仍是编译） |
| 部署产物 | 需要 Node.js 环境 | 单个可执行文件，无依赖 |
| 错误发现时机 | 运行时（JS）/ tsc 时（TS） | 编译时，未使用变量/import 都是**编译错误** |
| 跨平台 | 依赖 Node.js | `GOOS=linux go build` 直接交叉编译 |

**Go 的严格规则**（新人常被坑的地方）：
- 声明了变量但没用 → 编译失败
- import 了包但没用 → 编译失败
- 大括号 `{` 必须和上一行在同一行（不能换行）

---

## 文件、包、模块：三层结构

这是 Go 最重要的基础概念，也是和 JS/TS 差异最大的地方。

### 三层结构概览

```
模块（module）                 ← 由 go.mod 定义，整个项目/库的边界
├── 包（package）              ← 一个目录 = 一个包，代码组织单位
│   ├── file_a.go             ← 同一目录下的文件自动属于同一个包
│   └── file_b.go
└── 另一个包（package）
    └── util.go
```

对比 TypeScript：

| 概念 | TypeScript | Go |
|------|-----------|-----|
| 项目边界 | `package.json` | `go.mod` |
| 代码单元 | 文件（每个文件独立 export） | 包（一个目录整体对外） |
| 导入路径 | 相对路径 `./util` 或包名 | 模块路径 + 目录路径 |

### 每个 .go 文件必须声明所属包

这是强制规定，不写就编译失败：

```go
package main   // ← 这行必须是文件第一行（注释除外）

import "fmt"

func main() {
    fmt.Println("hello")
}
```

包名规则：
- 可执行程序：必须有且仅有一个 `package main` + `func main()`
- 库代码：包名通常和目录名一致（惯例，不强制）
- 同一目录下所有文件必须声明相同的包名

### 模块（go.mod）

Go 的模块类似 `package.json`，是项目的根：

```bash
# 新建项目时执行一次（类似 npm init）
go mod init github.com/yourname/myproject
```

生成的 `go.mod`：

```
module github.com/yourname/myproject   ← 模块名，也是导入路径的前缀

go 1.23                                 ← Go 版本要求

require (                               ← 依赖（类似 package.json 的 dependencies）
    github.com/some/lib v1.2.3
)
```

常用命令对比：

| 操作 | npm / TypeScript | Go |
|------|-----------------|-----|
| 初始化项目 | `npm init` | `go mod init <模块名>` |
| 安装依赖 | `npm install some-lib` | `go get github.com/some/lib` |
| 整理依赖 | `npm install`（从 package.json） | `go mod tidy` |
| 依赖锁文件 | `package-lock.json` | `go.sum` |

---

## 如何运行 Go 程序

假设有如下目录：

```
myproject/
├── go.mod
└── main.go
```

```go
// main.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

有三种方式：

```bash
# 方式 1：直接运行（开发时用，内部编译后立即执行）
go run main.go
# 或者运行当前目录的 main 包
go run .

# 方式 2：编译成二进制再运行
go build -o myapp .
./myapp

# 方式 3：安装到 $GOPATH/bin（全局命令行工具用）
go install .
```

`go run` 就像 `ts-node`：不用手动编译，直接跑，但本质仍是编译型。

---

## Hello World（现在看得懂了）

```go
package main  // 声明这是可执行程序的包

import "fmt"  // 导入标准库的 fmt 包（format 的缩写）

func main() { // 程序入口，固定签名：无参数、无返回值
    fmt.Println("Hello, World!")
}
```

注意：
- `fmt.Println` 的 `Println` 大写开头，说明它是 `fmt` 包导出的函数
- 如果把 `import "fmt"` 删掉但保留 `fmt.Println`，编译失败
- 如果 import 了 `fmt` 但完全不用，也编译失败

---

## 变量声明

Go 有两种写法，日常 99% 用 `:=`：

```go
package main

import "fmt"

func main() {
    // 短声明（推断类型，只能在函数内用）
    name := "Alice"
    age  := 30

    // 显式类型声明（等同 TS 的 const name: string = "Alice"）
    var greeting string = "Hello"

    // 多变量
    x, y := 10, 20

    fmt.Println(name, age, greeting, x, y)
}
```

| Go | TypeScript |
|----|-----------|
| `x := 42` | `const x = 42` |
| `var x int = 42` | `const x: number = 42` |
| `var x int`（零值为 0） | `let x: number`（undefined） |

**零值**：Go 变量声明后一定有初始值，不会是 `undefined`：
- `int` → `0`，`string` → `""`，`bool` → `false`，指针/slice/map → `nil`

---

## 基本类型

| Go 类型 | TypeScript 对应 | 备注 |
|--------|----------------|------|
| `int` / `int64` | `number` | Go 区分位宽，常用 `int` |
| `float64` | `number` | 浮点数 |
| `string` | `string` | UTF-8，不可变 |
| `bool` | `boolean` | |
| `byte` | — | `uint8` 别名，处理字节流时用 |
| `rune` | — | `int32` 别名，表示一个 Unicode 字符 |

Go **没有** `any` / `undefined` / `null`（有 `nil`，但只用于指针、slice、map、channel、函数、接口）。

---

## 函数

Go 函数最重要的特性：**可以返回多个值**，这是 Go 错误处理的基础。

```go
package main

import (
    "errors"
    "fmt"
)

// 单返回值
func add(a, b int) int {
    return a + b
}

// 多返回值（Go 惯用法：最后一个返回 error）
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    sum := add(3, 4)
    fmt.Println(sum) // 7

    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("error:", err)
        return
    }
    fmt.Println(result) // 5
}
```

TypeScript 中返回多个值需要用对象或元组：`return { result, error }`，Go 直接语言层面支持。

---

## 控制流

### if

```go
x := 10
if x > 5 {
    fmt.Println("big")
} else if x == 5 {
    fmt.Println("equal")
} else {
    fmt.Println("small")
}
```

Go 的 `if` 条件不加括号（TS/JS 需要括号）。

**if 带初始化语句**（Go 特有，很常用）：

```go
// err 的作用域只在这个 if/else 块内
if err := doSomething(); err != nil {
    fmt.Println("error:", err)
}
```

### for（Go 唯一的循环关键字，没有 while）

```go
// 等同 TS 的 for (let i = 0; i < 5; i++)
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// 等同 TS 的 while (condition)
n := 0
for n < 10 {
    n++
}

// 等同 TS 的 for...of（遍历 slice/map/string/channel）
nums := []int{1, 2, 3}
for i, v := range nums {
    fmt.Printf("index=%d value=%d\n", i, v)
}

// 不需要 index 时用 _（Go 不允许声明了不用）
for _, v := range nums {
    fmt.Println(v)
}
```

---

## 结构体（struct）

Go 没有 `class`，用 `struct` 定义数据结构，用方法定义行为：

```go
package main

import "fmt"

// 定义结构体（类似 TS 的 interface 或 class 的数据部分）
type User struct {
    Name  string
    Age   int
    email string // 小写：包私有，外部访问不到
}

// 方法：绑定在类型上的函数
// (u User) 是"receiver"，相当于 TS 的 this
func (u User) Greet() string {
    return fmt.Sprintf("Hi, I'm %s", u.Name)
}

// 指针 receiver：可以修改结构体的字段
func (u *User) SetAge(age int) {
    u.Age = age
}

func main() {
    u := User{Name: "Alice", Age: 25}
    fmt.Println(u.Greet()) // Hi, I'm Alice

    u.SetAge(26)
    fmt.Println(u.Age) // 26
}
```

| TypeScript | Go |
|-----------|-----|
| `interface User { name: string }` | `type User struct { Name string }` |
| `class User { greet() {...} }` | `type User struct{} + func (u User) Greet()` |
| `new User()` | `User{}` 或 `&User{}` |
| `this.name` | receiver（`u.Name`） |

---

## 指针

这是 TypeScript 没有的概念，也是 Go 新人最容易卡住的地方。

**核心一句话**：Go 的变量赋值默认是值拷贝，指针让你传递"地址"而非副本。

```go
package main

import "fmt"

func main() {
    x := 42

    // & 取地址：得到指向 x 的指针
    p := &x
    fmt.Println(p)  // 打印地址，如 0xc000018090
    fmt.Println(*p) // * 解引用：得到地址里的值，输出 42

    // 通过指针修改原变量
    *p = 100
    fmt.Println(x) // 100，x 被改了
}
```

**为什么需要指针**：

```go
type Counter struct{ n int }

// 值 receiver：修改的是副本，原值不变
func (c Counter) BadInc() { c.n++ }

// 指针 receiver：修改原值
func (c *Counter) Inc() { c.n++ }

func main() {
    c := Counter{}
    c.BadInc()
    fmt.Println(c.n) // 0，没变

    c.Inc()
    fmt.Println(c.n) // 1，改了
}
```

**简单记忆**：
- `*T` 是"指向 T 的指针"类型
- `&x` 是"取 x 的地址"操作
- `*p` 是"取指针 p 指向的值"操作

---

## Slice（切片）

Go 没有 TS 的 `Array`，用 **slice** 代替：

```go
package main

import "fmt"

func main() {
    // 声明并初始化（类似 TS 的 const nums = [1, 2, 3]）
    nums := []int{1, 2, 3}

    // append 追加元素（类似 TS 的 push，但返回新 slice）
    nums = append(nums, 4, 5)

    // 切片（类似 TS 的 slice）
    sub := nums[1:3] // [2, 3]，左闭右开

    fmt.Println(nums)       // [1 2 3 4 5]
    fmt.Println(sub)        // [2 3]
    fmt.Println(len(nums))  // 5

    // 用 make 创建指定长度的 slice
    zeros := make([]int, 5) // [0 0 0 0 0]
    fmt.Println(zeros)
}
```

**常见陷阱**：切片是对底层数组的引用，修改 `sub` 会影响 `nums`：

```go
sub[0] = 99
fmt.Println(nums) // [1 99 3 4 5]，nums[1] 也变了！
```

---

## Map

```go
package main

import "fmt"

func main() {
    // 声明（类似 TS 的 Record<string, number>）
    scores := map[string]int{
        "Alice": 95,
        "Bob":   87,
    }

    // 读取
    fmt.Println(scores["Alice"]) // 95

    // 安全读取：ok 表示 key 是否存在
    val, ok := scores["Charlie"]
    fmt.Println(val, ok) // 0 false

    // 写入 / 删除
    scores["Charlie"] = 72
    delete(scores, "Bob")

    // 遍历（顺序不固定！）
    for name, score := range scores {
        fmt.Printf("%s: %d\n", name, score)
    }
}
```

---

## 包与可见性

```go
// 文件：mypackage/util.go
package mypackage

// 大写开头 = 导出（public），包外可用
func ExportedFunc() string { return "public" }

// 小写开头 = 未导出（package-private），包外不可访问
func internalFunc() string { return "private" }
```

```go
// 使用方
import "github.com/yourname/myproject/mypackage"

mypackage.ExportedFunc()  // ✓
mypackage.internalFunc()  // ✗ 编译错误
```

| TypeScript | Go |
|-----------|-----|
| `export function foo()` | `func Foo()`（大写） |
| 未 export 的函数 | `func foo()`（小写） |
| `public` / `private` 关键字 | 首字母大/小写决定 |

---

## 快速对照表

| 概念 | TypeScript | Go |
|------|-----------|-----|
| 项目初始化 | `npm init` | `go mod init <名称>` |
| 运行 | `npx ts-node app.ts` | `go run .` |
| 编译 | `tsc` | `go build` |
| 变量 | `const x = 1` | `x := 1` |
| 类型注解 | `const x: number = 1` | `var x int = 1` |
| 函数 | `function f(a: number): number` | `func f(a int) int` |
| 多返回值 | `return { val, err }` | `return val, err` |
| 类 | `class Foo { ... }` | `type Foo struct{} + func (f Foo) Method()` |
| 接口 | `interface I { method(): void }` | `type I interface { Method() }` |
| 数组 | `number[]` | `[]int`（slice） |
| 字典 | `Record<string, number>` | `map[string]int` |
| 错误处理 | `throw / try/catch` | `return val, error` |
| 并发 | `async/await` | `go func()` |
| 模块导出 | `export` 关键字 | 首字母大写 |
| 未使用变量 | 警告（TS）/ 允许（JS） | **编译错误** |
