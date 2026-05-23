---
slug: go-testing-intro
lang: zh
---

# Go 测试基础：go test、table-driven、-race

> **本文解决什么问题**：Go 测试是内置在工具链里的——不需要安装 Jest，不需要配置 test runner。本文讲清楚 Go 测试的写法惯例（table-driven）、关键命令，以及为什么 `-race` 是必须习惯的开关。
>
> **前置知识**：[B04-sync-primitives](./B04-sync-primitives.md)（data race 概念）

---

## go test 工作原理

```bash
go test ./...          # 递归测试当前模块所有包
go test ./handler/...  # 只测试 handler 包及子包
go test -v ./...       # verbose：打印每个测试用例名称
go test -run TestGet   # 只运行名字匹配 TestGet 的测试
go test -race ./...    # 开启 race detector（强烈推荐）
```

`go test` 寻找当前目录下 `*_test.go` 文件，编译并运行其中以 `Test` 开头（参数为 `*testing.T`）的函数。

---

## 最简单的测试

```go
// math/add.go
package math

func Add(a, b int) int { return a + b }
```

```go
// math/add_test.go
package math  // 同包测试（可以访问内部函数）

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2,3) = %d, want 5", result)
    }
}
```

关键 API：

| 方法 | 用途 |
|------|------|
| `t.Errorf(msg, ...)` | 记录失败，继续执行 |
| `t.Fatalf(msg, ...)` | 记录失败，立即终止当前测试 |
| `t.Log(msg)` | 打印日志（仅 -v 时可见） |
| `t.Helper()` | 标记辅助函数，错误行号指向调用方 |

---

## Table-Driven Test：Go 的标准写法

不要为每个输入写一个独立的 `TestXxx` 函数——Go 的惯用法是把所有测试用例放进一个 slice，用循环跑：

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"正数相加", 2, 3, 5},
        {"负数相加", -1, -2, -3},
        {"零值", 0, 0, 0},
        {"正负混合", 10, -3, 7},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {  // t.Run 创建子测试
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
```

`t.Run` 的好处：
- 失败时明确显示是哪个用例（`TestAdd/正数相加`）
- 可以用 `-run TestAdd/正数` 单独跑某个用例

对比 TypeScript（Jest/Vitest）：

```typescript
// TypeScript table-driven 等价写法
describe("Add", () => {
    test.each([
        ["正数相加", 2, 3, 5],
        ["负数相加", -1, -2, -3],
    ])("%s", (name, a, b, want) => {
        expect(add(a, b)).toBe(want);
    });
});
```

---

## 测试辅助函数

```go
// 辅助函数：打上 t.Helper() 让错误行号正确
func assertEqual(t *testing.T, got, want int) {
    t.Helper()
    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}

func TestAdd(t *testing.T) {
    assertEqual(t, Add(2, 3), 5)  // 错误时显示这行，而不是 assertEqual 内部的行
}
```

---

## 包外测试（黑盒测试）

```go
// store/store_test.go

// 同包：package store（可访问内部字段）
// 包外：package store_test（只能通过公开 API 测试）

package store_test  // ← 注意 _test 后缀，这是 Go 的包外测试惯例

import (
    "testing"
    "github.com/yourname/books-api/store"
)

func TestStore_Get(t *testing.T) {
    s := store.New()
    // 只能访问 store 的公开方法
    book := s.Create(&store.Book{Title: "Go in Action"})
    got, ok := s.Get(book.ID)
    if !ok {
        t.Fatal("Get: book not found")
    }
    if got.Title != "Go in Action" {
        t.Errorf("title = %q, want %q", got.Title, "Go in Action")
    }
}
```

---

## -race detector

`go test -race` 在运行时检测 data race，是 Go 测试最重要的开关之一：

```bash
go test -race ./...
```

```
# 示例输出（有 race 时）
==================
WARNING: DATA RACE
Write at 0x00c00001e0a0 by goroutine 8:
  main.(*Store).Set()
      store.go:23 +0x5c

Previous read at 0x00c00001e0a0 by goroutine 7:
  main.(*Store).Get()
      store.go:17 +0x4c
==================
```

**什么时候会漏检？** race detector 只检测运行时实际执行的代码路径。如果测试没有覆盖到并发路径，detector 也不会报警。所以写并发代码时要专门写并发测试（多个 goroutine 同时读写）。

---

## Benchmark

```go
func BenchmarkAdd(b *testing.B) {
    b.ReportAllocs()  // 统计内存分配次数
    b.ResetTimer()    // 不把初始化时间计入 benchmark

    for i := 0; i < b.N; i++ {  // b.N 由框架自动决定，直到结果稳定
        Add(2, 3)
    }
}
```

```bash
go test -bench=BenchmarkAdd -benchmem ./math/...
```

输出：

```
BenchmarkAdd-8    1000000000    0.2381 ns/op    0 B/op    0 allocs/op
```

- `ns/op`：每次操作耗时
- `B/op`：每次操作分配内存
- `allocs/op`：每次操作 GC 分配次数

---

## 测试文件约定

```
books-api/
├── store/
│   ├── store.go
│   └── store_test.go      # 同包或包外测试
├── handler/
│   ├── books.go
│   ├── books_test.go      # handler 测试（依赖 httptest，见 go-gin/05）
│   └── testutil_test.go   # 测试辅助函数（只在测试中可见）
```

`testutil_test.go` 里的函数只在测试编译时存在，不会进入生产二进制。

---

## 和 Gin 的关联

Gin 文档 [05-testing-gin](../go-gin/05-testing-gin.md) 在本文基础上加了 `httptest.NewRecorder` + `r.ServeHTTP(w, req)`——HTTP handler 的测试模式。本文讲的 table-driven 结构、`t.Run`、`t.Helper` 在那里完全通用。
