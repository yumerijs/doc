# 组件提供

组件提供用于向插件提供已经创建好的对象实例。它解决的是“共享资源如何进入插件上下文”的问题，适合数据库连接、日志器、缓存客户端、HTTP 客户端和工具对象等基础设施依赖。

## 组件的价值

组件的重点是共享对象，而不是封装业务行为：

- 把实例收敛到插件边界内
- 避免使用全局变量
- 让运行时依赖可以被明确声明
- 让基础设施对象能够被多个插件直接复用

## 注册组件

提供方在插件中创建实例，然后注册到 `Context`：

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context) {
  const db = createDatabaseClient()
  const logger = createLogger()

  ctx.registerComponent('db', db)
  ctx.registerComponent('logger', logger)
}
```

消费方通过当前插件的 `Context` 访问组件：

```ts
export const depend = ['database']

export async function apply(ctx: Context) {
  const db = ctx.component.db
  const logger = ctx.component.logger

  logger.info('db connected')
  await db.connect()
}
```

组件本身就是实例，因此消费方拿到后可以直接调用它的方法或读取它的属性。

## 动态注入

如果对象是在插件运行过程中才创建，也可以使用 `inject()`：

```ts
ctx.inject('cache', redisClient)
```

这适合：

- 初始化顺序不固定的对象
- 后续阶段才创建的依赖
- 临时挂载的运行时能力

## 组件与生命周期

组件如果创建了连接、定时器、事件监听或其他副作用，也应该把清理逻辑注册到当前上下文：

```ts
export async function apply(ctx: Context) {
  const client = createClient()
  await client.connect()

  ctx.registerComponent('client', client)
  ctx.affect(async () => {
    await client.close()
  })
}
```

`ctx.affect()` 会在上下文销毁时执行回调，使组件的资源和提供它的插件生命周期保持一致。

## 依赖声明

组件提供方和消费方都应该通过插件依赖声明表达关系：

```ts
export const depend = ['database', 'logger']
export const optional = ['cache']
```

- `depend` 表示强依赖，插件加载前必须满足
- `optional` 表示可选依赖，存在时注入，不存在时不阻塞插件启动

## 组件适合什么

组件适合“资源/实例”型依赖：

- 数据库和缓存连接
- 日志器
- 文件系统和 HTTP 客户端
- 已经完成初始化的第三方 SDK
- 无需按调用者重新创建的共享对象

如果要提供一组需要上下文、业务逻辑或独立生命周期的行为，应考虑使用[服务提供](./service)。

## 相关文档

- [服务提供](./service)
- [插件基础](./plugin)
- [Context API](../api/context)
