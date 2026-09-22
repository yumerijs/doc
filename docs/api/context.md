# Context API

## 概述

Context 是插件与 Core 交互的主入口。它负责管理插件注册的路由、事件、组件、服务、i18n、定时器和卸载清理，是 Yumeri 3.0 之后插件开发中最重要的运行时对象之一。

它的主要职责包括：

- 注册路由与中间件
- 监听事件并发布事件
- 注册组件、服务和资源
- 管理插件生命周期：初始化与 dispose
- 在插件卸载时自动清理定时器和副作用

---

## 类定义

```ts
export class Context {
  public pluginname: string;

  constructor(core: Core, pluginname: string, module?: any, injections?: Record<string, any>);

  inject(name: string, value: any): void;
  affect(callback: () => void | Promise<void>): void;
  route(path: string): Route;
  on(name: string, listener: (...args: any[]) => Promise<void>): void;
  use(name: string, callback: Middleware): void;
  hook(name: string, hookname: string, callback: HookHandler): void;
  executeHook(name: string, ...args: any[]): Promise<any>;
  setStorage(storage: SessionStorageProcessor | Storage<SessionStorageSnapshot>): void;
  getCore(): Core;
  emit(event: string, ...args: any[]): Promise<void>;
  registerComponent(name: string, component: any): void;
  registerService(name: string, service: new (context: Context) => Service): void;
  setInterval(callback: (...args: any[]) => any, ms?: number, ...args: any[]): NodeJS.Timeout | undefined;
  setTimeout(callback: (...args: any[]) => any, ms?: number, ...args: any[]): NodeJS.Timeout | undefined;
  clearInterval(timer?: NodeJS.Timeout | number | null): void;
  clearTimeout(timer?: NodeJS.Timeout | number | null): void;
  fork(name?: string, path?: string): Context;
  plugin(module: Plugin, config?: any): Promise<Context>;
  i18n(content: string | Record<string, any>, locale?: Record<string, string>): void;
  dispose(): Promise<void>;
}
```

---

## 常用方法

### inject(name: string, value: any): void

向当前 Context 注入动态依赖，通常用于把服务对象、配置对象或工具实例挂到 `ctx.component` 上。

```ts
ctx.inject('db', databaseClient)
```

---

### affect(callback): void

注册插件销毁时执行的清理回调。适合释放资源、关闭连接和清理缓存等工作。

```ts
ctx.affect(async () => {
  await client.close()
})
```

在插件卸载时，Yumeri 会统一执行这些回调，避免资源泄漏。

---

### setInterval / setTimeout

3.0 之后，Context 提供了包装版的定时器，特点是：

- 会在插件卸载时自动清理
- 已排队但未执行的回调会被拦截
- 同步异常和 async rejection 会被记录到日志

```ts
const timer = ctx.setInterval(() => {
  console.log('tick')
}, 1000)

ctx.setTimeout(() => {
  console.log('once')
}, 2000)
```

也可以直接使用 `ctx.clearTimeout(...)` / `ctx.clearInterval(...)` 取消。

---

### route(path: string): Route

注册或获取路由。它会在插件内部维护 `this.routes`，并在卸载时统一移除。

```ts
ctx.route('/hello')
  .action(async (session) => {
    session.respond('Hello, World!', 'plain')
  })
```

---

### on / emit

注册事件监听器，并通过 Core 统一分发。

```ts
ctx.on('config-changed', async (newConfig) => {
  console.log('配置更新：', newConfig)
})

await ctx.emit('config-changed', { mode: 'debug' })
```

---

### registerComponent / registerService

用于注册插件提供的组件与服务。

```ts
ctx.registerComponent('db', databaseClient)
ctx.registerService('userService', UserService)
```

`registerComponent()` 注册已经创建好的共享实例；`registerService()` 注册服务类。服务不会在注册处提前创建，而是在依赖它的插件中以该插件的 `Context` 实例化，因此服务构造函数可以接收到调用方上下文。

#### Service 与 component 的区别

- `component`：更偏“对象/工具/实例集合”，适合注入数据库、日志器、缓存客户端等。
- `Service`：更偏“可复用的类”，通常用于封装业务逻辑和状态管理。

```ts
class UserService extends Service {
  constructor(private readonly ctx: Context) {
    super(ctx)
  }

  async getUser(id: string) {
    return { id }
  }
}

ctx.registerService('userService', UserService)
```

随后其他插件可以通过 `ctx.component.userService` 或强约束方式按依赖注入使用。

---

### inject(name: string, value: any)

`inject()` 是一个更直接的依赖注入入口，用于把对象挂到当前 Context 的组件容器里：

```ts
ctx.inject('db', databaseClient)
ctx.inject('logger', logger)
```

随后可通过 `ctx.component.db` / `ctx.component.logger` 读取。它的用途与 `registerComponent()` 相似，但更适合运行时动态注入。

---

### i18n(content, locale)

注册多语言文案，内容可以是单个键值对或嵌套对象。

```ts
ctx.i18n({
  app: {
    title: { zh: '示例应用', en: 'Sample App' }
  }
})
```

配合 `Schema.key()` 使用时，可以让配置项说明文字与当前语言环境同步。

---

### fork / plugin

创建子上下文或直接加载子插件。适合大型插件拆分或插件组合场景。

```ts
const child = ctx.fork('demo-child')
await ctx.plugin(otherPlugin, { enabled: true })
```

#### 典型用途

- `fork()`：在一个插件内部创建独立子上下文，用于拆分模块或嵌套子插件。
- `plugin()`：直接把另外一个插件模块加载到当前上下文中，适合组合式插件场景。

---

### dispose()

插件被卸载时，Context 会自动：

- 停止所有定时器
- 删除组件与服务注册
- 删除路由与事件监听
- 删除 hook 与 i18n
- 执行 `affect()` 里注册的清理回调

这是 3.0 之后更稳健的插件生命周期保证。

`Context.on()` 注册的事件监听器也会在销毁时从 Core 移除。服务或组件如果创建了框架无法自动识别的连接、流等资源，应使用 `ctx.affect()` 注册对应清理逻辑。

---

## 最佳实践

### 1. 使用 affect 释放资源

```ts
ctx.affect(async () => {
  await db.close()
})
```

### 2. 通过 Context 管理异步副作用

不要直接在插件外部持有全局定时器，统一走 `ctx.setTimeout()` / `ctx.setInterval()`。

### 3. 优先使用 Context，而非直接拿 Core

```ts
// 不推荐
const core = ctx.getCore()

// 更推荐
ctx.route('/demo').action(async (session) => {
  session.respond('ok', 'plain')
})
```

---

## 相关文档

- [Route API](./route)
- [配置构型](../dev/config)
- [插件基础](../dev/plugin)

---

## 组件依赖管理

如果插件依赖其他插件提供的组件，应在元数据中声明依赖关系：

```ts
export const depend = ['database', 'logger']
export const provide = ['my-service']

export async function apply(ctx: Context, config: Config) {
  const db = ctx.component.database
  const logger = ctx.component.logger

  const myService = createMyService(db, logger)
  ctx.registerComponent('my-service', myService)
}
```

这类模式适合需要跨插件共享对象、客户端、缓存连接或服务能力的场景。