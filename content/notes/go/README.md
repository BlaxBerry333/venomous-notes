---
slug: go-interview-guide
lang: zh
sources:
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__1.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__2.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__3.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__4.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__5.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__6.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__7.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__8.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__9.md
  - ../../__ai__/doc-writing-team/sources/20260508_go-interview-guide__10.md
---

# Go 后端/系统岗面试学习路径

面向有 TypeScript 背景、目标岗位为后端/系统/平台工程师的读者。所有代码示例使用 Go 1.23，通过 asdf 管理版本。

## 文档一览

### A 档：Go 语法基础（从零开始）

| 文档 | 核心主题 |
|------|----------|
| [A00-go-basics](./A00-go-basics.md) | 编译型语言、模块系统、第一个程序 |
| [A01-variables-types](./A01-variables-types.md) | 变量声明、基础类型、零值、类型转换、iota |
| [A02-memory-model](./A02-memory-model.md) | 栈/堆、逃逸分析、深浅拷贝 vs JavaScript |
| [A03-pointers](./A03-pointers.md) | & 与 *、值传递 vs 指针传递、nil 指针 |
| [A04-functions](./A04-functions.md) | 多返回值、defer、闭包、可变参数 |
| [A05-structs-methods](./A05-structs-methods.md) | struct、方法、值/指针接收者、嵌入（组合）、struct tags |
| [A06-slices-maps](./A06-slices-maps.md) | slice 内部结构、append、map、comma-ok |

### B 档：Go 核心概念（能写 Go，不够用）

| 文档 | 核心主题 |
|------|----------|
| [B01-interfaces](./B01-interfaces.md) | 接口、隐式实现、指针接收者规则、nil interface 陷阱 |
| [B02-errors](./B02-errors.md) | error 接口本质、%w 包装、errors.Is/As、sentinel |
| [B03-goroutines](./B03-goroutines.md) | goroutine、channel、WaitGroup、泄漏入门 |
| [B04-sync-primitives](./B04-sync-primitives.md) | Mutex、RWMutex、Once、atomic、锁拷贝陷阱 |
| [B05-context-basics](./B05-context-basics.md) | WithCancel/Timeout/Deadline/Value、传递规范、取消传播 |
| [B06-testing-intro](./B06-testing-intro.md) | go test、table-driven、t.Run、-race detector、benchmark |

### C 档：工程实践（能写，能构建真实项目）

| 文档 | 核心主题 |
|------|----------|
| [C01-go-module](./C01-go-module.md) | go mod init/get/tidy、版本管理、replace、vendor |
| [C02-project-layout](./C02-project-layout.md) | cmd/internal/pkg 职责、单仓多服务、目录约定 |
| [C03-net-http](./C03-net-http.md) | http.Handler、ResponseWriter、Request、中间件模式 |
| [C04-channel-patterns](./C04-channel-patterns.md) | Pipeline、Fan-out/Fan-in、done channel、select 超时 |
| [C05-interface-design](./C05-interface-design.md) | 小接口原则、依赖注入、接受接口返回结构体 |

> C 档学完后 → 进入 **[Gin 框架](../go-gin/README.md)**

### x 档：面试深度（能说清楚，能拿 Offer）

| 文档 | 核心主题 | 关联练习项目 |
|------|----------|------------|
| [x01-go-vs-others](./x01-go-vs-others.md) | 组合/接口/值语义/error 哲学 vs TypeScript | any |
| [x02-go-toolchain](./x02-go-toolchain.md) | asdf 安装、go mod 深度、lint、pprof | all |
| [x04-concurrency-model](./x04-concurrency-model.md) | goroutine vs thread、GMP 调度、泄漏排查 | worker-pool, pipeline |
| [x06-sync-primitives](./x06-sync-primitives.md) | errgroup、死锁诊断、sync 原理 | worker-pool, ttl-cache |
| [x07-context-guide](./x07-context-guide.md) | gRPC context 传播、deadline 继承、跨服务 | http-server, grpc-gateway |
| [x09-error-handling](./x09-error-handling.md) | 自定义错误类型、panic/recover 边界、库设计 | any |
| [x10-generics-practical](./x10-generics-practical.md) | 泛型语法/约束/适用场景/实战解析 | ttl-cache, event-bus |
| [x11-testing-patterns](./x11-testing-patterns.md) | httptest、net.Pipe、interface mock 策略 | all |
| [x12-interview-qa](./x12-interview-qa.md) | 40+ 高频 Q&A、追问链、红线回答 | all |

---

## 推荐阅读顺序

### A 档：语法入门（第 1 周）

1. [A00-go-basics](./A00-go-basics.md) — 了解 Go 是什么，跑通第一个程序
2. [A01-variables-types](./A01-variables-types.md) — 变量、类型、零值
3. [A02-memory-model](./A02-memory-model.md) — 栈/堆、深浅拷贝 vs JavaScript
4. [A03-pointers](./A03-pointers.md) — 指针，理解值传递 vs 引用传递
5. [A04-functions](./A04-functions.md) — 函数、多返回值（Go 最重要的特性之一）
6. [A05-structs-methods](./A05-structs-methods.md) — struct 替代 class，struct tags
7. [A06-slices-maps](./A06-slices-maps.md) — 动态集合，理解 slice 内部结构

### B 档：核心概念（第 2 周）

8. [B01-interfaces](./B01-interfaces.md) — 接口：隐式实现、指针接收者规则、nil 陷阱
9. [B02-errors](./B02-errors.md) — error 系统：包装、Is/As、sentinel
10. [B03-goroutines](./B03-goroutines.md) — goroutine + channel 入门
11. [B04-sync-primitives](./B04-sync-primitives.md) — Mutex/RWMutex，并发安全的基础
12. [B05-context-basics](./B05-context-basics.md) — context：超时取消，贯穿所有服务调用
13. [B06-testing-intro](./B06-testing-intro.md) — go test 基础，table-driven 写法

### C 档：工程实践（第 2～3 周）

14. [C01-go-module](./C01-go-module.md) — 独立启动一个真实项目
15. [C02-project-layout](./C02-project-layout.md) — 理解目录结构后读练习项目代码不迷路
16. [C03-net-http](./C03-net-http.md) — Gin 的底层是什么，先看标准库
17. [C04-channel-patterns](./C04-channel-patterns.md) — Pipeline/Fan-out/Fan-in，并发编程的积木
18. [C05-interface-design](./C05-interface-design.md) — 小接口原则、依赖注入

**→ 进入 [Gin 框架](../go-gin/README.md)**

### x 档：面试冲刺（第 3～5 周，可与 Gin 并行）

19. [x01-go-vs-others](./x01-go-vs-others.md) — 建立"Go 和 TypeScript 哪里不一样"的系统认知
20. [x02-go-toolchain](./x02-go-toolchain.md) — pprof、lint、go mod 深度
21. [x04-concurrency-model](./x04-concurrency-model.md) — GMP 模型是面试最高频考点
22. [x06-sync-primitives](./x06-sync-primitives.md) — errgroup、死锁诊断
23. [x07-context-guide](./x07-context-guide.md) — gRPC/跨服务 context 传播
24. [x09-error-handling](./x09-error-handling.md) — 自定义错误类型、panic/recover 边界
25. [x10-generics-practical](./x10-generics-practical.md) — 泛型实战
26. [x11-testing-patterns](./x11-testing-patterns.md) — httptest、mock 策略
27. [x12-interview-qa](./x12-interview-qa.md) — 40+ 高频题冲刺

---

## 练习项目关联表

| 项目目录 | 主要考察点 | 对应文档 |
|---------|-----------|---------|
| `projects/worker-pool/` | goroutine 池、WaitGroup、channel 背压 | B03、C04、x06 |
| `projects/pipeline/` | 多阶段 Pipeline、Fan-out、done channel | B03、C04 |
| `projects/ttl-cache/` | sync.RWMutex、泛型类型参数、过期清理 goroutine | B04、x10 |
| `projects/event-bus/` | 泛型订阅/发布、并发安全、接口设计 | C05、x10 |
| `projects/http-server/` | context deadline、httptest、error middleware | B05、C03、x07、x11 |
| `projects/grpc-gateway/` | context 跨服务传播、deadline 继承 | B05、x07 |
| `projects/rate-limiter/` | atomic、sync.Mutex、令牌桶算法 | B04、x06 |
| `projects/config-loader/` | interface 依赖注入、errors.As、测试 mock | C05、x09、x11 |
