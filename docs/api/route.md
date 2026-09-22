# Route API

## 概述

`Route` 用于定义和管理 Yumeri 中的路由规则。它基于分段匹配机制，不依赖 fragile 的正则捕获组索引，能够更稳定地处理参数路由、host 过滤和按方法拆分的处理器。

Yumeri 3.0 之后，Route 增强了以下能力：

- 支持 `:param` / `:param?` / `:param+` / `:param*` 四种参数模式
- 支持 `action(method, handler)` 按 HTTP 方法注册多个处理器
- 支持 `host()` 绑定域名或主机模式
- 支持同一路径共享多个方法处理逻辑
- 支持 path 参数和 host 参数同时匹配

---

## 类定义

```ts
export class Route {
  public middlewares: Middleware[];
  public allowedMethods: string[];
  public ws: WebSocketServer | null;

  constructor(public path: string, context: Context);

  action(handler: RouteHandler): this;
  action(method: string | string[], handler: RouteHandler): this;
  use(middleware: Middleware): this;
  host(host: string[] | string): this;
  match(pathname: string, host?: string): {
    params: Record<string, string | undefined>;
    pathParams: string[];
    hostParams: Record<string, string>;
  } | null;
  methods(...methods: string[]): this;
  wsOn(event: string, handler: (...args: any[]) => void): this;
}
```

---

## 常用方法

### action(handler)

设置默认处理器，适合没有明确 HTTP 方法区分的场景。

```ts
ctx.route('/hello').action(async (session) => {
  session.respond('Hello, World!', 'plain')
})
```

### action(method, handler)

按方法分发处理器，适合同一路径支持不同逻辑：

```ts
ctx.route('/api/user')
  .action('GET', async (session) => {
    session.respond('GET /api/user', 'plain')
  })
  .action('POST', async (session) => {
    session.respond('POST /api/user', 'plain')
  })
```

这也是 3.0 中最明显的增强之一：一条路由可以同时绑定不同 HTTP 方法，而不会被上一版简单覆盖。

---

### use(middleware)

为路由挂载中间件：

```ts
route.use(async (session, next) => {
  console.log('请求开始')
  await next()
})
```

---

### methods(...methods)

显式声明允许的 HTTP 方法：

```ts
ctx.route('/api/:id')
  .methods('GET', 'POST')
  .action(async (session) => {
    session.respond('ok', 'plain')
  })
```

---

### host(host)

限定该路由只在指定 host 或 host 规则下生效：

```ts
ctx.route('/admin')
  .host(['api.example.com', 'localhost'])
  .action(async (session) => {
    session.respond('admin', 'plain')
  })
```

这对多租户、网关路由、多域名部署场景非常有帮助。

---

## 路由参数匹配规则

| 模式 | 示例 | 匹配示例 | 描述 |
|------|------|-----------|------|
| `:id` | `/user/:id` | `/user/42` | 必填单段 |
| `:id?` | `/user/:id?` | `/user` 或 `/user/42` | 可选单段 |
| `:path+` | `/file/:path+` | `/file/a/b/c` | 一个或多个段 |
| `:path*` | `/file/:path*` | `/file` 或 `/file/a/b` | 零个或多个段 |

### 例子

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context) {
  ctx.route('/api/:type/:id?')
    .methods('GET')
    .use(async (session, next) => {
      console.log('进入中间件')
      await next()
    })
    .action(async (session, query, type, id) => {
      session.respond(`type=${type}, id=${id}`, 'plain')
    })
}
```

---

## 进阶说明：path + host 匹配

3.0 中的路由匹配不仅关注路径，还能够检查 `host`：

```ts
ctx.route('/api/:name')
  .host('admin.example.com')
  .action(async (session, query, name) => {
    session.respond(name, 'plain')
  })
```

如果 host 不满足规则，则该路由不会命中，即使路径完全一致。

---

## 使用建议

1. 尽量在路由路径中使用清晰的参数命名。
2. 对带方法差异的逻辑使用 `action(method, handler)`。
3. 当一个应用有多域名或网关入口时，优先使用 `host()` 约束路由。
4. 中间件适合做鉴权、日志和统一参数处理，不要把关键业务逻辑塞进中间件。

---

## 相关文档

- [Context API](./context)
- [插件基础](../dev/plugin)
- [开发指南总览](../dev/)

