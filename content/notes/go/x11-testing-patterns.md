---
slug: go-interview-guide
lang: zh
sources:
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__6.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
---

# Go 测试模式：Table-driven、race detector、httptest 与 benchmark

**本文解决什么问题**：掌握 Go 测试的惯用写法，能在面试中展示"我会写可维护的测试"的工程素养，覆盖单元测试、并发测试、HTTP handler 测试和基准测试。

**前置知识**：[02-go-toolchain](./x02-go-toolchain.md)（go test 命令）；[08-interface-design](./x08-interface-design.md)（接口 mock）。

---

## Table-driven test：惯用写法

Table-driven test 是 Go 社区最广泛使用的单元测试结构，用表格定义测试案例，用 `t.Run` 运行子测试。

```go
package math_test

import (
    "errors"
    "testing"
)

// 被测函数
func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func TestDivide(t *testing.T) {
    tests := []struct {
        name    string
        a, b    float64
        want    float64
        wantErr bool
    }{
        {
            name: "normal division",
            a:    10, b: 2,
            want:    5,
            wantErr: false,
        },
        {
            name: "divide by zero",
            a:    10, b: 0,
            want:    0,
            wantErr: true,
        },
        {
            name: "negative dividend",
            a:    -6, b: 3,
            want:    -2,
            wantErr: false,
        },
        {
            name: "fractional result",
            a:    1, b: 3,
            want:    0.333_333_333, // 近似值，用 delta 比较
            wantErr: false,
        },
    }

    for _, tc := range tests {
        tc := tc // Go 1.22 前：避免闭包捕获循环变量
        t.Run(tc.name, func(t *testing.T) {
            t.Parallel() // 子测试并行运行

            got, err := Divide(tc.a, tc.b)

            if (err != nil) != tc.wantErr {
                t.Errorf("Divide(%v, %v) error = %v, wantErr %v", tc.a, tc.b, err, tc.wantErr)
                return
            }
            if !tc.wantErr {
                const delta = 1e-6
                if diff := got - tc.want; diff > delta || diff < -delta {
                    t.Errorf("Divide(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
                }
            }
        })
    }
}
```

运行：

```bash
go test -v -run TestDivide ./...
# 输出：
# --- PASS: TestDivide (0.00s)
#     --- PASS: TestDivide/normal_division (0.00s)
#     --- PASS: TestDivide/divide_by_zero (0.00s)
#     --- PASS: TestDivide/negative_dividend (0.00s)
#     --- PASS: TestDivide/fractional_result (0.00s)
```

**为什么用 Table-driven**：新增测试案例只需在 `tests` 切片里加一行，不需要复制粘贴测试函数。

---

## race detector：原理与使用

race detector 基于 Google 的 ThreadSanitizer 实现，通过在编译时对所有内存访问插装代码，在运行时检测非同步的并发读写。

```bash
go test -race ./...       # 测试时启用
go run -race main.go      # 运行时启用
go build -race -o app .   # 构建带 race 检测的二进制（用于负载测试）
```

### 检测示例

```go
package main

import (
    "fmt"
    "sync"
    "testing"
)

// 有竞态的代码
func unsafeCounter() int {
    var counter int
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter++ // 竞态：多个 goroutine 读写同一变量
        }()
    }
    wg.Wait()
    return counter
}

func TestUnsafeCounter(t *testing.T) {
    // 运行 go test -race 时会报告：
    // WARNING: DATA RACE
    // Write at 0x... by goroutine N
    // Previous write at 0x... by goroutine M
    _ = unsafeCounter()
}

// 修复后的版本
func safeCounter() int {
    var counter int
    var mu sync.Mutex
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            counter++
            mu.Unlock()
        }()
    }
    wg.Wait()
    return counter
}

func TestSafeCounter(t *testing.T) {
    got := safeCounter()
    if got != 100 {
        t.Errorf("safeCounter() = %d, want 100", got)
    }
    fmt.Println(got) // 防止 unused import 警告
}
```

**race detector 的重要限制**：

- 只能检测**实际运行到的代码路径**中的竞态，覆盖率取决于测试质量
- 启用后 CPU 和内存开销约增加 10 倍，**不能在生产环境常开**
- 推荐策略：CI 全量 `-race` 测试 + 负载测试时单独启用一个 race 实例

---

## httptest：测试 HTTP Handler

不需要真实启动 HTTP 服务器，使用 `net/http/httptest` 包在内存中模拟请求/响应。

```go
package handler_test

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

// 被测 handler
func HealthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func TestHealthHandler(t *testing.T) {
    // 创建模拟请求
    req := httptest.NewRequest(http.MethodGet, "/health", nil)

    // 创建 ResponseRecorder（捕获 handler 写入的内容）
    w := httptest.NewRecorder()

    // 执行 handler
    HealthHandler(w, req)

    // 检查状态码
    resp := w.Result()
    if resp.StatusCode != http.StatusOK {
        t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusOK)
    }

    // 检查响应体
    var body map[string]string
    json.NewDecoder(resp.Body).Decode(&body)
    if body["status"] != "ok" {
        t.Errorf("body status = %q, want %q", body["status"], "ok")
    }
}

// httptest.NewServer：测试真实 HTTP 客户端行为
func TestHealthHandlerWithServer(t *testing.T) {
    server := httptest.NewServer(http.HandlerFunc(HealthHandler))
    defer server.Close()

    resp, err := http.Get(server.URL + "/health")
    if err != nil {
        t.Fatal(err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusOK)
    }
}
```

---

## 接口 mock vs 真实依赖

```go
package service_test

import (
    "context"
    "errors"
    "testing"
)

// 接口定义（在 service 包中）
type UserRepo interface {
    FindByID(ctx context.Context, id int64) (string, error)
}

// 被测 service
type UserService struct {
    repo UserRepo
}

func (s *UserService) GetUsername(ctx context.Context, id int64) (string, error) {
    name, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return "", errors.New("user not found")
    }
    return name, nil
}

// 手写 mock：不需要 mockgen/testify，只需实现接口
type mockUserRepo struct {
    data map[int64]string
    err  error
}

func (m *mockUserRepo) FindByID(_ context.Context, id int64) (string, error) {
    if m.err != nil {
        return "", m.err
    }
    name, ok := m.data[id]
    if !ok {
        return "", errors.New("not found")
    }
    return name, nil
}

func TestGetUsername(t *testing.T) {
    tests := []struct {
        name    string
        repo    *mockUserRepo
        id      int64
        want    string
        wantErr bool
    }{
        {
            name:    "found",
            repo:    &mockUserRepo{data: map[int64]string{1: "Alice"}},
            id:      1,
            want:    "Alice",
            wantErr: false,
        },
        {
            name:    "not found",
            repo:    &mockUserRepo{data: map[int64]string{}},
            id:      99,
            want:    "",
            wantErr: true,
        },
        {
            name:    "repo error",
            repo:    &mockUserRepo{err: errors.New("db unavailable")},
            id:      1,
            want:    "",
            wantErr: true,
        },
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            svc := &UserService{repo: tc.repo}
            got, err := svc.GetUsername(context.Background(), tc.id)
            if (err != nil) != tc.wantErr {
                t.Errorf("GetUsername() error = %v, wantErr %v", err, tc.wantErr)
            }
            if got != tc.want {
                t.Errorf("GetUsername() = %q, want %q", got, tc.want)
            }
        })
    }
}
```

---

## benchmark：写法与结果解读

```go
package sort_test

import (
    "math/rand"
    "sort"
    "testing"
)

// BenchmarkXxx 命名约定
func BenchmarkSortInts(b *testing.B) {
    // b.N 由测试框架自动调整，保证测试运行足够长的时间
    for i := 0; i < b.N; i++ {
        // 重置计时器（排除 setup 时间）
        data := rand.Perm(1000)
        b.ResetTimer()
        sort.Ints(data)
    }
}

// 对比两种实现
func BenchmarkBubbleSort(b *testing.B) {
    for i := 0; i < b.N; i++ {
        data := rand.Perm(100)
        b.ResetTimer()
        bubbleSort(data)
    }
}

func bubbleSort(data []int) {
    n := len(data)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if data[j] > data[j+1] {
                data[j], data[j+1] = data[j+1], data[j]
            }
        }
    }
}
```

```bash
go test -bench=. -benchmem ./...
```

输出示例解读：

```
BenchmarkSortInts-8     100000     12345 ns/op    8192 B/op    1 allocs/op
BenchmarkBubbleSort-8     1000   1234567 ns/op       0 B/op    0 allocs/op
```

| 字段 | 含义 |
|------|------|
| `-8` | GOMAXPROCS=8（CPU 核数） |
| `100000` | b.N 的值（运行了 10 万次） |
| `12345 ns/op` | 每次操作耗时 12345 纳秒 |
| `8192 B/op` | 每次操作分配了 8192 字节 |
| `1 allocs/op` | 每次操作触发了 1 次堆分配 |
