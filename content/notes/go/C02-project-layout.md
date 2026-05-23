---
slug: go-project-layout
lang: zh
---

# Go 项目目录结构：cmd/internal/pkg 的职责与边界

> **本文解决什么问题**：消除"目录怎么放"的选择困难，明确 `cmd/`、`internal/`、`pkg/` 的使用场景，以及单仓多服务 vs 多仓的取舍依据。
>
> **前置知识**：[C01-go-module](./C01-go-module.md)（go mod init 的概念）

---

## TypeScript 项目 vs Go 项目结构

TypeScript/Node.js 项目没有强制的目录规范，你可能见过：

```
my-ts-project/
├── src/
│   ├── index.ts       ← 入口
│   ├── routes/        ← 路由
│   ├── services/      ← 业务逻辑
│   └── utils/         ← 工具函数
└── package.json
```

Go 有一套被社区广泛采用的目录惯例，核心是三个目录：

```
my-go-project/
├── cmd/               ← 入口（类比 src/index.ts，但可以有多个）
├── internal/          ← 私有业务代码（类比 src/ 里的大部分内容）
├── pkg/               ← 对外公开的库（类比 npm 发布的包）
└── go.mod
```

关键区别：`internal/` 是 Go **编译器强制**的访问控制——外部模块 import internal 里的代码会直接编译报错，不像 TypeScript 只是靠约定。

---

## 三个核心目录的职责

### cmd/：可执行程序入口

`cmd/` 下的每个子目录对应一个独立的二进制程序，每个子目录只有一个 `main` 包。

```
myservice/
└── cmd/
    ├── server/         # HTTP/gRPC 服务
    │   └── main.go
    ├── worker/         # 后台任务消费者
    │   └── main.go
    └── migrate/        # 数据库迁移工具
        └── main.go
```

`cmd/server/main.go` 应该**极薄**——只负责读配置、组装依赖、启动服务。业务逻辑放在 `internal/`。

```go
// cmd/server/main.go
package main

import (
    "log"
    "github.com/yourorg/myservice/internal/server"
    "github.com/yourorg/myservice/internal/config"
)

func main() {
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("config: %v", err)
    }
    srv := server.New(cfg)
    if err := srv.Run(); err != nil {
        log.Fatalf("server: %v", err)
    }
}
```

### internal/：私有业务代码

`internal/` 是 Go 编译器强制的访问控制机制：**只有同一模块（或 internal 的父目录）的代码才能 import 它**。

```
myservice/
└── internal/
    ├── server/       # HTTP handler、路由注册
    ├── service/      # 业务逻辑层
    ├── repository/   # 数据库访问层
    ├── config/       # 配置结构体和加载
    └── middleware/   # HTTP 中间件
```

尝试从外部 import `internal/` 包会触发编译错误：

```
package external/main: use of internal package
github.com/yourorg/myservice/internal/config not allowed
```

**何时用 internal**：绝大多数业务代码都应该放在 `internal/`。只有你明确打算让其他模块复用的代码，才暴露到 `pkg/`。

### pkg/：对外公开的库代码

`pkg/` 下的包可以被任何外部模块 import。适用场景：

- 通用工具（日志封装、HTTP 客户端基类、tracing helper）
- 跨服务共享的 SDK
- 需要开源的库

```
myservice/
└── pkg/
    ├── httpclient/   # 封装了重试、trace 注入的 HTTP 客户端
    ├── logger/       # 结构化日志封装
    └── validator/    # 通用参数校验
```

**注意**：`pkg/` 不是"什么都往里扔"的垃圾桶。如果某个包只有本项目用，它应该在 `internal/`。

---

## 完整的单仓结构示例

以本套练习项目为参考：

```
projects/
├── go.mod                        # 单一 go.mod，所有服务共享
├── go.sum
├── .tool-versions                # golang 1.23.4
│
├── cmd/
│   ├── worker-pool/main.go
│   ├── pipeline/main.go
│   ├── http-server/main.go
│   └── grpc-gateway/main.go
│
├── internal/
│   ├── workerpool/               # worker-pool 服务的核心逻辑
│   │   ├── pool.go
│   │   └── pool_test.go
│   ├── pipeline/
│   │   ├── stage.go
│   │   └── pipeline_test.go
│   ├── cache/                    # ttl-cache 实现
│   │   ├── cache.go
│   │   └── cache_test.go
│   └── eventbus/
│       ├── bus.go
│       └── bus_test.go
│
└── pkg/
    ├── logger/                   # 所有服务共享的日志封装
    └── testutil/                 # 测试辅助工具
```

---

## 单仓多服务 vs 多仓：选型依据

| 维度 | 单仓（monorepo） | 多仓（polyrepo） |
|------|----------------|----------------|
| 代码共享 | 直接 import，无版本管理负担 | 需要发布版本，用 `go get` 引入 |
| 原子提交 | 跨服务改动一个 PR | 需要多仓 PR 协调 |
| CI 构建 | 全量构建较慢，需要增量构建方案 | 各仓独立，构建快 |
| 版本隔离 | 所有服务共享同一套依赖版本 | 各服务可独立升级依赖 |
| 团队规模 | 适合中小团队（<50 工程师） | 适合大团队，强边界隔离 |
| 适用场景 | 初创公司、平台内部工具集、练习项目 | 独立产品线、合规要求严格 |

### 多仓时的 replace 指令

本地开发跨仓依赖时，`go.mod` 的 `replace` 指令可以临时指向本地路径：

```
// go.mod（开发时）
replace github.com/yourorg/shared-lib => ../shared-lib

// 发布前删除 replace，改为真实版本
require github.com/yourorg/shared-lib v1.2.0
```

---

## 其他常见目录约定

| 目录 | 用途 | 是否强制 |
|------|------|---------|
| `api/` | Protobuf / OpenAPI 定义文件 | 否 |
| `configs/` | 配置文件模板（非代码） | 否 |
| `scripts/` | 构建/部署/迁移脚本 | 否 |
| `test/` | 集成测试、端到端测试数据 | 否 |
| `vendor/` | `go mod vendor` 生成的依赖副本 | 否 |
| `build/` | Dockerfile、CI 配置 | 否 |

单元测试文件（`_test.go`）与被测代码放在**同一目录**，这是 Go 的强约定，不要放到单独的 `test/` 目录。
