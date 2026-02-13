# Core API

## 概述

Core 是 Yumerijs 框架的核心类，负责组件管理、事件分发、路由处理和中间件执行等核心功能。**插件管理、配置加载与热重载等能力已迁移到 `PluginLoader`**。插件开发中，**推荐通过 `Context` 间接使用 Core**，避免直接操作 Core 实例。

## CoreOptions

```ts
export interface CoreOptions {
  port: number;
  host: string;
  staticDir: string;
  enableCors: boolean;
  enableWs: boolean;
  lang: string[];
}
```

Core 默认配置（`coreConfigSchema`）：

- `port`: `14510`
- `host`: `0.0.0.0`
- `staticDir`: `public`
- `enableCors`: `false`
- `enableWs`: `false`
- `lang`: `['zh', 'en']`

## 类定义

```typescript
export class Core {
  public emitter: EventEmitter;
  public components: { [name: string]: any };
  public routes: Record<string, Route>;
  public logger: Logger;
  public globalMiddlewares: Record<string, Middleware>;
  public hooks: Record<string, Hook>;
  public coreConfig: CoreOptions;
  public server: CoreServer;
  public i18n: I18n;
  public loader: any; // PluginLoader 实例
  public renderers: Map<string, IRenderer>;
  public pluginRenderers: Map<string, string>;

  constructor(loader?: any, coreConfig?: CoreOptions, setCore = true);

  addRenderer(renderer: IRenderer): void;
  getRendererForPlugin(pluginName: string): string | undefined;
  runCore(): Promise<void>;
  getShortPluginName(pluginName: string): string;
  plugin(pluginInstance: Plugin, context: Context, config: Config): Promise<void>;
  registerComponent(name: string, component: any): void;
  getComponent(name: string): any;
  unregisterComponent(name: string): void;
  on(event: string, listener: (...args: any[]) => Promise<void>): void;
  off(event: string, listener: (...args: any[]) => Promise<void>): void;
  emit(event: string, ...payload: any[]): void;
  use(name: string, middleware: Middleware): Core;
  route(path: string, context: Context): Route;
  hook(name: string, hookname: string, callback: HookHandler): any;
  unhook(name: string, hookname: string): any;
  hookExecute(name: string, ...args: any[]): Promise<any[]>;
  executeRoute(pathname: string, session: Session, queryParams: URLSearchParams): Promise<boolean>;
  getRoute(path: string): Route | false;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| emitter | `EventEmitter` | 内部事件总线 |
| components | `{ [name: string]: any }` | 已注册的组件集合 |
| routes | `Record<string, Route>` | 已注册的路由集合 |
| logger | `Logger` | 核心日志记录器 |
| globalMiddlewares | `Record<string, Middleware>` | 全局中间件集合 |
| hooks | `Record<string, Hook>` | 钩子（Hook）集合 |
| coreConfig | `CoreOptions` | 核心配置对象 |
| server | `CoreServer` | 核心 HTTP/WebSocket 服务器实例 |
| i18n | `I18n` | 国际化实例 |
| loader | `any` | PluginLoader 实例 |
| renderers | `Map<string, IRenderer>` | 已注册渲染器 |
| pluginRenderers | `Map<string, string>` | 插件与渲染器映射 |

## 方法

### async runCore(): `Promise<void>`

启动核心服务器（HTTP/WebSocket）。

**示例：**
```typescript
await core.runCore();
```

### public getShortPluginName(pluginName: string): `string`

获取插件的短名称，用于日志输出等。

**参数：**
- `pluginName: string` - 插件完整名称

**返回值：**
- `string` - 插件短名称

### public async plugin(pluginInstance: Plugin, context: Context, config: Config): `Promise<void>`

执行插件的 `apply` 方法，加载插件功能。此方法由 `PluginLoader` 调用。

**参数：**
- `pluginInstance: Plugin` - 插件实例
- `context: Context` - 插件上下文
- `config: Config` - 插件配置

### registerComponent(name: string, component: any): void

注册一个组件。

**参数：**
- `name: string` - 组件名称
- `component: any` - 组件实例

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.registerComponent 而非直接调用此方法
core.registerComponent('database', new Database());
```

### getComponent(name: string): any

获取一个已注册的组件。

**参数：**
- `name: string` - 组件名称

**返回值：**
- `any` - 组件实例

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.getComponent 而非直接调用此方法
const db = core.getComponent('database');
```

### unregisterComponent(name: string): void

取消注册一个组件。

**参数：**
- `name: string` - 组件名称

**示例：**
```typescript
core.unregisterComponent('database');
```

### on(event: string, listener: `(...args: any[]) => Promise<void>`): void

注册一个事件监听器。

**参数：**
- `event: string` - 事件名称
- `listener: (...args: any[]) => Promise<void>` - 事件处理函数

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.on 而非直接调用此方法
core.on('plugin-loaded', async (pluginName) => {
  console.log(`插件 ${pluginName} 已加载`);
});
```

### async emit(event: string, ...args: any[]): `Promise<void>`

触发一个事件。

**参数：**
- `event: string` - 事件名称
- `...args: any[]` - 事件参数

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.emit 而非直接调用此方法
await core.emit('custom-event', { data: 'value' });
```

### use(name: string, middleware: Middleware): Core

注册一个全局中间件。

**参数：**
- `name: string` - 中间件名称
- `middleware: Middleware` - 中间件函数

**返回值：**
- `Core` - Core 实例，支持链式调用

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.use 而非直接调用此方法
core.use('logger', async (session, next) => {
  console.log(`请求开始: ${session.path}`);
  await next();
  console.log(`请求结束: ${session.path}`);
});
```

### route(path: string, context: Context): Route

创建一个路由。

**参数：**
- `path: string` - 路由路径
- `context: Context` - 所属插件上下文

**返回值：**
- `Route` - 路由对象

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.route 而非直接调用此方法
core.route('/hello', context)
  .action(async (session, _) => {
    session.body = 'Hello, World!';
    session.setMime('text');
  });
```

### addRenderer(renderer: IRenderer): void

注册一个渲染器。若同名渲染器已存在会被覆盖。

### getRendererForPlugin(pluginName: string): `string | undefined`

获取插件配置的渲染器名称。

### hook(name: string, hookname: string, callback: HookHandler): any

注册一个钩子（Hook）处理函数。

**参数：**
- `name: string` - 钩子名称
- `hookname: string` - 钩子处理函数名称
- `callback: HookHandler` - 钩子处理函数

### unhook(name: string, hookname: string): any

取消注册一个钩子处理函数。

**参数：**
- `name: string` - 钩子名称
- `hookname: string` - 钩子处理函数名称

### async hookExecute(name: string, ...args: any[]): `Promise<any[]>`

执行一个钩子，并收集所有处理函数的返回值。

**参数：**
- `name: string` - 钩子名称
- `...args: any[]` - 传递给钩子处理函数的参数

**返回值：**
- `Promise<any[]>` - 所有钩子处理函数的返回值数组

### async executeRoute(pathname: string, session: Session, queryParams: URLSearchParams): `Promise<boolean>`

执行指定路由。

**参数：**
- `pathname: string` - 匹配路径
- `session: any` - 会话对象
- `queryParams: URLSearchParams` - 查询参数

**返回值：**
- `Promise<boolean>` - 是否匹配成功

**示例：**
```typescript
const session = new Session('127.0.0.1', {}, platform);
await core.executeRoute('hello', session);
```

### getRoute(path: string): Route | false

获取匹配指定路径的路由对象。

**参数：**
- `path: string` - 路径

**返回值：**
- `Route | false` - 匹配的路由对象或 `false`

## 内置事件（Core 侧）

Core 会在请求生命周期与日志输出时触发以下事件：

| 事件名称 | 触发时机 | 参数 |
|---------|---------|------|
| `request:start` | 请求开始 | `{ path, route, method, plugin, start, sessionId }` |
| `middleware:end` | 单个中间件结束 | `{ name, path, plugin, duration, sessionId }` |
| `route:end` | 路由处理结束 | `{ path, route, plugin, duration, sessionId, status }` |
| `request:end` | 请求结束 | `{ path, route, method, plugin, duration, status, sessionId }` |
| `request:error` | 请求处理异常 | `{ path, route, plugin, error, sessionId }` |
| `log` | Logger 写入 | `{ level, message, timestamp }` |

## Loader 触发的事件

以下事件由 `PluginLoader` 通过 Core 的事件系统触发：

| 事件名称 | 触发时机 | 参数 |
|---------|---------|------|
| `plugin-unloaded` | 插件卸载完成 | `pluginName: string` |
| `plugin-reloaded` | 插件重新加载完成 | `pluginName: string` |
| `config-reloaded` | 配置文件重新加载 | `newConfig: any` |

## 最佳实践

### 插件开发中避免直接使用 Core

在插件开发中，应尽量通过 Context 对象间接使用 Core 的功能，而不是直接操作 Core 实例。这样可以确保插件行为被正确跟踪，并避免潜在的冲突。

```typescript
// 不推荐
export async function apply(ctx: Context, config: Config) {
  const core = ctx.getCore();
  core.route('/my-route').action(async (session, _) => {
    // ...
  });
}

// 推荐
export async function apply(ctx: Context, config: Config) {
  ctx.route('/my-route').action(async (session, _) => {
    // ...
  });
}
```
