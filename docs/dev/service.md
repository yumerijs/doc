# 服务提供

服务提供用于向插件提供可复用的行为能力。它解决的是“业务逻辑如何绑定到调用方上下文并参与插件生命周期”的问题。

组件提供的是共享实例，服务提供的是带行为的能力实例。服务尤其适合用户逻辑、权限校验、消息处理、订单处理和文件操作等业务能力。

## 注册服务

服务是一个继承自 `Service` 的类，通过 `registerService()` 注册：

```ts
import { Context, Service } from 'yumeri'

class UserService extends Service {
  async getUser(id: string) {
    return { id, name: 'demo-user' }
  }
}

export async function apply(ctx: Context) {
  ctx.registerService('userService', UserService)
}
```

服务类描述如何提供能力，而不是由提供方提前创建一个共享实例。Yumeri 会在服务被依赖的插件中创建服务实例。

## 构造函数接收调用方 Context

服务的构造函数签名是：

```ts
new (context: Context) => Service
```

因此，服务实例化时会接收到调用它的插件上下文，而不是注册服务的那个上下文。服务可以通过这个 `Context` 获取调用方的组件、插件名和生命周期：

```ts
import { Context, Service } from 'yumeri'

class UserService extends Service {
  constructor(private readonly ctx: Context) {
    super(ctx)
  }

  async getCurrentPluginUser() {
    const logger = this.ctx.component.logger
    logger.info(`called by ${this.ctx.pluginname}`)
    return { plugin: this.ctx.pluginname }
  }
}

export async function apply(ctx: Context) {
  ctx.registerService('userService', UserService)
}
```

这让同一个服务定义可以被不同插件使用，并且每个调用方都得到绑定到自身上下文的服务实例。

## 消费服务

服务会被注入到消费方上下文的组件集合中：

```ts
export const depend = ['userService']

export async function apply(ctx: Context) {
  const userService = ctx.component.userService
  const user = await userService.getUser('123')
  console.log(user)
}
```

服务的核心价值在于封装行为，而不是把任意对象都放进 `component`。

## 用 `ctx.affect()` 消除副作用

服务可以在构造函数中组合定时器、事件监听、连接等副作用，但必须把对应的清理操作注册到调用方的 `Context`。这样插件卸载时，服务留下的副作用也会被清除。

下面的服务在构造时创建定时器，并通过 `ctx.affect()` 注册清理逻辑：

```ts
import { Context, Service } from 'yumeri'

class RepeaterService extends Service {
  private readonly timer: NodeJS.Timeout

  constructor(ctx: Context) {
    super(ctx)

    this.timer = ctx.setInterval(() => {
      console.log(`tick from ${ctx.pluginname}`)
    }, 1000)!

    ctx.affect(() => {
      clearInterval(this.timer)
    })
  }

  start() {
    console.log('repeat service started')
  }
}

export async function apply(ctx: Context) {
  ctx.registerService('repeater', RepeaterService)
}
```

这里的生命周期关系是：

1. 消费方访问服务时，Yumeri 用消费方 `Context` 创建服务
2. 服务构造函数通过 `ctx` 创建副作用
3. 服务把清理回调注册到同一个 `ctx.affect()`
4. 消费方插件销毁时，定时器随上下文一起清理

事件监听、流、连接等资源也遵循同样模式：

```ts
class MessageService extends Service {
  constructor(ctx: Context) {
    super(ctx)

    const listener = async (payload: unknown) => {
      console.log('receive payload', payload)
    }

    ctx.on('message', listener)
  }
}
```

`Context.on()` 注册的监听器会由 `Context.dispose()` 统一移除；如果服务还创建了 Context 不会自动管理的资源，再用 `ctx.affect()` 注册额外清理逻辑。

## 服务与组件的分工

| 类型 | 主要价值 | 典型内容 |
| --- | --- | --- |
| 组件 | 提供共享资源和对象实例 | 数据库、缓存、日志器、客户端 |
| 服务 | 提供带上下文的业务行为 | 用户、权限、消息、订单、文件能力 |

简单判断：已经创建好的资源放进组件；需要方法、调用方上下文或生命周期清理的能力，注册为服务。

## 依赖声明

服务消费方应该声明所依赖的服务：

```ts
export const depend = ['userService', 'logger']
export const optional = ['cache']
```

- `depend` 表示服务必须存在
- `optional` 表示服务存在时才注入

## 最佳实践

- 用服务封装业务行为，不要把复杂业务逻辑散落在插件入口
- 在构造函数中使用调用方 `Context`，不要依赖全局状态
- 服务创建的每个副作用都通过 `ctx.affect()` 注册清理
- 让服务只依赖它真正需要的组件，并在插件中声明依赖

## 相关文档

- [组件提供](./component)
- [插件基础](./plugin)
- [Context API](../api/context)
