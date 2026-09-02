# 中间件

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 中间件概述

中间件是Yumeri框架中一个重要的概念，它允许开发者在请求处理流程中插入自定义逻辑。中间件可以在路由执行前后执行特定操作，例如日志记录、权限验证、数据转换等。

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
  console.log(`Request: ${session.sessionid}`);
  
  // 调用下一个中间件或核心逻辑
  await next();
  
  // 后置处理
  console.log(`Response Status: ${session.status}`);
};
```

## 注册全局中间件

<div class="functional-api">

使用`ctx.use()`方法注册全局中间件，它将应用于所有路由：

```typescript
export async function apply(ctx: Context, config: Config) {
  // 注册全局中间件
  ctx.use(logMiddleware);
}
```

</div>

<div class="decorator-api">

在装饰器模式下，如果你需要注册影响整个应用的全局中间件，通常仍需在插件的 `constructor` 中通过 `ctx.use()` 注册。

</div>

## 注册路由特定中间件

<div class="functional-api">

```typescript
ctx.route('/secure')
  .use(authMiddleware)  // 先执行认证中间件
  .action(async (session, _, _) => {
    session.respond('Secure content', 'plain');
  });
```

</div>

<div class="decorator-api">

使用 `@Use` 装饰器为特定路由注册中间件：

```typescript
import { Plugin, Get, Use } from '@yumerijs/decorator';

@Plugin
export default class SecurePlugin {
  @Get('/secure')
  @Use(authMiddleware)
  async getSecure(session: Session) {
    session.respond('Secure content', 'plain');
  }
}
```

</div>

## 错误处理中间件

中间件可以用于捕获和处理错误：

```typescript
const errorHandlerMiddleware: Middleware = async (session, next) => {
  try {
    await next();
  } catch (error) {
    session.status = 500;
    session.respond('Internal Server Error', 'plain');
  }
};
```

## 常用中间件示例

### 认证中间件

```typescript
const authMiddleware: Middleware = async (session, next) => {
  const token = session.cookie['auth-token'];
  
  if (!token) {
    session.status = 401;
    session.respond('Unauthorized', 'plain');
    return;  // 不调用next()，中断中间件链
  }
  
  await next();
};
```

## 最佳实践

1. **单一职责原则**：每个中间件应该专注于一个特定功能
2. **错误处理**：在中间件中妥善处理可能出现的错误
3. **顺序安排**：合理安排中间件的执行顺序（例如：认证应在日志之后、业务逻辑之前）
4. **不要直接修改 Body**：始终使用 `session.respond()` 来发送响应。
