# Context API

## 概述

Context（上下文）是 Yumerijs 框架中插件与核心交互的推荐接口。  
每个插件在初始化时都会收到一个 Context 实例，通过它可以安全地访问框架功能，而无需直接操作 Core 实例。

使用 Context 而非直接使用 Core 的好处：
- 提供了更安全的访问控制
- 自动处理插件间的命令、路由和组件冲突
- 记录插件与框架交互的关系，便于调试和管理
- 简化插件开发流程

---

## 类定义

```typescript
export class Context {
    private core: Core;
    public pluginname: string;

    constructor(core: Core, pluginname: string);

    /** @deprecated Use route() instead. */
    command(name: string): Command;

    route(path: string): Route;
    on(name: string, listener: (...args: any[]) => Promise<void>): void;
    use(name: string, callback: Function): void;
    getCore(): Core;
    async emit(event: string, ...args: any[]): Promise<void>;
    getComponent(name: string): any;
    registerComponent(name: string, component: any): void;
```

---

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| pluginname | string | 当前插件的名称 |

---

## 方法

### command(name: string): Command

**说明**：已废弃，推荐使用 `route()` 或 Context 提供的路由/组件方法。  
尝试注册已存在的命令会发出警告，并返回已存在的命令对象。

**参数：**
- `name: string` - 命令名称

**返回值：**
- `Command` - 命令对象实例

**示例：**
```typescript
ctx.command('sayHello'); // 不推荐使用
```

---

### route(path: string): Route

注册或获取路由。若路由已存在，会发出警告并返回已存在的路由实例。

**参数：**
- `path: string` - 路由路径

**返回值：**
- `Route` - 路由对象实例

**示例：**
```typescript
ctx.route('/hello')
  .action(async (session, _) => {
    session.body = 'Hello, World!';
  });
```

---

### on(name: string, listener: `(...args: any[]) => Promise<void>`): void

注册事件监听器，支持同一事件由多个插件监听。

**参数：**
- `name: string` - 事件名称
- `listener: (...args: any[]) => Promise<void>` - 事件处理函数

**示例：**
```typescript
ctx.on('config-changed', async (newConfig) => {
  console.log('配置已更新:', newConfig);
});
```

---

### use(name: string, callback: Function): void

注册全局中间件，并记录该插件提供中间件的来源。

**参数：**
- `name: string` - 中间件名称
- `callback: Function` - 中间件函数

**示例：**
```typescript
ctx.use('logger', async (session, next) => {
  console.log(`请求开始: ${session.path}`);
  await next();
  console.log(`请求结束: ${session.path}`);
});
```

---

### getCore(): Core

获取 Core 实例。除非必要，否则应尽量避免直接使用 Core。

**返回值：**
- `Core` - 框架核心实例

**示例：**
```typescript
const core = ctx.getCore();
```

---

### async emit(event: string, ...args: any[]): `Promise<void>`

触发事件，由 Core 负责执行对应的监听器。

**参数：**
- `event: string` - 事件名称
- `...args: any[]` - 事件参数

**示例：**
```typescript
await ctx.emit('my-plugin-ready', { version: '1.0.0' });
```

---

### getComponent(name: string): any

获取已注册组件实例。

**参数：**
- `name: string` - 组件名称

**返回值：**
- `any` - 组件实例

**示例：**
```typescript
const db = ctx.getComponent('database');
if (db) await db.connect();
```

---

### registerComponent(name: string, component: any): void

注册组件实例，若组件已存在会发出警告并忽略注册。

**参数：**
- `name: string` - 组件名称
- `component: any` - 组件实例

**示例：**
```typescript
ctx.registerComponent('my-service', {
  getData: async () => ({ message: 'Hello from my service' })
});
```

---

### fork(name: string): Context

注册子 Context 并返回

**参数：**
- `name: string` - 子 Context 的插件名称

---

## 最佳实践

### 插件开发推荐模式

```typescript
import { Context, Config } from 'yumerijs';

export const schema = {
  apiKey: ConfigSchema.string({ description: 'API密钥', required: true }),
  timeout: ConfigSchema.number({ description: '超时时间(毫秒)', default: 3000 })
};

export async function apply(ctx: Context, config: Config) {
  ctx.route('/my-route').action(async (session, params) => {
    // 处理路由
  });

  ctx.registerComponent('my-component', {
    // 组件实现
  });

  ctx.on('some-event', async (...args) => {
    // 事件处理
  });
}

export async function disable(ctx: Context) {
  // 清理资源
}
```

---

### 避免直接使用 Core

**不推荐**：
```typescript
const core = ctx.getCore();
core.route('/my-route').action(async (session, params) => { ... });
```

**推荐**：
```typescript
ctx.route('/my-route').action(async (session, params) => { ... });
```

---

### 组件依赖管理

如果插件依赖其他插件提供的组件，应在元数据中声明依赖关系：

```typescript
export const depend = ['database', 'logger'];
export const provide = ['my-service'];

export async function apply(ctx: Context, config: Config) {
  const db = ctx.getComponent('database');
  const logger = ctx.getComponent('logger');

  const myService = createMyService(db, logger);

  ctx.registerComponent('my-service', myService);
}
```