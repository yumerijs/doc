# Platform API

> 为实现统一性，Platform 功能已在 Yumerijs 框架 1.3.0 版本中移除

## 概述

Platform 是 Yumerijs 框架中的平台抽象基类，它定义了不同运行环境（如 HTTP 服务器、命令行等）的标准接口。各平台实现类需要继承此抽象类并实现所有抽象方法。Platform 类提供了会话管理、消息发送、平台生命周期控制等核心功能。

## 类定义

```typescript
export abstract class Platform {
    protected status: 'idle' | 'starting' | 'running' | 'stopping' | 'error';
    protected errorMessage: string | null;
    protected config: Record<string, any>;
    protected instanceId: string;
    protected eventListeners: Record<string, Array<(...args: any[]) => void>>;

    constructor(config?: Record<string, any>);
    
    protected generateInstanceId(): string;
    
    public abstract sendMessage(session: Session, data: any): any;
    public abstract terminationSession(session: Session, message: any): any;
    public abstract getPlatformName(): string;
    public abstract getPlatformVersionCode(): string;
    public abstract getPlatformId(): string;
    public abstract getPlatformStatus(): Record<string, any>;
    public abstract startPlatform(core?: Core): Promise<any>;
    public abstract stopPlatform(): Promise<void>;
    
    public async restartPlatform(core?: Core): Promise<any>;
    public setConfig(key: string, value: any): void;
    public getConfig<T>(key: string, defaultValue?: T): T;
    public getInstanceId(): string;
    public getStatus(): 'idle' | 'starting' | 'running' | 'stopping' | 'error';
    public getErrorMessage(): string | null;
    public on(event: string, listener: (...args: any[]) => void): void;
    public off(event: string, listener: (...args: any[]) => void): void;
    protected emit(event: string, ...args: any[]): void;
    public createSession(ip: string, cookie: Record<string, string>, query?: Record<string, string>): Session;
    public processSessionData(session: Session, data: any): any;
    public validateSession(session: Session): boolean;
    public getSupportedMimeTypes(): string[];
    public getMetadata(): Record<string, any>;
    public static getConfigSchema(): Record<string, ConfigSchema>;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| status | 'idle' \| 'starting' \| 'running' \| 'stopping' \| 'error' | 平台当前状态（受保护） |
| errorMessage | string \| null | 平台错误信息（受保护） |
| config | `Record<string, any>` | 平台配置（受保护） |
| instanceId | string | 平台实例ID（受保护） |
| eventListeners | `Record<string, Array<(...args: any[]) => void>>` | 平台事件监听器（受保护） |

## 抽象方法（必须实现）

### sendMessage(session: Session, data: any): any

向客户端发送消息。

**参数：**
- `session: Session` - 会话对象
- `data: any` - 要发送的数据

**返回值：**
- 发送结果

### terminationSession(session: Session, message: any): any

结束会话。

**参数：**
- `session: Session` - 会话对象
- `message: any` - 结束消息

**返回值：**
- 结束结果

### getPlatformName(): string

获取平台名称。

**返回值：**
- `string` - 平台名称

### getPlatformVersionCode(): string

获取平台版本号。

**返回值：**
- `string` - 平台版本号

### getPlatformId(): string

获取平台ID。

**返回值：**
- `string` - 平台ID

### getPlatformStatus(): `Record<string, any>`

获取平台状态。

**返回值：**
- `Record<string, any>` - 平台状态对象

### startPlatform(core?: Core): `Promise<any>`

启动平台。

**参数：**
- `core?: Core` - Core实例

**返回值：**
- `Promise<any>` - 启动结果

### stopPlatform(): `Promise<void>`

停止平台。

**返回值：**
- `Promise<void>` - 停止结果

## 实例方法

### async restartPlatform(core?: Core): `Promise<any>`

重启平台。

**参数：**
- `core?: Core` - Core实例

**返回值：**
- `Promise<any>` - 重启结果

**示例：**
```typescript
// 重启平台
await platform.restartPlatform(core);
```

### setConfig(key: string, value: any): void

设置平台配置。

**参数：**
- `key: string` - 配置键
- `value: any` - 配置值

**示例：**
```typescript
// 设置平台配置
platform.setConfig('port', 3000);
platform.setConfig('host', 'localhost');
```

### getConfig`<T>`(key: string, defaultValue?: T): T

获取平台配置。

**参数：**
- `key: string` - 配置键
- `defaultValue?: T` - 默认值

**返回值：**
- `T` - 配置值

**示例：**
```typescript
// 获取平台配置
const port = platform.getConfig<number>('port', 3000);
const host = platform.getConfig<string>('host', 'localhost');
```

### getInstanceId(): string

获取平台实例ID。

**返回值：**
- `string` - 实例ID

**示例：**
```typescript
// 获取平台实例ID
const instanceId = platform.getInstanceId();
console.log(`Platform instance ID: ${instanceId}`);
```

### getStatus(): 'idle' | 'starting' | 'running' | 'stopping' | 'error'

获取当前平台状态。

**返回值：**
- 状态字符串

**示例：**
```typescript
// 获取平台状态
const status = platform.getStatus();
console.log(`Platform status: ${status}`);
```

### getErrorMessage(): string | null

获取错误信息。

**返回值：**
- `string | null` - 错误信息

**示例：**
```typescript
// 获取平台错误信息
const errorMessage = platform.getErrorMessage();
if (errorMessage) {
  console.error(`Platform error: ${errorMessage}`);
}
```

### on(event: string, listener: `(...args: any[]) => void`): void

添加平台事件监听器。

**参数：**
- `event: string` - 事件名称
- `listener: (...args: any[]) => void` - 监听器函数

**示例：**
```typescript
// 添加平台事件监听器
platform.on('started', () => {
  console.log('Platform started');
});

platform.on('error', (error) => {
  console.error('Platform error:', error);
});
```

### off(event: string, listener: `(...args: any[]) => void`): void

移除平台事件监听器。

**参数：**
- `event: string` - 事件名称
- `listener: (...args: any[]) => void` - 监听器函数

**示例：**
```typescript
// 定义监听器函数
const errorHandler = (error) => {
  console.error('Platform error:', error);
};

// 添加监听器
platform.on('error', errorHandler);

// 移除监听器
platform.off('error', errorHandler);
```

### createSession(ip: string, cookie: `Record<string, string>`, query?: `Record<string, string>`): Session

创建会话。

**参数：**
- `ip: string` - 客户端IP
- `cookie: Record<string, string>` - Cookie对象
- `query?: Record<string, string>` - 查询参数

**返回值：**
- `Session` - 会话对象

**示例：**
```typescript
// 创建会话
const session = platform.createSession(
  '127.0.0.1',
  { sessionid: 'abc123' },
  { action: 'login' }
);
```

### processSessionData(session: Session, data: any): any

处理会话数据。

**参数：**
- `session: Session` - 会话对象
- `data: any` - 会话数据

**返回值：**
- 处理结果

**示例：**
```typescript
// 处理会话数据
const processedData = platform.processSessionData(session, rawData);
```

### validateSession(session: Session): boolean

验证会话。

**参数：**
- `session: Session` - 会话对象

**返回值：**
- `boolean` - 验证结果

**示例：**
```typescript
// 验证会话
if (platform.validateSession(session)) {
  // 会话有效，继续处理
} else {
  // 会话无效，拒绝请求
}
```

### getSupportedMimeTypes(): string[]

获取平台支持的MIME类型。

**返回值：**
- `string[]` - MIME类型数组

**示例：**
```typescript
// 获取支持的MIME类型
const mimeTypes = platform.getSupportedMimeTypes();
console.log('Supported MIME types:', mimeTypes);
```

### getMetadata(): `Record<string, any>`

获取平台元数据。

**返回值：**
- `Record<string, any>` - 平台元数据

**示例：**
```typescript
// 获取平台元数据
const metadata = platform.getMetadata();
console.log('Platform metadata:', metadata);
```

## 静态方法

### static getConfigSchema(): `Record<string, ConfigSchema>`

获取平台配置模式。

**返回值：**
- `Record<string, ConfigSchema>` - 配置模式对象

**示例：**
```typescript
// 获取平台配置模式
const schema = MyPlatform.getConfigSchema();
```

## 实现示例

### 创建自定义平台

```typescript
import { Platform, Session, Core, ConfigSchema } from 'yumerijs';

export class HttpPlatform extends Platform {
  private server: any;
  
  constructor(config?: Record<string, any>) {
    super(config);
  }
  
  // 实现抽象方法
  
  public sendMessage(session: Session, data: any): any {
    // 实现向HTTP客户端发送消息的逻辑
    const response = session.properties?.response;
    if (!response) return false;
    
    response.status(session.status);
    
    // 设置响应头
    for (const [key, value] of Object.entries(session.head)) {
      response.setHeader(key, value);
    }
    
    // 设置Cookie
    for (const [key, value] of Object.entries(session.newCookie)) {
      response.cookie(key, value);
    }
    
    // 发送响应体
    response.send(session.body);
    return true;
  }
  
  public terminationSession(session: Session, message: any): any {
    // 实现结束HTTP会话的逻辑
    session.body = message;
    return this.sendMessage(session, message);
  }
  
  public getPlatformName(): string {
    return 'HTTP Platform';
  }
  
  public getPlatformVersionCode(): string {
    return '1.0.0';
  }
  
  public getPlatformId(): string {
    return 'http';
  }
  
  public getPlatformStatus(): Record<string, any> {
    return {
      port: this.getConfig('port', 3000),
      host: this.getConfig('host', 'localhost'),
      connections: this.server ? this.server.connections : 0
    };
  }
  
  public async startPlatform(core?: Core): Promise<any> {
    if (this.status === 'running') {
      return { success: true, message: 'Platform already running' };
    }
    
    this.status = 'starting';
    
    try {
      const express = require('express');
      const app = express();
      const port = this.getConfig('port', 3000);
      const host = this.getConfig('host', 'localhost');
      
      // 配置中间件
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      
      // 处理请求
      app.all('*', async (req, res) => {
        // 创建会话
        const session = this.createSession(
          req.ip,
          req.cookies || {},
          req.query
        );
        
        // 存储请求和响应对象
        session.properties = {
          request: req,
          response: res
        };
        
        // 解析路径
        const path = req.path.substring(1) || 'index';
        
        // 执行命令
        if (core) {
          await core.executeCommand(path, session);
        } else {
          session.status = 500;
          session.body = 'Core not available';
          this.sendMessage(session, session.body);
        }
      });
      
      // 启动服务器
      this.server = app.listen(port, host, () => {
        this.status = 'running';
        this.emit('started', { port, host });
      });
      
      return { success: true, message: `Server started on ${host}:${port}` };
    } catch (error) {
      this.status = 'error';
      this.errorMessage = error.message;
      this.emit('error', error);
      return { success: false, error: error.message };
    }
  }
  
  public async stopPlatform(): Promise<void> {
    if (this.status !== 'running' || !this.server) {
      return;
    }
    
    this.status = 'stopping';
    
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          this.status = 'error';
          this.errorMessage = err.message;
          this.emit('error', err);
          reject(err);
        } else {
          this.status = 'idle';
          this.server = null;
          this.emit('stopped');
          resolve();
        }
      });
    });
  }
  
  // 覆盖静态方法
  
  public static getConfigSchema(): Record<string, ConfigSchema> {
    return {
      port: ConfigSchema.number({
        description: '服务器端口',
        default: 3000
      }),
      host: ConfigSchema.string({
        description: '服务器主机',
        default: 'localhost'
      }),
      cors: ConfigSchema.boolean({
        description: '是否启用CORS',
        default: false
      })
    };
  }
}
```

### 注册和使用平台

```typescript
import { Context, Config } from 'yumerijs';
import { HttpPlatform } from './http-platform';

export async function apply(ctx: Context, config: Config) {
  // 创建平台实例
  const httpPlatform = new HttpPlatform({
    port: config.get('port', 3000),
    host: config.get('host', 'localhost')
  });
  
  // 监听平台事件
  httpPlatform.on('started', (info) => {
    ctx.getCore().logger.info(`HTTP platform started on ${info.host}:${info.port}`);
  });
  
  httpPlatform.on('stopped', () => {
    ctx.getCore().logger.info('HTTP platform stopped');
  });
  
  httpPlatform.on('error', (error) => {
    ctx.getCore().logger.error('HTTP platform error:', error);
  });
  
  // 启动平台
  await httpPlatform.startPlatform(ctx.getCore());
  
  // 注册平台到Core
  ctx.getCore().platforms.push(httpPlatform);
  
  // 注册命令
  ctx.command('hello')
    .action(async (session) => {
      session.body = 'Hello, World!';
      session.setMime('text');
    });
}
```

## 最佳实践

### 平台生命周期管理

确保正确管理平台的生命周期，特别是在插件禁用时停止平台：

```typescript
export async function apply(ctx: Context, config: Config) {
  // 创建平台实例
  const platform = new MyPlatform(config.content);
  
  // 启动平台
  await platform.startPlatform(ctx.getCore());
  
  // 注册平台到Core
  ctx.getCore().platforms.push(platform);
}

export async function disable(ctx: Context) {
  // 在插件禁用时停止平台
  for (const platform of ctx.getCore().platforms) {
    if (platform instanceof MyPlatform) {
      await platform.stopPlatform();
      
      // 从Core中移除平台
      const index = ctx.getCore().platforms.indexOf(platform);
      if (index !== -1) {
        ctx.getCore().platforms.splice(index, 1);
      }
    }
  }
}
```

### 错误处理

在平台实现中妥善处理错误：

```typescript
public async startPlatform(core?: Core): Promise<any> {
  try {
    // 启动逻辑
    this.status = 'running';
    return { success: true };
  } catch (error) {
    this.status = 'error';
    this.errorMessage = error.message;
    this.emit('error', error);
    
    // 记录错误
    if (core) {
      core.logger.error('Platform start error:', error);
    }
    
    return { success: false, error: error.message };
  }
}
```

### 配置验证

使用配置模式验证平台配置：

```typescript
public static getConfigSchema(): Record<string, ConfigSchema> {
  return {
    port: ConfigSchema.number({
      description: '服务器端口',
      default: 3000,
      required: true
    }),
    host: ConfigSchema.string({
      description: '服务器主机',
      default: 'localhost'
    }),
    ssl: ConfigSchema.boolean({
      description: '是否启用SSL',
      default: false
    }),
    maxConnections: ConfigSchema.number({
      description: '最大连接数',
      default: 100
    })
  };
}