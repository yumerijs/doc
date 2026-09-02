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

Yumeri框架的路由规则遵循类 Express 语法，支持多种规则：

- 路径参数：`/user/:id`
- 查询参数：`/user?id=123`
- 可选参数：`/user/:id?`
- 正则表达式支持

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
