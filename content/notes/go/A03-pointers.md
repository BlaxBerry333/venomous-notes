---
slug: go-interview-guide
lang: zh
---

# 指针：值语义 vs 引用语义

**本文解决什么问题**：理解为什么 Go 有指针（TypeScript 没有）、`&` 和 `*` 的含义，以及何时该传指针、何时传值。

**前置知识**：[01-variables-types](./A01-variables-types.md)（类型基础）；[05-structs-methods](./A05-structs-methods.md)（值接收者 vs 指针接收者）。

---

## TypeScript 里的"隐式引用"

TypeScript（JavaScript）里，**对象和数组默认是引用传递**，但你从不需要显式写"取地址"或"解引用"——引擎帮你处理了：

```typescript
// TypeScript：对象是引用
function increment(obj: { count: number }) {
    obj.count++; // 修改的是原始对象
}

const counter = { count: 0 };
increment(counter);
console.log(counter.count); // 1 ✓

// TypeScript：基础类型是值
function addOne(n: number) {
    n++; // 修改的是副本
}

let num = 0;
addOne(num);
console.log(num); // 0（没变）
```

Go 把这个选择权**显式地交给程序员**：你可以明确决定传值还是传指针。

---

## & 和 * ：取地址与解引用

```go
package main

import "fmt"

func main() {
    x := 42

    p := &x  // & 取地址：p 是"指向 x 的指针"，类型是 *int
    fmt.Println(p)  // 0xc0000b4010（内存地址）
    fmt.Println(*p) // 42（* 解引用：取指针指向的值）

    *p = 100  // 通过指针修改原始变量
    fmt.Println(x)  // 100（x 也变了！）
}
```

**类型标记规则**：
- `*int` — 指向 int 的指针类型
- `&x` — 取 x 的地址（操作符）
- `*p` — 解引用，取 p 指向的值（操作符）

---

## 为什么需要指针：修改函数外的变量

Go 的函数参数默认是**值传递**（复制）。如果需要在函数内修改外部变量，必须传指针：

```go
package main

import "fmt"

// 错误：值传递，修改不生效
func incrementWrong(n int) {
    n++ // 修改的是副本
}

// 正确：指针传递
func increment(n *int) {
    *n++ // 通过指针修改原始值
}

func main() {
    x := 0

    incrementWrong(x)
    fmt.Println(x) // 0（没变）

    increment(&x)  // 传入 x 的地址
    fmt.Println(x) // 1（变了！）
}
```

---

## Struct 指针：最常见的用法

struct 是值类型，传入函数时会被完整复制。对于包含很多字段的 struct，传指针既能避免复制开销，又能让函数修改原始数据：

```go
package main

import "fmt"

type User struct {
    Name  string
    Email string
    Age   int
}

// 传值：函数拿到副本，无法修改原始 User
func greetByValue(u User) {
    u.Name = "Modified" // 只修改副本
    fmt.Println("Hello,", u.Name)
}

// 传指针：函数操作原始数据
func updateEmail(u *User, newEmail string) {
    u.Email = newEmail // 修改原始数据
}

func main() {
    user := User{Name: "Alice", Email: "old@example.com", Age: 25}

    greetByValue(user)
    fmt.Println(user.Name) // Alice（未修改）

    updateEmail(&user, "new@example.com")
    fmt.Println(user.Email) // new@example.com（已修改）

    // 访问指针 struct 的字段：不需要显式解引用
    p := &user
    fmt.Println(p.Name)  // Alice（等价于 (*p).Name，Go 自动处理）
}
```

---

## nil 指针

指针的零值是 `nil`，解引用 `nil` 指针会 panic：

```go
package main

import "fmt"

func printName(u *User) {
    if u == nil {
        fmt.Println("user is nil")
        return
    }
    fmt.Println(u.Name)
}

type User struct{ Name string }

func main() {
    var u *User // nil 指针
    printName(u) // user is nil

    u = &User{Name: "Alice"}
    printName(u) // Alice
}
```

Go 没有可选链（`?.`），必须手动检查 `nil`。

---

## 值 vs 指针：选择指南

| 场景 | 传值 | 传指针 |
|------|------|--------|
| 基础类型（int, string...） | 优先 | 极少需要 |
| 小 struct（2-3 个字段） | 优先 | 如需修改 |
| 大 struct（多字段） | 避免（复制开销） | 优先 |
| 需要在函数内修改 | 不行 | 必须 |
| 返回"可能不存在"的值 | — | 返回 `*T`，`nil` 表示不存在 |

---

## new 和 & 的区别

两种方式都能创建指针，效果一样，但写法不同：

```go
// &T{} — 常用，可以初始化字段
u1 := &User{Name: "Alice"}

// new(T) — 不常用，字段全是零值，等价于 &T{}
u2 := new(User)
u2.Name = "Bob"

fmt.Println(u1.Name) // Alice
fmt.Println(u2.Name) // Bob
```

实际项目中几乎都用 `&T{...}` 或构造函数（`NewXxx`），`new` 很少见。

---

## 完整示例：链表节点

指针最直接的应用场景是构建链式数据结构，struct 指向 struct：

```go
package main

import "fmt"

type Node struct {
    Value int
    Next  *Node // 指向下一个节点（nil 表示结尾）
}

func printList(head *Node) {
    for n := head; n != nil; n = n.Next {
        fmt.Print(n.Value, " ")
    }
    fmt.Println()
}

func main() {
    // 构建链表：1 → 2 → 3 → nil
    head := &Node{Value: 1, Next: &Node{Value: 2, Next: &Node{Value: 3}}}
    printList(head) // 1 2 3
}
```
