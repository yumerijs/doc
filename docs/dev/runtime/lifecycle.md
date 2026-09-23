# 生命周期与清理

插件不是只在“启动时能用”，还必须在“卸载时干净结束”。Yumeri 在这点上做了明确的生命周期管理。

## 1. 插件生命周期的核心概念

插件通常经历以下阶段：

1. 加载：框架读取插件模块
2. 解析依赖：确认 `depend` / `optional`
3. 实例化：创建插件上下文和插件对象
4. 执行 `apply()`：注册路由、组件、事件等
5. 运行：插件参与请求处理与扩展逻辑
6. 卸载：删除路由、组件、事件、定时器和副作用

关键点在于第 6 步：卸载不能留下“幽灵资源”。

## 2. `affect()`：注册清理回调

如果插件创建了数据库连接、流、事件监听、定时器等资源，需要把清理逻辑注册到当前 Context：

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context) {
  const client = createClient()
  await client.connect()

  ctx.registerComponent('client', client)
  ctx.affect(async () => {
    await client.close()
  })
}
```

这意味着：

- 插件卸载时，框架会自动执行这些回调
- 不需要手动维护一套全局清理逻辑
- 插件的资源生命周期和插件自身生命周期绑定

## 3. `Context.dispose()` 会统一清理什么

`dispose()` 会清理：

- 路由
- 组件
- 服务
- 中间件
- 事件监听器
- Hook
- i18n 内容
- 子插件
- 子上下文
- 定时器
- `affect()` 注册的回调

这使得插件可以在热更新、禁用、重新加载时安全回收资源。

## 4. 为什么不能只靠 `finally` 处理

很多开发者会在插件入口里写：

```ts
try {
  // 创建资源
} finally {
  // 清理
}
```

这种模式在“插件禁用/热重载/动态卸载”场景下不够稳，因为：

- 插件可能不会走到 `finally`
- 插件可能在运行中被卸载，而不是整个进程退出
- 异步副作用可能仍在后台继续执行

所以 Yumeri 选择在 `Context` 层统一收口，减少资源泄漏风险。

## 5. 定时器和异步副作用的生命周期

`Context` 提供了包装版的 `setTimeout()` / `setInterval()`，它们在插件销毁时会被回收：

```ts
export async function apply(ctx: Context) {
  ctx.setInterval(() => {
    console.log('tick')
  }, 1000)

  ctx.setTimeout(() => {
    console.log('once')
  }, 2000)
}
```

这些方法比原生 timer 更安全，因为：

- 卸载时自动清理
- 已排队但未执行的 callback 会被拦截
- 异常会输出到框架日志，而不是产生未处理异常

## 6. 事件监听也需要生命周期管理

插件监听事件时，`Context` 会记录这些监听器，插件卸载时统一解除：

```ts
export async function apply(ctx: Context) {
  ctx.on('request:start', async (payload) => {
    console.log(payload)
  })
}
```

也就是说，事件监听器不是“全局静态注册”一劳永逸，而是和插件实例同生共死。

## 7. 卸载的最佳实践

1. 所有外部连接都通过 `ctx.affect()` 注册清理逻辑
2. 所有定时器都使用 `ctx.setInterval()` / `ctx.setTimeout()`
3. 对事件监听器和 Hook 让框架统一管理
4. 不要在插件中保留长期有效的全局引用

## 8. 进一步阅读

- [Context 运行时入口](./context)
- [组件与依赖注入](./dependency)
- [运行时总览](../runtime)
