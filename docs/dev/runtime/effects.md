# 定时器、事件与副作用管理

插件中的副作用是最容易留下隐患的部分。Yumeri 把这些能力收口进 `Context`，以保证插件生命周期可控。

## 1. 为什么副作用必须被管理

副作用通常包括：

- 定时器
- 事件监听器
- WebSocket 连接
- 流对象
- 数据库连接
- 订阅和轮询任务

它们都不是“纯函数”，而是和运行环境绑定的状态。只要插件被卸载后不清理，就可能造成：

- 内存泄漏
- 重复事件触发
- 进程卡住
- 定时器继续跑

## 2. `Context.setInterval()` / `setTimeout()`

Yumeri 提供了包装对象，用以避免插件卸载后产生“幽灵定时器”：

```ts
export async function apply(ctx: Context) {
  ctx.setInterval(() => {
    console.log('heartbeat')
  }, 5000)

  ctx.setTimeout(() => {
    console.log('once')
  }, 1000)
}
```

这些定时器带来的优势：

- 自动跟随插件销毁而清理
- 未执行的回调会在卸载时被拦截
- 异常会被记录在框架日志中，而不是直接导致崩溃

## 3. `ctx.on()` 监听事件

事件监听本身也属于副作用，也应由插件上下文管理：

```ts
export async function apply(ctx: Context) {
  ctx.on('custom:event', async (payload) => {
    console.log('receive payload', payload)
  })
}
```

插件卸载时，Yumeri 会自动从 `Core` 中移除这些监听器，避免“插件已经卸载，但事件仍在监听”的问题。

## 4. Hook 与事件的区别

- `Event`：更偏“广播式通知”
- `Hook`：更偏“扩展点上的回调组合”

例如：

- `request:start` 是事件
- `console.home` 是 Hook 扩展点

事件更像通知总线，而 Hook 更像插件接口扩展。

## 5. 副作用清理的最佳实践

```ts
export async function apply(ctx: Context) {
  const stream = createStream()

  ctx.affect(async () => {
    stream.destroy()
  })

  ctx.on('request:end', async () => {
    console.log('request ended')
  })
}
```

这类代码的关键思想是：

- 创建副作用时就注册回收逻辑
- 不依赖全局状态回收
- 清理逻辑和插件实例绑定

## 6. 进一步阅读

- [Context 运行时入口](./context)
- [生命周期与清理](./lifecycle)
- [运行时总览](../runtime)
