---
slug: go-interview-guide
lang: zh
---

# Slice 与 Map：Go 的动态集合

**本文解决什么问题**：理解 slice 的内部机制（为什么 append 有时会"断开"），掌握 map 的基本用法和零值陷阱，避免常见 bug。

**前置知识**：[01-variables-types](./A01-variables-types.md)（类型、零值）；[03-pointers](./A03-pointers.md)（指针，理解 slice 头部时有帮助）。

---

## Array：Go 的固定长度数组（几乎不直接用）

Go 有数组类型，但长度是类型的一部分（`[3]int` 和 `[5]int` 是不同类型），通常只作为 slice 的底层存储，日常开发直接用 slice。

```go
var a [3]int = [3]int{1, 2, 3}
// a 是值类型，赋值或传参会完整复制
```

---

## Slice：TypeScript Array 的 Go 版

TypeScript 的数组其实就是动态大小的列表，Go 的 `slice` 也是。

```typescript
// TypeScript
const nums: number[] = [1, 2, 3];
nums.push(4);
console.log(nums.length); // 4
```

```go
// Go
package main

import "fmt"

func main() {
    // 字面量创建
    nums := []int{1, 2, 3}

    // append 添加元素（注意：必须把结果赋回原变量）
    nums = append(nums, 4)
    fmt.Println(len(nums)) // 4
    fmt.Println(nums)      // [1 2 3 4]

    // make：创建指定长度/容量的 slice
    s := make([]int, 3)    // len=3, cap=3，所有元素为零值 0
    fmt.Println(s)          // [0 0 0]

    s2 := make([]int, 0, 5) // len=0, cap=5（预分配容量，减少 append 时的内存重分配）
    s2 = append(s2, 1, 2, 3)
    fmt.Println(s2)         // [1 2 3]
}
```

---

## Slice 内部结构：三元组

这是理解 slice 行为的关键。每个 slice 实际上是一个**三元组**：

```
slice header:
┌─────────┬─────┬─────┐
│  ptr    │ len │ cap │
└─────────┴─────┴─────┘
    ↓
底层数组: [1][2][3][4][5]
```

- **ptr**：指向底层数组的起始位置
- **len**（长度）：当前有效元素数量，`len(s)` 返回
- **cap**（容量）：从 ptr 开始到底层数组末尾的元素数，`cap(s)` 返回

### 切片操作共享底层数组

```go
package main

import "fmt"

func main() {
    original := []int{1, 2, 3, 4, 5}
    sliced := original[1:3] // 共享底层数组！

    fmt.Println(sliced)      // [2 3]
    fmt.Println(len(sliced)) // 2
    fmt.Println(cap(sliced)) // 4（从位置 1 到末尾）

    // 修改 sliced 会影响 original！
    sliced[0] = 99
    fmt.Println(original) // [1 99 3 4 5]
}
```

**注意**：这和 TypeScript 的 `slice()` 不同——JS 的 `slice()` 会创建新数组，Go 的切片操作**共享底层数组**。

### append 导致"断开"

当 append 导致扩容时，会分配新的底层数组，原来的连接断开：

```go
package main

import "fmt"

func main() {
    original := []int{1, 2, 3}
    shared := original[:]    // 共享底层数组

    // cap 未超出：修改会影响 original
    shared = append(shared[:1], 99)
    fmt.Println(original) // [1 99 3]

    // cap 超出：append 分配新数组，shared 不再影响 original
    big := make([]int, 3, 3)
    copy(big, original)
    big = append(big, 4, 5, 6) // 超出 cap=3，分配新数组
    big[0] = 100
    fmt.Println(original) // 不变
}
```

**最佳实践**：如果需要独立副本，用 `copy`：

```go
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src) // dst 是完全独立的副本
```

---

## 遍历 Slice

```go
package main

import "fmt"

func main() {
    fruits := []string{"apple", "banana", "cherry"}

    // for range：同时获取下标和值
    for i, v := range fruits {
        fmt.Printf("%d: %s\n", i, v)
    }

    // 只需要值
    for _, v := range fruits {
        fmt.Println(v)
    }

    // 只需要下标
    for i := range fruits {
        fmt.Println(i)
    }
}
```

---

## Map：TypeScript 的 Object/Map

```typescript
// TypeScript
const scores: Record<string, number> = {};
scores["Alice"] = 95;
console.log(scores["Alice"]); // 95
delete scores["Alice"];
```

```go
// Go
package main

import "fmt"

func main() {
    // 用 make 创建（不能用未初始化的 map！）
    scores := make(map[string]int)
    scores["Alice"] = 95
    scores["Bob"] = 87

    fmt.Println(scores["Alice"]) // 95

    // 删除
    delete(scores, "Alice")

    // 遍历（顺序不固定！）
    for key, val := range scores {
        fmt.Printf("%s: %d\n", key, val)
    }
}
```

### comma-ok 惯语：区分"不存在"和"零值"

TypeScript 里访问不存在的 key 返回 `undefined`，可以和真实值区分。Go 里访问不存在的 key 返回**零值**（int 的零值是 0），无法区分"key 不存在"和"key 存在但值是 0"——除非用 comma-ok：

```go
package main

import "fmt"

func main() {
    scores := map[string]int{"Alice": 95, "Bob": 0}

    // 错误方式：无法区分"不存在"和"值是 0"
    v := scores["Charlie"] // 0（Charlie 不存在）
    v2 := scores["Bob"]    // 0（Bob 存在但值是 0）
    fmt.Println(v == v2)   // true，无法区分！

    // 正确方式：comma-ok
    val, ok := scores["Charlie"]
    if !ok {
        fmt.Println("Charlie not found") // 执行这里
    } else {
        fmt.Println("Charlie:", val)
    }

    val, ok = scores["Bob"]
    if ok {
        fmt.Println("Bob:", val) // Bob: 0
    }
}
```

### nil map 和空 map 的区别

```go
package main

import "fmt"

func main() {
    var m1 map[string]int // nil map
    m2 := make(map[string]int) // 空 map

    fmt.Println(m1 == nil) // true
    fmt.Println(m2 == nil) // false

    // 读取 nil map：安全，返回零值
    fmt.Println(m1["key"]) // 0

    // 写入 nil map：panic！
    // m1["key"] = 1 // panic: assignment to entry in nil map

    // 写入空 map：正常
    m2["key"] = 1
    fmt.Println(m2) // map[key:1]
}
```

---

## 常见 Slice 操作速查

```go
s := []int{1, 2, 3, 4, 5}

// 追加
s = append(s, 6)                  // [1 2 3 4 5 6]

// 追加多个
s = append(s, 7, 8, 9)            // [1 2 3 4 5 6 7 8 9]

// 拼接两个 slice
other := []int{10, 11}
s = append(s, other...)           // ... 展开另一个 slice

// 切片
sub := s[1:3]                     // [2 3]（包含索引 1，不包含索引 3）
head := s[:3]                     // [1 2 3]（前 3 个）
tail := s[3:]                     // 从索引 3 到末尾

// 删除索引 2 的元素（无内置方法，手动处理）
s = append(s[:2], s[3:]...)       // 拼接前后两段

// 复制
dst := make([]int, len(s))
copy(dst, s)
```
