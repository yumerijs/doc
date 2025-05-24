# Command API

## 概述

Command 类是 Yumerijs 框架中处理用户指令的核心组件，它定义了指令的处理逻辑和中间件链。在插件开发中，通常通过 Context 对象的 `command` 方法创建和注册指令，而不是直接实例化 Command 类。

## 类定义

```typescript
export class Command {
  name: string;
  actionFn: ActionFn | null;
  core: Core;
  middlewares: Middleware[];

  constructor(core: Core, name: string);
  
  action(fn: ActionFn): this;
  use(middleware: Middleware): this;
  async execute(session: any, ...args: any[]): Promise<Session | null>;
  async executeHandler(session: any, ...args: any[]): Promise<Session | null>;
}

interface ActionFn {
  (session: any, ...args: any[]): Promise<any>;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| name | string | 指令名称 |
| actionFn | ActionFn \| null | 指令处理函数 |
| core | Core | 关联的 Core 实例 |
| middlewares | Middleware[] | 指令特定的中间件列表 |

## 方法

### action(fn: ActionFn): this

设置指令的处理函数。

**参数：**
- `fn: ActionFn` - 指令处理函数，接收 session 和其他参数，返回 Promise

**返回值：**
- `this` - 当前 Command 实例，支持链式调用

**示例：**
```typescript
ctx.command('hello')
  .action(async (session) => {
    session.body = 'Hello, World!';
    session.setMime('text');
  });
```

### use(middleware: Middleware): this

为指令注册特定的中间件。

**参数：**
- `middleware: Middleware` - 中间件函数

**返回值：**
- `this` - 当前 Command 实例，支持链式调用

**示例：**
```typescript
ctx.command('secure')
  .use(async (session, next) => {
    // 权限检查中间件
    if (!session.data.isAuthenticated) {
      session.status = 401;
      session.body = 'Unauthorized';
      session.setMime('text');
      return;
    }
    await next();
  })
  .action(async (session) => {
    session.body = 'Secure content';
    session.setMime('text');
  });
```

### async execute(session: any, ...args: any[]): `Promise<Session | null>`

执行指令，包括中间件链和处理函数。

**参数：**
- `session: any` - 会话对象
- `...args: any[]` - 其他参数

**返回值：**
- `Promise<Session | null>` - 处理后的会话对象，如果没有处理函数则返回 null

**注意：** 通常不需要直接调用此方法，框架会在适当的时候自动调用。

### async executeHandler(session: any, ...args: any[]): `Promise<Session | null>`

仅执行指令处理函数，不包含中间件链。

**参数：**
- `session: any` - 会话对象
- `...args: any[]` - 其他参数

**返回值：**
- `Promise<Session | null>` - 处理后的会话对象，如果没有处理函数则返回 null

**注意：** 通常不需要直接调用此方法，框架会在适当的时候自动调用。

## 使用示例

### 基本指令定义

```typescript
import { Context, Config } from 'yumerijs';

export async function apply(ctx: Context, config: Config) {
  // 定义一个简单的指令
  ctx.command('greet')
    .action(async (session) => {
      const name = session.query?.name || 'Guest';
      session.body = `Hello, ${name}!`;
      session.setMime('text');
    });
}
```

### 带参数的指令

```typescript
ctx.command('add')
  .action(async (session) => {
    const a = parseInt(session.query?.a || '0');
    const b = parseInt(session.query?.b || '0');
    
    if (isNaN(a) || isNaN(b)) {
      session.status = 400;
      session.body = 'Invalid parameters. Both a and b must be numbers.';
      session.setMime('text');
      return;
    }
    
    session.body = { result: a + b };
    session.setMime('json');
  });
```

### 使用中间件的指令

```typescript
// 定义一个日志中间件
const logMiddleware = async (session, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] Request: ${session.path}`);
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] Response: ${session.path}, Status: ${session.status}, Duration: ${duration}ms`);
};

// 定义一个权限检查中间件
const authMiddleware = async (session, next) => {
  if (!session.data.isAuthenticated) {
    session.status = 401;
    session.body = { error: 'Unauthorized' };
    session.setMime('json');
    return;
  }
  await next();
};

// 使用中间件的指令
ctx.command('admin')
  .use(logMiddleware)
  .use(authMiddleware)
  .action(async (session) => {
    session.body = { message: 'Admin panel', user: session.data.user };
    session.setMime('json');
  });
```

### 链式定义多个指令

```typescript
export async function apply(ctx: Context, config: Config) {
  // 链式定义多个指令
  ctx.command('hello')
    .action(async (session) => {
      session.body = 'Hello, World!';
      session.setMime('text');
    });
    
  ctx.command('goodbye')
    .action(async (session) => {
      session.body = 'Goodbye!';
      session.setMime('text');
    });
    
  ctx.command('info')
    .action(async (session) => {
      session.body = {
        name: 'Yumerijs',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };
      session.setMime('json');
    });
}
```

## 最佳实践

### 指令命名规范

指令名称应该简洁明了，使用小写字母和连字符：

```typescript
// 推荐
ctx.command('user-profile');
ctx.command('get-data');

// 不推荐
ctx.command('UserProfile');
ctx.command('getData');
```

### 错误处理

在指令处理函数中应该妥善处理异常：

```typescript
ctx.command('api')
  .action(async (session) => {
    try {
      const result = await someOperation();
      session.body = { success: true, data: result };
      session.setMime('json');
    } catch (err) {
      session.status = 500;
      session.body = { success: false, error: err.message };
      session.setMime('json');
      
      // 记录错误
      ctx.getCore().logger.error('API error:', err);
    }
  });
```

### 中间件复用

将通用的中间件抽取出来复用：

```typescript
// 定义通用中间件
const commonMiddlewares = {
  logger: async (session, next) => {
    console.log(`Request: ${session.path}`);
    await next();
    console.log(`Response: ${session.path}, Status: ${session.status}`);
  },
  
  auth: async (session, next) => {
    if (!session.data.isAuthenticated) {
      session.status = 401;
      session.body = { error: 'Unauthorized' };
      session.setMime('json');
      return;
    }
    await next();
  }
};

// 在多个指令中复用
ctx.command('profile')
  .use(commonMiddlewares.logger)
  .use(commonMiddlewares.auth)
  .action(async (session) => {
    // ...
  });
  
ctx.command('settings')
  .use(commonMiddlewares.logger)
  .use(commonMiddlewares.auth)
  .action(async (session) => {
    // ...
  });