# Middleware API

## 概述

中间件是 Yumerijs 框架中一个强大的概念，它允许开发者在请求处理流程中插入自定义逻辑。中间件可以在指令执行前后执行特定操作，例如日志记录、权限验证、数据转换等。Yumerijs 的中间件遵循"洋葱模型"，即请求先经过所有中间件的前置处理，然后执行核心逻辑，最后再反向经过所有中间件的后置处理。

## 类型定义

```typescript
export type Middleware = (session: Session, next: () => Promise<void>) => Promise<void>;
```

中间件是一个接受 `session` 和 `next` 参数的异步函数：

- `session: Session` - 当前会话对象
- `next: () => Promise<void>` - 调用下一个中间件或核心逻辑的函数

## 中间件工作原理

在 Yumerijs 中，中间件遵循"洋葱模型"，即请求先经过所有中间件的前置处理，然后执行核心逻辑，最后再反向经过所有中间件的后置处理：

```
            ┌─────────────────────────────────────┐
            │           中间件1（前置）           │
            │     ┌─────────────────────────┐     │
            │     │      中间件2（前置）     │     │
            │     │   ┌─────────────────┐   │     │
            │     │   │  核心处理逻辑   │   │     │
            │     │   └─────────────────┘   │     │
            │     │      中间件2（后置）     │     │
            │     └─────────────────────────┘     │
            │           中间件1（后置）           │
            └─────────────────────────────────────┘
```

## 使用示例

### 创建中间件

```typescript
import { Middleware, Session } from 'yumerijs';

// 日志中间件
const logMiddleware: Middleware = async (session, next) => {
  // 前置处理
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Request: ${session.path}`);
  
  // 调用下一个中间件或核心逻辑
  await next();
  
  // 后置处理
  const duration = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] Response: ${session.path}, Status: ${session.status}, Duration: ${duration}ms`);
};

// 认证中间件
const authMiddleware: Middleware = async (session, next) => {
  const token = session.cookie['authorization'];
  
  if (!token || !isValidToken(token)) {
    session.status = 401;
    session.body = { error: 'Unauthorized' };
    session.setMime('json');
    return;  // 不调用next()，中断中间件链
  }
  
  // 认证通过，继续处理
  await next();
};

// 错误处理中间件
const errorHandlerMiddleware: Middleware = async (session, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    session.status = 500;
    session.body = { error: 'Internal Server Error' };
    session.setMime('json');
  }
};
```

### 注册全局中间件

使用 `core.use()` 或 `ctx.use()` 方法注册全局中间件，它将应用于所有指令：

```typescript
import { Context, Config } from 'yumerijs';

export async function apply(ctx: Context, config: Config) {
  // 注册全局中间件
  ctx.use('logger', async (session, next) => {
    console.log(`Request: ${session.path}`);
    await next();
    console.log(`Response: ${session.path}, Status: ${session.status}`);
  });
  
  // 其他插件初始化代码...
}
```

### 注册指令特定中间件

也可以为特定指令注册中间件：

```typescript
ctx.command('secure')
  .use(async (session, next) => {
    // 认证中间件
    if (!session.data.isAuthenticated) {
      session.status = 401;
      session.body = 'Unauthorized';
      session.setMime('text');
      return;
    }
    await next();
  })
  .use(async (session, next) => {
    // 速率限制中间件
    if (isRateLimited(session.ip)) {
      session.status = 429;
      session.body = 'Too Many Requests';
      session.setMime('text');
      return;
    }
    await next();
  })
  .action(async (session) => {
    // 指令处理逻辑
    session.body = 'Secure content';
    session.setMime('text');
  });
```

### 中间件链执行顺序

多个中间件会形成一个中间件链，按照注册顺序依次执行：

```typescript
// 全局中间件链
ctx.use('middleware1', middleware1);
ctx.use('middleware2', middleware2);
ctx.use('middleware3', middleware3);

// 指令特定中间件
ctx.command('example')
  .use(commandMiddleware1)
  .use(commandMiddleware2)
  .action(async (session) => {
    // 指令处理逻辑
  });

// 执行顺序：
// 1. middleware1（前置）
// 2. middleware2（前置）
// 3. middleware3（前置）
// 4. commandMiddleware1（前置）
// 5. commandMiddleware2（前置）
// 6. 指令处理逻辑
// 7. commandMiddleware2（后置）
// 8. commandMiddleware1（后置）
// 9. middleware3（后置）
// 10. middleware2（后置）
// 11. middleware1（后置）
```

## 常用中间件示例

### 性能监控中间件

```typescript
const performanceMiddleware: Middleware = async (session, next) => {
  const startTime = Date.now();
  
  await next();
  
  const duration = Date.now() - startTime;
  console.log(`Path: ${session.path}, Duration: ${duration}ms`);
  
  // 记录慢请求
  if (duration > 1000) {
    console.warn(`Slow request detected: ${session.path}, Duration: ${duration}ms`);
  }
};
```

### CORS 中间件

```typescript
const corsMiddleware: Middleware = async (session, next) => {
  // 添加 CORS 头
  session.head['Access-Control-Allow-Origin'] = '*';
  session.head['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  session.head['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  
  // 处理 OPTIONS 请求
  if (session.properties?.request?.method === 'OPTIONS') {
    session.status = 204;
    return;
  }
  
  await next();
};
```

### 请求验证中间件

```typescript
const validateRequestMiddleware: Middleware = async (session, next) => {
  const body = session.properties?.request?.body;
  
  // 验证请求体
  if (!body || typeof body !== 'object') {
    session.status = 400;
    session.body = { error: 'Invalid request body' };
    session.setMime('json');
    return;
  }
  
  // 验证必要字段
  if (!body.username || !body.password) {
    session.status = 400;
    session.body = { error: 'Missing required fields' };
    session.setMime('json');
    return;
  }
  
  await next();
};
```

### 缓存中间件

```typescript
const cacheMiddleware = (ttl = 60000): Middleware => {
  const cache = new Map();
  
  return async (session, next) => {
    const cacheKey = session.path + JSON.stringify(session.query);
    const cachedItem = cache.get(cacheKey);
    
    if (cachedItem && Date.now() - cachedItem.timestamp < ttl) {
      // 使用缓存的响应
      session.status = cachedItem.status;
      session.body = cachedItem.body;
      session.head = { ...cachedItem.head };
      return;
    }
    
    await next();
    
    // 缓存响应
    cache.set(cacheKey, {
      status: session.status,
      body: session.body,
      head: { ...session.head },
      timestamp: Date.now()
    });
  };
};
```

## 最佳实践

### 中间件命名和组织

为中间件使用描述性名称，并按功能组织：

```typescript
// 安全相关中间件
const securityMiddlewares = {
  auth: async (session, next) => { /* ... */ },
  rateLimit: async (session, next) => { /* ... */ },
  csrf: async (session, next) => { /* ... */ }
};

// 日志相关中间件
const loggingMiddlewares = {
  request: async (session, next) => { /* ... */ },
  performance: async (session, next) => { /* ... */ },
  error: async (session, next) => { /* ... */ }
};

// 使用中间件
ctx.use('security:auth', securityMiddlewares.auth);
ctx.use('logging:request', loggingMiddlewares.request);
```

### 中间件复用

创建中间件工厂函数，以便根据不同配置复用中间件逻辑：

```typescript
// 中间件工厂函数
const createRateLimitMiddleware = (options: {
  limit: number;
  window: number;
  message?: string;
}): Middleware => {
  const clients = new Map`<string, number[]>`();
  
  return async (session, next) => {
    const now = Date.now();
    const ip = session.ip;
    
    // 获取客户端请求记录
    const requests = clients.get(ip) || [];
    
    // 清理过期请求
    const validRequests = requests.filter(time => now - time < options.window);
    
    // 检查是否超过限制
    if (validRequests.length >= options.limit) {
      session.status = 429;
      session.body = options.message || 'Too Many Requests';
      session.setMime('text');
      return;
    }
    
    // 记录新请求
    validRequests.push(now);
    clients.set(ip, validRequests);
    
    await next();
  };
};

// 使用工厂函数创建不同配置的中间件
const apiRateLimit = createRateLimitMiddleware({ limit: 60, window: 60000 });
const loginRateLimit = createRateLimitMiddleware({ limit: 5, window: 60000, message: 'Too many login attempts' });

// 应用中间件
ctx.command('api').use(apiRateLimit);
ctx.command('login').use(loginRateLimit);
```

### 错误处理

确保在中间件链的最外层添加错误处理中间件：

```typescript
// 错误处理中间件应该是第一个注册的全局中间件
ctx.use('error-handler', async (session, next) => {
  try {
    await next();
  } catch (error) {
    ctx.getCore().logger.error('Unhandled error:', error);
    
    // 设置适当的错误响应
    session.status = 500;
    session.body = {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
    session.setMime('json');
  }
});
```

### 避免阻塞

中间件应该尽量避免长时间阻塞操作，对于耗时任务应该使用异步处理：

```typescript
// 不推荐
ctx.use('blocking', async (session, next) => {
  // 长时间阻塞操作
  const result = someBlockingOperation();
  
  await next();
});

// 推荐
ctx.use('non-blocking', async (session, next) => {
  // 使用异步操作
  const resultPromise = someAsyncOperation();
  
  // 继续中间件链
  await next();
  
  // 在后置处理中等待结果
  const result = await resultPromise;
  // 使用结果进行后处理
});