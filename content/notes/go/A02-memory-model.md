---
slug: go-interview-guide
lang: zh
---

# 内存模型：栈、堆与深浅拷贝

**本文解决什么问题**：理解 Go 变量存在哪里（栈 vs 堆）、Go 的深浅拷贝行为，以及为什么 JavaScript 里习以为常的"对象是引用"到了 Go 里需要重新思考。

**前置知识**：[01-variables-types](./A01-variables-types.md)（类型与零值）。

---

## JavaScript 的内存"黑盒"

JavaScript（TypeScript）里，内存分配对你是完全透明的——引擎替你决定一切：

```typescript
// 你只管用，引擎决定放哪里
const n = 42;                     // 基础类型
const obj = { x: 1, y: 2 };      // 对象
const arr = [1, 2, 3];            // 数组
```

你从不需要思考"这个变量在栈上还是堆上"。但在 Go 里，理解这件事能帮你明白：**为什么有时候传值、有时候传指针**，以及**为什么修改了变量但调用方没看到变化**。

---

## 栈 vs 堆：直觉理解

把内存想象成两个储物区：

```
栈（Stack）                堆（Heap）
┌─────────────┐           ┌──────────────────┐
│ 函数调用帧   │           │ 动态分配的大对象   │
│ 局部变量     │           │ 逃逸到堆的变量     │
│ 自动管理     │           │ GC 负责回收        │
│ 分配/释放极快 │           │ 分配稍慢，但生命   │
│ 函数返回即释放│           │ 周期可以超出函数   │
└─────────────┘           └──────────────────┘
```

**栈**：每个 goroutine 有自己的栈，函数调用时自动扩展，返回时自动收缩。速度极快。

**堆**：由 GC（垃圾回收器）管理，变量生命周期超出函数作用域时放这里。

### Go 怎么决定放哪里：逃逸分析

Go 编译器会做**逃逸分析（escape analysis）**——如果变量只在函数内部用，放栈；如果变量被返回出去（或被指针引用，生命周期超出函数），放堆：

```go
package main

import "fmt"

func stackVar() int {
    x := 42     // x 只在函数内用 → 放栈，函数返回时自动回收
    return x    // 返回的是值（拷贝），不是 x 本身
}

func heapVar() *int {
    x := 42     // x 的地址被返回 → x 逃逸到堆
    return &x   // 函数返回后 x 仍然存活，GC 负责回收
}

func main() {
    v := stackVar()
    p := heapVar()
    fmt.Println(v, *p) // 42 42
}
```

用 `go build -gcflags="-m"` 可以看到逃逸分析结果：

```bash
go build -gcflags="-m" main.go
# ./main.go:9:2: moved to heap: x
```

**实际开发中你不需要手动控制**，Go 编译器替你做决策。理解逃逸分析的意义在于：知道"指针可以安全地从函数返回"——这和 C/C++ 不同（C 里返回局部变量的指针是 undefined behavior）。

---

## 值类型 vs 引用类型

这是理解深浅拷贝的基础。

**JavaScript 的规则**：
- 基础类型（number, string, boolean）→ 值传递，赋值创建副本
- 对象和数组 → 引用传递，赋值共享同一个对象

```typescript
// TypeScript：基础类型 = 值拷贝
let a = 42;
let b = a;
b = 100;
console.log(a); // 42（没变）

// TypeScript：对象 = 引用共享
const obj1 = { x: 1 };
const obj2 = obj1;   // obj2 和 obj1 指向同一个对象
obj2.x = 99;
console.log(obj1.x); // 99（变了！）
```

**Go 的规则**：Go 里**所有赋值默认是值拷贝**，包括 struct。如果想共享，必须显式使用指针：

```go
package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    // struct 赋值 = 完整拷贝（和 JS 对象完全不同！）
    p1 := Point{X: 1, Y: 2}
    p2 := p1     // p2 是 p1 的副本
    p2.X = 99
    fmt.Println(p1.X) // 1（没变！）

    // 想共享：使用指针
    p3 := &p1    // p3 指向 p1
    p3.X = 99
    fmt.Println(p1.X) // 99（变了！）
}
```

| 类型 | Go 赋值行为 | JavaScript 赋值行为 |
|------|-----------|-------------------|
| int, float, bool, string | 值拷贝 | 值拷贝 |
| struct | **值拷贝**（Go 特有） | 无直接对应 |
| array `[N]T` | **值拷贝** | 无直接对应 |
| slice `[]T` | 拷贝**头部**（共享底层数组） | 类似（数组是引用） |
| map | 拷贝**引用**（共享底层数据） | 类似（对象是引用） |
| pointer `*T` | 拷贝**指针地址** | 类似（对象引用） |

---

## 浅拷贝：默认行为

**浅拷贝**：只复制"顶层"，嵌套的引用类型仍然共享。

### Struct 中含有 slice/map 时

```go
package main

import "fmt"

type Team struct {
    Name    string
    Members []string  // slice：引用类型
}

func main() {
    t1 := Team{
        Name:    "Alpha",
        Members: []string{"Alice", "Bob"},
    }

    // struct 赋值 = 浅拷贝
    // Name 字段（string）被拷贝
    // Members 字段（slice header）被拷贝，但底层数组共享！
    t2 := t1
    t2.Name = "Beta"          // 不影响 t1（string 是独立的）
    t2.Members[0] = "Charlie" // 影响 t1！（底层数组共享）

    fmt.Println(t1.Name)       // Alpha（没变）
    fmt.Println(t1.Members[0]) // Charlie（变了！）
}
```

这和 JavaScript 的浅拷贝行为一致：

```typescript
const t1 = { name: "Alpha", members: ["Alice", "Bob"] };
const t2 = { ...t1 };          // 浅拷贝（展开运算符）
t2.name = "Beta";
t2.members[0] = "Charlie";
console.log(t1.name);          // Alpha（没变）
console.log(t1.members[0]);    // Charlie（变了！）
```

---

## 深拷贝：手动处理

Go **没有内置的深拷贝函数**（JavaScript 也没有，通常用 `JSON.parse(JSON.stringify(obj))`）。需要手动复制每一层：

```go
package main

import "fmt"

type Team struct {
    Name    string
    Members []string
}

// 手动深拷贝
func deepCopyTeam(t Team) Team {
    membersCopy := make([]string, len(t.Members))
    copy(membersCopy, t.Members) // copy 复制底层数组内容
    return Team{
        Name:    t.Name,
        Members: membersCopy,
    }
}

func main() {
    t1 := Team{
        Name:    "Alpha",
        Members: []string{"Alice", "Bob"},
    }

    t2 := deepCopyTeam(t1)
    t2.Members[0] = "Charlie"

    fmt.Println(t1.Members[0]) // Alice（没变！深拷贝成功）
    fmt.Println(t2.Members[0]) // Charlie
}
```

### copy()：slice 的深拷贝

```go
package main

import "fmt"

func main() {
    src := []int{1, 2, 3, 4, 5}

    // 错误：浅拷贝，修改 dst 会影响 src
    // dst := src  ← 这只是复制 slice header，底层数组共享

    // 正确：深拷贝
    dst := make([]int, len(src))
    copy(dst, src)

    dst[0] = 99
    fmt.Println(src[0]) // 1（没变）
    fmt.Println(dst[0]) // 99
}
```

---

## string 是不可变的

Go 的 `string` 和 JavaScript 的 `string` 一样是**不可变的**——你不能修改某个字符，只能创建新字符串：

```go
package main

import "fmt"

func main() {
    s := "hello"
    // s[0] = 'H'  // 编译错误：cannot assign to s[0]

    // 修改字符串 = 创建新字符串
    s = "H" + s[1:]
    fmt.Println(s) // Hello

    // string 赋值是值拷贝（但底层字节数组是只读共享的，零开销）
    s1 := "hello"
    s2 := s1  // s2 复制了 string header，底层字节数组只读共享
    s2 = "world"
    fmt.Println(s1) // hello（不受影响）
}
```

---

## 实际意义：传参时的拷贝开销

理解拷贝有一个实用场景——**函数参数传递**。Go 传参默认拷贝整个值：

```go
type BigStruct struct {
    Data [1000]int // 8000 字节
}

// 每次调用都拷贝 8000 字节
func processByValue(s BigStruct) { ... }

// 只拷贝 8 字节（指针大小）
func processByPointer(s *BigStruct) { ... }
```

这也是"大 struct 传指针"规则的由来——下一篇[指针](./A03-pointers.md)会详细讲。

---

## 小结对比

| 场景 | JavaScript | Go |
|------|-----------|-----|
| 对象赋值 | 共享引用 | struct 值拷贝（独立副本） |
| 数组赋值 | 共享引用 | `[N]T` 值拷贝；`[]T` slice header 拷贝 |
| 修改副本影响原始 | 是（对象/数组） | 否（struct）；是（slice 内容修改） |
| 深拷贝 API | 无内置 | 无内置，用 `copy()` 或手动 |
| 内存管理 | GC 全自动 | GC 全自动 + 编译器逃逸分析 |
