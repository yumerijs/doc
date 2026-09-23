# Context 运行时入口

`Context` 是插件在运行时最重要的对象。它既是插件与框架交互的门面，也是插件生命周期的管理器。

## 1. Context 负责什么

每个插件在加载时都会拿到自己的 `Context`，它主要负责：

- 注册路由和中间件
- 注册组件、服务和 i18n 文案
- 监听事件并发出事件
- 创建定时器与副作用
- 绑定子插件与子上下文
- 在插件卸载时清理资源

也就是说，`Context` 不是一个“简单的配置对象”，而是插件运行时的控制中心。

## 2. 基本用法

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context) {
  ctx.route('/demo').action(async (session) => {
    session.respond('hello', 'plain')
  })

  ctx.on('request:start', async ({ path }) => {
    console.log('request start:', path)
  })
}
```

这段代码体现了最典型的插件运行时行为：

- 路由注册：让框架知道如何处理请求
- 事件监听：让插件响应框架事件
- 运行时绑定：插件逻辑挂到当前 Context 上

## 3. Context 与 Core 的关系

插件开发时，绝大多数时候不应该直接拿 `Core` 去做事，而是通过 `Context` 来做：

```ts
export async function apply(ctx: Context) {
  const core = ctx.getCore()
  console.log(core.coreConfig.port)
}
```

这个写法并不是不可以，但它更偏“底层访问”。真正推荐的插件开发方式是：

- 通过 `ctx.route()` 注册入口
- 通过 `ctx.on()` / `ctx.emit()` 做事件
- 通过 `ctx.registerComponent()` / `ctx.registerService()` 暴露能力
- 通过 `ctx.affect()` 绑定清理逻辑

## 4. 为什么 Context 设计得这么关键

Yumeri 的插件是“可插拔、可卸载、可重复加载”的。这个特点要求框架不能只保存路由和代码，还必须跟踪：

- 这个插件创建了哪些组件
- 注册了哪些路由
- 监听了哪些事件
- 开了哪些定时器
- 绑定了哪些 i18n 文案

而这些都统一落在 `Context` 上。这样插件被卸载时，框架可以确保资源被正确清理，而不是残留到全局环境里。

## 5. 典型的插件运行时模式

```ts
export async function apply(ctx: Context) {
  const db = createDbClient()
  await db.connect()

  ctx.registerComponent('db', db)
  ctx.route('/users').action(async (session) => {
    const rows = await db.query('select * from users')
    session.respond(rows, 'json')
  })

  ctx.affect(async () => {
    await db.close()
  })
}
```

这里的生命周期很清楚：

1. 插件启动
2. 创建并注册依赖
3. 暴露路由
4. 卸载时执行清理回调

## 6. 进一步阅读

- [组件与依赖](./dependency)
- [生命周期与清理](./lifecycle)
- [运行时总览](../runtime)
