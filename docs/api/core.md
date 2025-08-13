# Core API

## 概述

Core 是 Yumerijs 框架的核心类，负责插件管理、事件分发、指令处理和中间件执行等核心功能。虽然 Core 提供了丰富的 API，但在插件开发中，**推荐通过 Context 对象间接使用这些功能**，而不是直接操作 Core 实例。

## 类定义

```typescript
export class Core {
  public plugins: { [name: string]: Plugin & { depend?: string[]; provide?: string[] } };
  public config: any;
  public platforms: Platform[];
  private eventListeners: { [event: string]: ((...args: any[]) => Promise<void>)[] };
  public components: { [name: string]: any };
  public commands: Record<string, Command>;
  public routes: Record<string, Route>;
  public pluginLoader: PluginLoader;
  public logger: Logger;
  public providedComponents: { [name: string]: string };
  private pluginModules: { [name: string]: any };
  private configPath: string;
  private globalMiddlewares: Record<string, Middleware>;
  /**
   * @deprecated 命令与插件对应关系
   */
  public cmdtoplu: Record<string, string>;
  /**
   * 路由与插件对应关系
   */
  public routetoplu: Record<string, string>;
  /**
   * 组件与插件对应关系
   */
  public comtoplu: Record<string, string>;
  /**
   * 事件监听器与插件对应关系
   */
  public evttoplu: Record<string, Record<string, ((...args: any[]) => Promise<void>)[]>>;
  /**
   * 中间件与插件对应关系
   */
  public mdwtoplu: Record<string, string>;
  public plftoplu: Record<string, string>;
  /**
   * 插件状态
   */
  public pluginStatus: Record<string, PluginStatus>;
  /**
   * 插件监听器
   */
  private pluginWatchers: Record<string, chokidar.FSWatcher>;

  constructor(pluginLoader: PluginLoader);
  
  async loadConfig(configPath: string): Promise<void>;
  async getPluginConfig(pluginName: string): Promise<Config>;
  async loadPlugins(): Promise<void>;
  watchPlugins(core: Core, pluginsDir?: string): void;
  async reloadPlugin(pluginName: string, core: Core): Promise<void>;
  async unloadPluginAndEmit(pluginName: string, core: Core): Promise<void>;
  registerComponent(name: string, component: any): void;
  getComponent(name: string): any;
  unregisterComponent(name: string): void;
  on(event: string, listener: (...args: any[]) => Promise<void>): void;
  async emit(event: string, ...args: any[]): Promise<void>;
  use(name: string, middleware: Middleware): Core;
  command(name: string): Command;
  async executeCommand(name: string, session: any, ...args: any[]): Promise<Session | null>;
  registerPlatform(platform: Platform): any
  async executeRoute(pathname: string, session: Session, queryParams: URLSearchParams): Promise<boolean>
  unregall(pluginname: string): void
  getRoute(path: string): Route | false
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| plugins | `{ [name: string]: Plugin & { depend?: string[]; provide?: string[] } }` | 已加载的插件集合 |
| config | any | 框架配置对象 |
| platforms | Platform[] | 已注册的平台列表 |
| components | `{ [name: string]: any }` | 已注册的组件集合 |
| routes | `Record<string, Route>` | 已注册的路由集合 |
| logger | Logger | 核心日志记录器 |
| providedComponents | `{ [name: string]: string }` | 组件与提供该组件的插件映射 |
| routetoplu | `Record<string, string>` | 路由与插件的映射关系 |
| comtoplu | `Record<string, string>` | 组件与插件的映射关系 |
| evttoplu | `Record<string, Record<string, ((...args: any[]) => Promise<void>)[]>>` | 事件与插件的映射关系 |
| mdwtoplu | `Record<string, string>` | 中间件与插件的映射关系 |
| plftoplu | `Record<string, string>` | 平台与插件的映射关系 |

## 方法

### async loadConfig(configPath: string): `Promise<void>`

加载框架配置文件。

**参数：**
- `configPath: string` - 配置文件路径

**示例：**
```typescript
await core.loadConfig('./config.yml');
```

### async getPluginConfig(pluginName: string): `Promise<Config>`

获取指定插件的配置。

**参数：**
- `pluginName: string` - 插件名称

**返回值：**
- `Promise<Config>` - 插件配置对象

**示例：**
```typescript
const config = await core.getPluginConfig('my-plugin');
const apiKey = config.get('apiKey');
```

### async loadPlugins(): `Promise<void>`

加载所有配置中启用的插件。

**示例：**
```typescript
await core.loadConfig('./config.yml');
await core.loadPlugins();
```

### watchPlugins(core: Core, pluginsDir?: string): void

监视插件目录变化，实现热重载。

**参数：**
- `core: Core` - Core 实例
- `pluginsDir?: string` - 插件目录，默认为 'plugins'

**示例：**
```typescript
// 在开发环境中启用插件热重载
if (process.env.NODE_ENV === 'development') {
  core.watchPlugins(core);
}
```

### async reloadPlugin(pluginName: string, core: Core): `Promise<void>`

重新加载指定插件。

**参数：**
- `pluginName: string` - 插件名称
- `core: Core` - Core 实例

**示例：**
```typescript
await core.reloadPlugin('my-plugin', core);
```

### async unloadPluginAndEmit(pluginName: string, core: Core): `Promise<void>`

卸载指定插件并触发相关事件。

**参数：**
- `pluginName: string` - 插件名称
- `core: Core` - Core 实例

**示例：**
```typescript
await core.unloadPluginAndEmit('my-plugin', core);
```

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

### route(name: string): Route

创建一个路由。

**参数：**
- `name: string` - 路由名称

**返回值：**
- `Route` - 路由对象

**示例：**
```typescript
// 注意：插件开发中推荐使用 ctx.route 而非直接调用此方法
core.route('/hello')
  .action(async (session, _) => {
    session.body = 'Hello, World!';
    session.setMime('text');
  });
```

### async executeRoute(pathname: string, session: any, queryParams: URLSearchParams): `Promise<boolean>`

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

## 内置事件

Core 提供了以下内置事件：

| 事件名称 | 触发时机 | 参数 |
|---------|---------|------|
| plugin-loaded | 插件加载完成时 | pluginName: string |
| plugin-unloaded | 插件卸载完成时 | pluginName: string |
| plugin-reloaded | 插件重新加载完成时 | pluginName: string |
| config-changed | 配置文件变更时 | newConfig: any |

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

### 框架启动流程

框架的标准启动流程如下：

```typescript
import { Core, PluginLoader } from 'yumerijs';

async function bootstrap() {
  // 创建插件加载器
  const pluginLoader = new PluginLoader();
  
  // 创建 Core 实例
  const core = new Core(pluginLoader);
  
  // 加载配置
  await core.loadConfig('./config.yml');
  
  // 加载插件
  await core.loadPlugins();
  
  console.log('Yumerijs 框架启动完成');
}

bootstrap().catch(console.error);