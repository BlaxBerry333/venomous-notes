---
slug: go-interview-guide
lang: zh
---

# 函数：多返回值、defer 与一等公民

**本文解决什么问题**：掌握 Go 函数的独特特性——多返回值（替代异常）、defer 的执行时机，以及函数作为一等公民的写法。

**前置知识**：[01-variables-types](./A01-variables-types.md)（类型、零值）。

---

## 函数声明

TypeScript：

```typescript
function add(a: number, b: number): number {
    return a + b;
}

// 箭头函数
const add = (a: number, b: number): number => a + b;
```

Go：

```go
func add(a int, b int) int {
    return a + b
}

// 相邻参数类型相同时可以简写
func add(a, b int) int {
    return a + b
}
```

Go 没有箭头函数语法，但函数是一等公民，可以赋值给变量（后文会讲）。

---

## 多返回值：替代异常的核心机制

这是 Go 最与众不同的特性之一。TypeScript 用 `throw` 抛出错误，Go 用**第二个返回值**返回错误：

```typescript
// TypeScript：抛出异常
function divide(a: number, b: number): number {
    if (b === 0) throw new Error("division by zero");
    return a / b;
}

try {
    const result = divide(10, 0);
} catch (e) {
    console.error(e.message);
}
```

```go
// Go：返回错误作为第二个值
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("error:", err)
        return
    }
    fmt.Println(result) // 5

    _, err = divide(10, 0)
    if err != nil {
        fmt.Println("error:", err) // error: division by zero
    }
}
```

**为什么 Go 用这种方式**：错误是普通的值，调用者被迫决定怎么处理（忽略、返回上层、包装），而不是像异常那样可以悄悄跳过。

---

## 命名返回值

可以给返回值起名字，这样 `return` 不需要写值（裸 return）：

```go
package main

import "fmt"

// 命名返回值：n 和 err 在函数开始时已经被声明为零值
func readData() (n int, err error) {
    n = 42
    return // 裸 return，等价于 return n, err
}

func main() {
    n, err := readData()
    fmt.Println(n, err) // 42 <nil>
}
```

命名返回值主要用于短函数，让文档更清晰；长函数中用裸 return 容易让代码难以理解。

---

## defer：函数退出前执行

`defer` 把一个函数调用推迟到当前函数返回前执行，**无论函数是正常返回还是 panic**。

TypeScript 没有等价语法，最接近的是 `try/finally`：

```typescript
// TypeScript：try/finally 保证资源释放
async function readFile(path: string) {
    const file = await open(path);
    try {
        return await file.read();
    } finally {
        await file.close(); // 无论如何都执行
    }
}
```

```go
// Go：defer 保证资源释放，更简洁
package main

import (
    "fmt"
    "os"
)

func readFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close() // 函数返回前一定会执行

    // 继续处理文件...
    fmt.Println("reading", path)
    return nil
}

func main() {
    readFile("test.txt")
}
```

### defer 的执行顺序：LIFO（后进先出）

多个 `defer` 语句按**逆序**执行：

```go
package main

import "fmt"

func main() {
    defer fmt.Println("第一个 defer")  // 最后执行
    defer fmt.Println("第二个 defer")  // 第二个执行
    defer fmt.Println("第三个 defer")  // 第一个执行

    fmt.Println("函数主体")
}
// 输出：
// 函数主体
// 第三个 defer
// 第二个 defer
// 第一个 defer
```

### defer 的参数在声明时求值

```go
package main

import "fmt"

func main() {
    x := 10
    defer fmt.Println("defer 时 x =", x) // x 在这里已经被捕获为 10

    x = 20
    fmt.Println("函数主体 x =", x)
}
// 输出：
// 函数主体 x = 20
// defer 时 x = 10   ← 不是 20！
```

---

## 函数是一等公民

Go 的函数可以赋值给变量、作为参数传入其他函数、作为返回值，这和 TypeScript 完全一样：

```go
package main

import "fmt"

// 函数类型：接受两个 int，返回 int
type BinaryOp func(int, int) int

func apply(a, b int, op BinaryOp) int {
    return op(a, b)
}

func main() {
    add := func(a, b int) int { return a + b }
    mul := func(a, b int) int { return a * b }

    fmt.Println(apply(3, 4, add)) // 7
    fmt.Println(apply(3, 4, mul)) // 12

    // 直接传匿名函数
    fmt.Println(apply(10, 3, func(a, b int) int { return a - b })) // 7
}
```

### 闭包

Go 的闭包和 TypeScript 一样，捕获外部变量的**引用**：

```go
package main

import "fmt"

// makeCounter 返回一个闭包，每次调用递增计数
func makeCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    counter := makeCounter()
    fmt.Println(counter()) // 1
    fmt.Println(counter()) // 2
    fmt.Println(counter()) // 3

    // 新的 counter 有独立的 count
    counter2 := makeCounter()
    fmt.Println(counter2()) // 1
}
```

---

## 可变参数（variadic）

Go 用 `...T` 表示可变参数，和 TypeScript 的 rest parameters 一样：

```typescript
// TypeScript
function sum(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}
```

```go
package main

import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))       // 6
    fmt.Println(sum(1, 2, 3, 4, 5)) // 15

    // 展开 slice：用 ... 传入
    nums := []int{1, 2, 3, 4}
    fmt.Println(sum(nums...)) // 10
}
```
