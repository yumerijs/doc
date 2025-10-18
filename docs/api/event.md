# Event API

## 概述
`Event API` 是 Yumeri 提供的插件事件系统，用于插件之间或插件与核心之间的通信。  
插件可通过 `ctx.emit()` 触发事件，通过 `ctx.on()` 监听事件，实现解耦的交互逻辑。

---

## 方法

### ctx.emit(event: string, ...args: any[]): Promise<void>
触发一个事件。  
该方法会异步调用所有通过 `ctx.on()` 注册的对应事件监听器。

**参数：**

| 参数名 | 类型 | 描述 |
|--------|------|------|
| event | string | 事件名称 |
| ...args | any[] | 事件参数，可传多个 |

**返回值：**

| 类型 | 描述 |
|------|------|
| Promise\<void\> | 异步执行完成后返回 |

**示例：**
```ts
await ctx.emit('myplygin:onload', { version: '1.0.0' }, 'extra-info');
```

---

### ctx.on(event: string, listener: (...args: any[]) => Promise<void>): void
注册事件监听器。  
同一事件可被多个插件监听，触发时会依次调用所有监听器。

**参数：**

| 参数名 | 类型 | 描述 |
|--------|------|------|
| event | string | 事件名称 |
| listener | (...args: any[]) => Promise<void> | 事件处理函数，接收触发时的所有参数 |

**示例：**
```ts
ctx.on('myplugin:onload', async (info, extra) => {
   logger.info('插件已加载:', info, extra);
});
```

---

## 使用示例
```ts
import { Context } from 'yumeri';

export async function apply(ctx: Context) {
  // 注册监听器
  ctx.on('system-start', async (time) => {
    logger.info('系统启动于:', time);
  });

  // 触发事件
  await ctx.emit('system-start', new Date());
}
```

---

## 注意事项
- 所有事件监听器均为异步执行；
- 若监听器抛出异常，后续监听器仍会继续执行；
- 建议非通用事件名使用插件名前缀防止冲突，如 `myplugin:update`；
- `ctx.emit` 不会等待监听器返回值，仅确保异步完成。