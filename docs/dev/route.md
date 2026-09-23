# 路由系统

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 路由系统简介

Yumeri框架的路由系统提供灵活的路径匹配和处理机制。你可以通过函数式 API 或装饰器 API 来定义路由。

## 注册路由

路由注册将处理逻辑绑定到特定路径：

<div class="functional-api">

```typescript
ctx.route('/user/:id')
    .action((session, params, id) => {
        session.respond('user id: ' + id, 'plain');
    })
```

</div>

<div class="decorator-api">

```typescript
import { Plugin, Get } from '@yumerijs/decorator';

@Plugin
export default class UserController {
  @Get('/user/:id')
  async getUser(session, params, id) {
    session.respond('user id: ' + id, 'plain');
  }
}
```

</div>

## 路由规则

Yumeri 框架的路由规则支持多种参数模式，核心能力不是只支持单一 `:id`，而是会按照路径段进行匹配：

- 路径参数：`/user/:id`
- 可选参数：`/user/:id?`
- 多段参数：`/file/:path+`
- 零到多段参数：`/file/:path*`
- 查询参数：`/user?id=123`
- host 限制：`ctx.route('/demo').host(['api.example.com'])`

### 1）动态参数

```typescript
ctx.route('/user/:id').action(async (session, query, id) => {
  session.respond(`user:${id}`, 'plain')
})
```

### 2）可选参数

```typescript
ctx.route('/user/:id?').action(async (session, query, id) => {
  session.respond(String(id ?? 'none'), 'plain')
})
```

### 3）多段参数

```typescript
ctx.route('/files/:path+').action(async (session, query, path) => {
  session.respond(path, 'plain')
})
```

这里的 `+` 表示“一个或多个路径段”，`*` 表示“零个或多个路径段”。这在 REST-like 路径和资源目录场景中很常见。

### 4）Host 绑定

```typescript
ctx.route('/admin').host(['admin.example.com']).action(async (session) => {
  session.respond('admin portal', 'plain')
})
```

如果你想让同一路径在不同域名/主机上执行不同逻辑，`host()` 是非常实用的能力。

## 路由方法

设置路由支持的 HTTP 方法：

<div class="functional-api">

```typescript
ctx.route('/user/:id')
    .action((session, params, id) => {
        session.respond('user id: ' + id, 'plain');
    })
    .methods('get', 'post')
```

</div>

<div class="decorator-api">

装饰器模式默认根据使用的装饰器（如 `@Get`）自动设置方法：

```typescript
import { Plugin, Get, Post } from '@yumerijs/decorator';

@Plugin
export default class UserController {
  @Get('/user/:id')
  async getUser(session, params, id) {
    session.respond('user id: ' + id, 'plain');
  }

  @Post('/user')
  async createUser(session) {
    session.respond('created', 'plain');
  }
}
```

</div>

## 高级装饰器用法

在装饰器模式中，你可以使用函数动态解析路径或主机名。`@Host` 装饰器的功能等同于函数式 API 中的 `.host()` 方法。

<div class="decorator-api">

```typescript
import { Plugin, Get, Host } from '@yumerijs/decorator';

@Plugin
export default class EchoPlugin {
  constructor(_ctx: Context, private config: any) {}

  @Get((plugin: EchoPlugin) => `/${plugin.config.path}`)
  @Host((plugin: EchoPlugin) => plugin.config.host || undefined)
  async echo(session: Session) {
    session.setMime('text/plain');
    session.respond('Echo content', 'plain');
  }
}
```

</div>

## 路由中间件

中间件允许你在路由处理之前或之后执行逻辑：

### 路由级中间件

<div class="functional-api">

```typescript
ctx.route('/user/:id')
    .use((session, next) => {
        console.log('before action');
        next();
    })
    .action((session, params, id) => {
        session.respond('user id: ' + id, 'plain');
    })
```

</div>

<div class="decorator-api">

使用 `@Use` 装饰器挂载中间件：

```typescript
import { Plugin, Get, Use } from '@yumerijs/decorator';

@Plugin
export default class UserController {
  @Get('/user/:id')
  @Use(async (session, next) => {
    console.log('before action');
    await next();
  })
  async getUser(session, params, id) {
    session.respond('user id: ' + id, 'plain');
  }
}
```

</div>

## WebSocket 路由

Yumeri 也支持在路由上挂接 WebSocket 处理器：

```ts
ctx.route('/ws').wsOn('connection', (ws, req, session) => {
  ws.on('message', (data) => {
    ws.send(`echo: ${data}`)
  })
})
```

这里的 `wsOn()` 适合做实时通信、消息推送、状态同步等场景。

## 真实开发建议

1. 对动态资源路径优先使用 `:param+` / `:param*`。
2. 不要在同一条路由上混用过多逻辑，尽量用中间件拆分。
3. 如果同一路径需要按域名分流，使用 `host()`。
4. 如果需要处理实时连接，使用 `wsOn()` 而不是走普通 HTTP 响应。

## 相关文档

- [中间件](./middleware)
- [事件监听](./event)
- [钩子系统](./hook)
