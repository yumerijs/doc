# 组件与依赖注入

插件之间的协作，核心依赖靠的是“组件”和“依赖声明”，而不是直接访问全局变量。

## 1. 组件是共享实例

组件更适合放“已经创建好的资源对象”，例如：

- 数据库连接
- 日志器
- 缓存客户端
- HTTP 客户端
- 第三方 SDK 实例

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context) {
  const db = createDbClient()
  await db.connect()

  ctx.registerComponent('db', db)
}
```

消费方则通过依赖声明拿到组件：

```ts
export const depend = ['db']

export async function apply(ctx: Context) {
  const db = ctx.component.db
  await db.query('select 1')
}
```

## 2. `inject()` 是动态注入

有些对象不是插件初始化时就存在，而是在运行中才生成，这时可以用 `inject()`。

```ts
export async function apply(ctx: Context) {
  const cache = await createCacheClient()
  ctx.inject('cache', cache)
}
```

它的适用场景包括：

- 初始化顺序不固定
- 延迟创建对象
- 后续才可用的运行时能力

## 3. 组件与服务的区分

组件和服务的区别非常关键：

- 组件：提供“共享对象/实例”，适合资源型依赖
- 服务：提供“带行为的能力”，适合封装业务逻辑

简单规则：

- 已经创建好的对象，注册成组件
- 需要调用方上下文、行为封装、生命周期控制的能力，注册成服务

## 4. 依赖声明不要写成“随便拿”

插件在入口文件中通常声明：

```ts
export const depend = ['db', 'logger']
export const optional = ['cache']
```

含义是：

- `depend`：必须存在，否则插件不能正常加载
- `optional`：若存在则尽量使用，不存在也不阻塞插件启动

这样可以让 Yumeri 在加载时知道：

- 哪些能力是必要的
- 哪些能力可以降级
- 组件准备顺序应该如何安排

## 5. 依赖声明与装饰器的关系

即便你在装饰器模式中使用了 `@Inject`，也建议保留 `depend`：

```ts
export const depend = ['db']
```

原因是：

- `@Inject` 描述“消费方式”
- `depend` 描述“加载顺序与强依赖关系”

两者不是替代关系，而是互补关系。

## 6. 进一步阅读

- [Context 运行时入口](./context)
- [生命周期与清理](./lifecycle)
- [服务提供](../service)
