---
slug: go-module-basics
lang: zh
---

# Go 模块管理：go mod 实操

> **本文解决什么问题**：从零开始一个 Go 项目需要哪些步骤？依赖怎么加、怎么更新、怎么锁定版本？本文把 `go mod` 的核心操作讲清楚，让你能独立启动一个项目并管理依赖。
>
> **前置知识**：[A00-go-basics](./A00-go-basics.md)（了解 package 概念即可）

---

## 模块是什么

一个**模块**（module）= 一个有 `go.mod` 的目录树，是 Go 的依赖管理单元。TypeScript 项目里 `package.json` 是什么，Go 里 `go.mod` 就是什么。

| TypeScript | Go |
|------------|-----|
| `npm init` | `go mod init` |
| `package.json` | `go.mod` |
| `package-lock.json` | `go.sum` |
| `npm install <pkg>` | `go get <pkg>` |
| `npm install` | `go mod download` |
| `node_modules/` | 模块缓存（`$GOPATH/pkg/mod/`） |

---

## 创建新模块

```bash
mkdir myproject && cd myproject
go mod init github.com/yourname/myproject
```

`go.mod` 内容：

```
module github.com/yourname/myproject

go 1.23
```

**模块路径**（`github.com/yourname/myproject`）：
- 如果打算发布：用真实的仓库 URL，这样别人才能 `go get`
- 内部/练习项目：任意字符串都可以（如 `example.com/myproject`）

---

## 添加依赖

```bash
# 添加最新版本
go get github.com/gin-gonic/gin

# 添加指定版本
go get github.com/gin-gonic/gin@v1.9.1

# 添加最新稳定版（不含 rc/beta）
go get github.com/gin-gonic/gin@latest
```

`go get` 会：
1. 下载包及其依赖
2. 更新 `go.mod`（添加 `require` 条目）
3. 更新 `go.sum`（锁定校验和）

---

## go.mod 文件解读

```
module github.com/yourname/myproject

go 1.23

require (
    github.com/gin-gonic/gin v1.9.1
    golang.org/x/sync v0.6.0
)

require (
    // indirect 表示间接依赖（你的依赖的依赖）
    github.com/bytedance/sonic v1.11.3 // indirect
    github.com/gin-contrib/sse v0.1.0  // indirect
)
```

`go.sum` 记录每个依赖包的哈希值，确保每次构建下载的是同一份代码——不要手动编辑它。

---

## 常用命令

```bash
# 下载 go.mod 里所有依赖（CI 环境或 clone 后首次运行）
go mod download

# 整理：删除没用到的依赖，补全缺失的依赖
go mod tidy

# 查看依赖列表
go list -m all

# 查看某个包的可用版本
go list -m -versions github.com/gin-gonic/gin

# 升级所有依赖到最新兼容版本
go get -u ./...

# 升级指定依赖
go get -u github.com/gin-gonic/gin
```

**养成习惯**：每次修改代码后运行 `go mod tidy`，保持 `go.mod` 干净。

---

## 版本语义

Go 遵循语义化版本（semver）：

```
v1.9.1
│ │ └─ patch：bug 修复，向后兼容
│ └─── minor：新功能，向后兼容
└───── major：破坏性变更
```

**v2+ 的特殊规则**：major 版本 ≥ 2 时，模块路径要加 `/v2` 后缀：

```bash
go get github.com/some/pkg/v2
```

这样 v1 和 v2 可以在同一项目里共存（它们是不同的模块路径）。

---

## replace 指令：本地开发

同时开发两个相互依赖的模块时，用 `replace` 把远程路径重定向到本地：

```
// go.mod（开发时临时使用）
module github.com/yourname/myservice

require github.com/yourname/shared-lib v0.1.0

replace github.com/yourname/shared-lib => ../shared-lib
```

**发布前必须删除** `replace` 指令，否则其他人无法使用你的模块。

---

## vendor 模式

把所有依赖复制到项目的 `vendor/` 目录，CI 构建不需要网络：

```bash
go mod vendor       # 把依赖复制到 vendor/
go build -mod=vendor ./...  # 使用 vendor 目录构建
go test -mod=vendor ./...
```

`vendor/` 通常应该**提交到 git**（确保 CI 离线可用），但 `$GOPATH/pkg/mod/` 不应该提交。

---

## 常见问题

### 依赖下载慢

设置 GOPROXY：

```bash
# 国内镜像（临时）
GOPROXY=https://goproxy.cn,direct go get ...

# 永久设置（写入 shell 配置）
go env -w GOPROXY=https://goproxy.cn,direct
```

### 私有仓库

```bash
# 告诉 Go 哪些路径不走公共代理
go env -w GONOSUMCHECK=github.com/yourcompany/*
go env -w GOFLAGS=-mod=mod
```
