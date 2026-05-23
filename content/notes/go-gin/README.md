---
slug: go-gin-guide
lang: zh
---

# Gin 框架学习路径

面向已掌握 Go 基础（[docs/go/](../go/README.md) A 阶段）和核心概念（B 阶段）、想用 Gin 构建 HTTP 服务的读者。

## 文档一览

| 文档 | 核心主题 |
|------|----------|
| [01-gin-basics](./01-gin-basics.md) | Engine、路由注册、Handler 签名、路由组、JSON 响应 |
| [02-request-response](./02-request-response.md) | ShouldBindJSON、struct 校验 tag、统一响应格式 |
| [03-middleware](./03-middleware.md) | Logger/Auth/Recovery 中间件、c.Next/Abort、执行顺序 |
| [04-gin-with-context](./04-gin-with-context.md) | *gin.Context vs context.Context、超时传播、Graceful Shutdown |
| [05-testing-gin](./05-testing-gin.md) | httptest 测试 handler 和中间件、table-driven、benchmark |

## 贯穿示例

5 篇文档共用同一个**书库 API**（Books CRUD），逐步添加功能：

```
01 → 路由 + 基础 handler
02 → 请求绑定 + 校验 + 统一响应
03 → 中间件（Logger / RequestID / Auth / Recovery）
04 → context 传递、超时、Graceful Shutdown
05 → 完整测试套件
```

## 推荐阅读顺序

1. [01-gin-basics](./01-gin-basics.md) — 路由和 Handler，跑通第一个 API
2. [02-request-response](./02-request-response.md) — 处理 POST/PUT 请求体
3. [03-middleware](./03-middleware.md) — 添加日志、鉴权
4. [04-gin-with-context](./04-gin-with-context.md) — 与 service 层正确集成
5. [05-testing-gin](./05-testing-gin.md) — 为所有 handler 补测试

---

前置知识：[Go 核心概念 B 阶段](../go/B01-interfaces.md)（接口、error、goroutine）
