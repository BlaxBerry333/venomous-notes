---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__8.md
---

# Go 与 TypeScript 的核心差异：组合、接口、值语义、错误

**本文解决什么问题**：让有 TypeScript 背景的工程师在面试中能清晰回答"Go 和你之前的语言最大的不同是什么"，并避开语言迁移初期的常见认知误区。

**前置知识**：TypeScript/JavaScript 日常开发经验；不需要提前学 Go 语法。

---

## 一张表看清整体差异

| 维度 | TypeScript | Go |
|------|-----------|-----|
| 代码复用 | `class` 继承（`extends`） | 组合（embedding） |
| 接口声明 | structural typing，接口可选实现声明 | structural typing，编译期检查，运行时携带类型信息 |
| 值 vs 引用 | 对象始终引用语义，基本类型值语义 | 显式区分：`T` 值类型 vs `*T` 指针类型 |
| 错误机制 | `throw` / `try/catch` | `error` 值返回，惯用多返回值 |
| 并发模型 | 单线程事件循环 + `async/await` | goroutine（M:N 调度，真并行） |
| 泛型 | TS 4.x 引入，structural 约束 | Go 1.18 引入，编译期单态化（monomorphization） |
| 类型系统 | 可选（编译后类型信息抹掉） | 强制，运行时保留完整类型信息 |
| null 安全 | `undefined` / `null`，需手动 `?` | 无 null，零值 + 显式指针 nil |

---

## 组合代替继承：embedding

TypeScript 用 `class extends` 实现继承；Go 没有 `class`，没有 `extends`，没有虚方法表驱动的多态。

Go 用 **embedding（嵌入）** 达到代码复用的目的：

```go
package main

import "fmt"

// TypeScript 对应：class Logger { log(msg: string) {...} }
type Logger struct {
    prefix string
}

func (l *Logger) Log(msg string) {
    fmt.Printf("[%s] %s\n", l.prefix, msg)
}

// TypeScript 对应：class Job extends Logger { command: string }
// Go 的做法：嵌入，不是继承
type Job struct {
    Command string
    *Logger // 嵌入字段，类型名即字段名
}

func main() {
    j := &Job{
        Command: "backup",
        Logger:  &Logger{prefix: "JOB"},
    }
    // 方法提升（promotion）：可以直接调用 Logger 的方法
    j.Log("starting now...")
    // 也可以通过字段名显式访问
    j.Logger.Log("via explicit field")
}
```

**关键区分**：

- receiver 仍然是内层类型（`*Logger`），不是 `*Job`；嵌入只是语法糖，不是继承
- TypeScript 的 `super.method()` 在 Go 里没有对应物，因为根本没有"父类"概念
- 外层类型可以嵌入多个类型，不存在多重继承的菱形问题
- 外层定义了同名方法时，内层方法被"遮蔽"

**面试常问**：embedding 和继承最大的区别？—— embedding 不传递 receiver，`Job` 调用 `Log` 时，`Log` 的 receiver 是 `*Logger` 而非 `*Job`，所以 `Job` 无法通过接口断言被当作 `*Logger` 使用。

---

## 接口隐式实现：structural typing

TypeScript 和 Go 都用 structural typing，但有一个关键差异：**Go 的接口在运行时是真实存在的值**，TypeScript 的类型信息编译后被抹掉。

```go
package main

import "fmt"

// 定义接口（可以在任何包里定义，甚至调用方的包）
type Stringer interface {
    String() string
}

// 结构体完全不知道 Stringer 的存在——和 TS 的 structural typing 一样
type Point struct {
    X, Y int
}

// 只要方法签名匹配，就自动实现接口
func (p Point) String() string {
    return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

func Print(s Stringer) {
    fmt.Println(s.String())
}

func main() {
    p := Point{3, 4}
    Print(p) // 输出：(3, 4)
}
```

**与 TypeScript 的对比**：

| 场景 | TypeScript | Go |
|------|-----------|-----|
| 给第三方类型加接口 | 用模块扩展（module augmentation）或 Adapter | 直接定义新接口，第三方类型自动满足 |
| 测试时 mock 依赖 | jest.mock / ts-mockito | 定义小接口，手写 struct 实现即可 |
| 运行时类型信息 | 类型抹掉，需 `typeof` / `instanceof` | 接口值携带类型指针，`errors.As` 等基于此实现 |
| 接口 nil 陷阱 | 不存在 | 存在（见下方） |

**编译期检查技巧**：强制验证某类型实现了某接口：

```go
// 编译时断言：*Point 必须实现 Stringer，否则编译失败
var _ Stringer = (*Point)(nil)
```

### nil 接口陷阱（TypeScript 没有这个坑）

Go 的接口值内部是一个 `(Type, Value)` 对：

```go
func returnsStringer() Stringer {
    var p *Point = nil
    return p // 危险！接口值是 (Type=*Point, Value=nil)，不是 nil 接口
}

func main() {
    s := returnsStringer()
    fmt.Println(s == nil) // false！类型信息不为 nil
}
```

**规则**：接口为 `nil` 当且仅当 Type 和 Value 都未设置。一个 nil 指针赋给接口后，接口不为 nil。

---

## 值语义 vs 指针语义

TypeScript 对象始终是引用：`const b = a` 后修改 `b.x` 会影响 `a`。Go 的结构体赋值是**完整拷贝**。

### 结构体赋值是值拷贝

```go
package main

import "fmt"

type Config struct {
    MaxConn int
    Debug   bool
}

func main() {
    a := Config{MaxConn: 10, Debug: true}
    b := a        // 完整拷贝，不是引用
    b.MaxConn = 99
    fmt.Println(a.MaxConn) // 10，a 不受影响
    fmt.Println(b.MaxConn) // 99
}
```

TypeScript 等价行为需要显式拷贝：`const b = { ...a }`。

### receiver 选择规则

```go
package main

import "fmt"

type Counter struct {
    n int
}

// 值 receiver：不修改原值，相当于 TS 里的 get 操作
func (c Counter) Value() int {
    return c.n
}

// 指针 receiver：修改原值，相当于 TS 里修改 this 的方法
func (c *Counter) Inc() {
    c.n++
}

func main() {
    c := Counter{}
    c.Inc() // Go 自动取地址：(&c).Inc()
    c.Inc()
    fmt.Println(c.Value()) // 2
}
```

**选择指针 receiver 的三个场景**：

1. 方法需要修改 receiver 的字段
2. 结构体较大（避免每次调用都拷贝，类似 TS 传对象引用）
3. 该类型已有其他指针 receiver 方法（保持一致性）

### 接口 + 指针：方法集规则

```go
type Writer interface {
    Write([]byte) (int, error)
}

type MyWriter struct{}

func (w *MyWriter) Write(p []byte) (int, error) { return len(p), nil }

// 正确：*MyWriter 实现了 Writer
var _ Writer = &MyWriter{}

// 编译错误：MyWriter（值类型）的方法集不包含指针 receiver 的方法
// var _ Writer = MyWriter{}
```

规则：`*T` 的方法集 = T 的值 receiver 方法 + T 的指针 receiver 方法；`T` 的方法集只含值 receiver 方法。

---

## error 是值，不是异常

TypeScript 用 `throw` + `try/catch`；Go 完全不同：**error 是普通返回值**，通过多返回值惯用法传递。

```go
package main

import (
    "errors"
    "fmt"
    "strconv"
)

// TypeScript 对应：function divide(a: number, b: number): number { if (b===0) throw new Error(...) }
// Go：返回 (结果, error) 两个值
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func parseAndDivide(s string, b float64) (float64, error) {
    a, err := strconv.ParseFloat(s, 64)
    if err != nil {
        // 用 %w 包装 error，保留原始 error 链（类似 TS 的 cause: originalError）
        return 0, fmt.Errorf("parseAndDivide: parse %q: %w", s, err)
    }
    result, err := divide(a, b)
    if err != nil {
        return 0, fmt.Errorf("parseAndDivide: %w", err)
    }
    return result, nil
}

func main() {
    v, err := parseAndDivide("3.14", 0)
    if err != nil {
        fmt.Println("error:", err)
        return
    }
    fmt.Println("result:", v)
}
```

**与 TypeScript 的对比**：

| 方面 | TypeScript throw/catch | Go error |
|------|----------------------|---------|
| 是否强制处理 | 否（未捕获会崩溃） | 惯例强制（`if err != nil`） |
| 控制流影响 | 栈展开，跨函数跳转 | 无，普通返回值 |
| 忽略错误 | 不 catch 即忽略 | 可以 `_` 忽略（通常是 bug） |
| 添加上下文 | `new Error("ctx", { cause: err })` | `fmt.Errorf("ctx: %w", err)` |
| 类型检查 | `err instanceof MyError` | `errors.As(err, &target)` |
| 嵌套 error 链 | ES2022 `cause` 字段 | `errors.Is` / `errors.As` 递归遍历 |

### async/await vs goroutine

TypeScript 用 `async/await` 处理异步，本质是单线程事件循环：

```typescript
// TypeScript：单线程，I/O 并发
const result = await fetch(url);
```

Go 用 goroutine 实现真并行，不需要标记 `async`：

```go
// Go：真并行，I/O 和 CPU 都可以并行
go func() {
    resp, err := http.Get(url)
    // ...
}()
```

| 方面 | TypeScript async/await | Go goroutine |
|------|----------------------|-------------|
| 线程模型 | 单线程事件循环 | M:N 调度，多 OS 线程 |
| 传染性 | 有（async 函数传染调用链） | 无（普通函数即可 go） |
| 并行计算 | 不支持（Worker 另算） | 原生支持 |
| 内存占用 | 微 | ~2KB 初始栈，可扩展 |
| 数量上限 | 有限（受事件循环限制） | 数十万级别 |

### panic/recover：仅用于不可恢复错误

panic 不是 Go 版的 `throw`，不要替换 error 使用：

```go
package main

import (
    "fmt"
    "log"
)

// 合理场景：程序初始化时发现无法继续的配置
func mustPositive(n int) int {
    if n <= 0 {
        panic(fmt.Sprintf("mustPositive: got %d", n))
    }
    return n
}

// 库边界处用 recover 把内部 panic 转成 error 返回
func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("safeDiv recovered: %v", r)
        }
    }()
    return a / b, nil // b=0 触发 runtime panic
}

func main() {
    result, err := safeDiv(10, 0)
    if err != nil {
        log.Println(err)
        return
    }
    fmt.Println(result)
}
```

**面试红线**：不要把 panic/recover 当作 Go 版的 try/catch 来用——面试官看到这种写法会直接减分。
