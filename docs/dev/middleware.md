# 中间件

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 中间件概述

中间件是Yumeri框架中一个重要的概念，它允许开发者在请求处理流程中插入自定义逻辑。中间件可以在指令执行前后执行特定操作，例如日志记录、权限验证、数据转换等。

## 中间件的工作原理

在Yumeri中，中间件遵循"洋葱模型"，即请求先经过所有中间件的前置处理，然后执行核心逻辑，最后再反向经过所有中间件的后置处理：

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

## 创建中间件

中间件是一个接受`session`和`next`参数的异步函数：

```typescript
type Middleware = (session: Session, next: () => Promise<void>) => Promise<void>;
```

一个简单的日志中间件示例：

```typescript
const logMiddleware: Middleware = async (session, next) => {
  // 前置处理
  logger.info(`[${new Date().toISOString()}] Request: ${session.path}`);
  
  // 调用下一个中间件或核心逻辑
  await next();
  
  // 后置处理
  logger.info(`[${new Date().toISOString()}] Response: ${session.path}, Status: ${session.status}`);
};
```

## 注册全局中间件

使用`ctx.use()`方法注册全局中间件，它将应用于所有指令：

```typescript
export async function apply(ctx: Context, config: Config) {
  // 注册全局中间件
  ctx.use(logMiddleware);
  
  // 其他插件初始化代码...
}
```

## 注册指令特定中间件

也可以为特定指令注册中间件：

```typescript
ctx.command('secure')
  .use(authMiddleware)  // 先执行认证中间件
  .use(rateLimitMiddleware)  // 然后执行速率限制中间件
  .action(async (session) => {
    // 指令处理逻辑
    session.body = 'Secure content';
    session.setMime('text');
  });
```

## 中间件链

多个中间件会形成一个中间件链，按照注册顺序依次执行：

```typescript
// 全局中间件链
ctx.use(middleware1);
ctx.use(middleware2);
ctx.use(middleware3);

// 执行顺序：
// 1. middleware1（前置）
// 2. middleware2（前置）
// 3. middleware3（前置）
// 4. 指令处理逻辑
// 5. middleware3（后置）
// 6. middleware2（后置）
// 7. middleware1（后置）
```

## 错误处理中间件

中间件可以用于捕获和处理错误：

```typescript
const errorHandlerMiddleware: Middleware = async (session, next) => {
  try {
    await next();
  } catch (error) {
    logger.error('Error:', error);
    session.status = 500;
    session.body = 'Internal Server Error';
    session.setMime('text');
  }
};

// 注册为全局中间件
ctx.use(errorHandlerMiddleware);
```

## 常用中间件示例

### 认证中间件

```typescript
const authMiddleware: Middleware = async (session, next) => {
  const token = session.headers['authorization'];
  
  if (!token || !isValidToken(token)) {
    session.status = 401;
    session.body = 'Unauthorized';
    session.setMime('text');
    return;  // 不调用next()，中断中间件链
  }
  
  // 认证通过，继续处理
  await next();
};
```

### 性能监控中间件

```typescript
const performanceMiddleware: Middleware = async (session, next) => {
  const startTime = Date.now();
  
  await next();
  
  const duration = Date.now() - startTime;
  logger.info(`Request to ${session.path} took ${duration}ms`);
};
```

### 数据转换中间件

```typescript
const jsonBodyParserMiddleware: Middleware = async (session, next) => {
  if (session.headers['content-type'] === 'application/json') {
    try {
      session.body = JSON.parse(session.rawBody);
    } catch (error) {
      session.status = 400;
      session.body = 'Invalid JSON';
      session.setMime('text');
      return;
    }
  }
  
  await next();
};
```

## 最佳实践

1. **单一职责原则**：每个中间件应该专注于一个特定功能
2. **错误处理**：在中间件中妥善处理可能出现的错误
3. **性能考虑**：避免在中间件中执行耗时操作，必要时使用异步处理
4. **顺序安排**：合理安排中间件的执行顺序，确保依赖关系正确
5. **状态管理**：避免在中间件中修改全局状态，使用session存储请求相关状态