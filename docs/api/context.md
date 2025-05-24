# Context API

## 概述

Context（上下文）是 Yumerijs 框架中插件与核心交互的推荐接口。每个插件在初始化时都会收到一个 Context 实例，通过它可以安全地访问框架功能，而无需直接操作 Core 实例。

使用 Context 而非直接使用 Core 的好处：
- 提供了更安全的访问控制
- 自动处理插件间的命令和组件冲突
- 记录插件与框架交互的关系，便于调试和管理
- 简化插件开发流程

## 类定义

```typescript
export class Context {
    private core: Core;
    public pluginname: string;
    
    constructor(core: Core, pluginname: string);
    
    command(name: string): Command;
    on(name: string, listener: (...args: any[]) => Promise<void>): void;
    use(name: string, callback: Function): void;
    getCore(): Core;
    async emit(event: string, ...args: any[]): Promise<void>;
    getComponent(name: string): any;
    registerComponent(name: string, component: any): void;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| pluginname | string | 当前插件的名称 |

## 方法

### command(name: string): Command

注册或获取一个命令。如果命令已存在，会发出警告并返回一个新的 Command 实例（不会覆盖已有命令）。

**参数：**
- `name: string` - 命令名称

**返回值：**
- `Command` - 命令对象实例

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 注册一个名为 "hello" 的命令
  ctx.command('hello')
    .action(async (session) => {
      session.body = 'Hello, World!';
      session.setMime('text');
    });
}
```

### on(name: string, listener: `(...args: any[]) => Promise<void>`): void

注册一个事件监听器。

**参数：**
- `name: string` - 事件名称
- `listener: (...args: any[]) => Promise<void>` - 事件处理函数

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 监听配置变更事件
  ctx.on('config-changed', async (newConfig) => {
    console.log('配置已更新:', newConfig);
  });
}
```

### use(name: string, callback: Function): void

注册一个中间件。

**参数：**
- `name: string` - 中间件名称
- `callback: Function` - 中间件函数

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 注册一个日志中间件
  ctx.use('logger', async (session, next) => {
    console.log(`请求开始: ${session.path}`);
    await next();
    console.log(`请求结束: ${session.path}`);
  });
}
```

### getCore(): Core

获取 Core 实例。除非必要，不建议直接使用 Core。

**返回值：**
- `Core` - 框架核心实例

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 仅在必要时使用
  const core = ctx.getCore();
  // 执行需要直接访问 Core 的操作
}
```

### async emit(event: string, ...args: any[]): `Promise<void>`

触发一个事件。

**参数：**
- `event: string` - 事件名称
- `...args: any[]` - 事件参数

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 触发自定义事件
  await ctx.emit('my-plugin-ready', { version: '1.0.0' });
}
```

### getComponent(name: string): any

获取一个已注册的组件。

**参数：**
- `name: string` - 组件名称

**返回值：**
- `any` - 组件实例

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 获取数据库组件
  const db = ctx.getComponent('database');
  if (db) {
    await db.connect();
  }
}
```

### registerComponent(name: string, component: any): void

注册一个组件。如果组件已存在，会发出警告并不进行覆盖。

**参数：**
- `name: string` - 组件名称
- `component: any` - 组件实例

**示例：**
```typescript
export async function apply(ctx: Context, config: Config) {
  // 创建并注册一个组件
  const myService = {
    getData: async () => {
      return { message: 'Hello from my service' };
    }
  };
  
  ctx.registerComponent('my-service', myService);
}
```

## 最佳实践

### 插件开发推荐模式

```typescript
import { Context, Config } from 'yumerijs';

// 导出配置模式
export const schema = {
  apiKey: ConfigSchema.string({
    description: 'API密钥',
    required: true
  }),
  timeout: ConfigSchema.number({
    description: '超时时间(毫秒)',
    default: 3000
  })
};

// 插件应用函数
export async function apply(ctx: Context, config: Config) {
  // 注册命令
  ctx.command('my-command')
    .action(async (session) => {
      // 处理命令
    });
  
  // 注册组件
  ctx.registerComponent('my-component', {
    // 组件实现
  });
  
  // 监听事件
  ctx.on('some-event', async (...args) => {
    // 处理事件
  });
}

// 插件禁用函数
export async function disable(ctx: Context) {
  // 清理资源
}
```

### 避免直接使用 Core

除非绝对必要，否则应始终通过 Context 访问框架功能，而不是直接使用 Core。这样可以确保插件行为被正确跟踪，并避免潜在的冲突。

```typescript
// 不推荐
export async function apply(ctx: Context, config: Config) {
  const core = ctx.getCore();
  core.command('my-command').action(async (session) => {
    // ...
  });
}

// 推荐
export async function apply(ctx: Context, config: Config) {
  ctx.command('my-command').action(async (session) => {
    // ...
  });
}
```

### 组件依赖管理

如果你的插件依赖其他插件提供的组件，应在插件元数据中声明依赖关系：

```typescript
export const depend = ['database', 'logger'];
export const provide = ['my-service'];

export async function apply(ctx: Context, config: Config) {
  const db = ctx.getComponent('database');
  const logger = ctx.getComponent('logger');
  
  // 使用依赖组件创建自己的服务
  const myService = createMyService(db, logger);
  
  // 注册自己提供的组件
  ctx.registerComponent('my-service', myService);
}