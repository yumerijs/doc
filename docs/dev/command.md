# 指令系统

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 指令系统概述

"指令"的概念在Web系统里面非常模糊。它不像机器人中那样是实时响应的会话，而是在Yumeri当中，若非websocket连接，所有的页面响应都将在指令执行完成后返回。

## 注册指令

指令注册通过链式调用实现，将command对象返回至上下文，代码如下：

```typescript
ctx.command('foo')
  .action(async (session: Session, param?: any) => {
    logger.info('excute command foo');
    session.body = 'bar';
    session.setMime('plain');
  });
```

首先，使用`ctx.command(name)`定义一个command对象，然后调用action函数注册指令代码。该函数不能返回任何返回值。传入参数有session以及param。

其中，session为会话信息，存储着包含用户ip在内的信息。

param是参数，包含了二级及之后路径（param.path，如路径是/aaa/bbb/ccc.html，则param.path为bbb/ccc.html）以及用户参数请求。

调用指令主要由yumeri-plugin-server完成。

## 参数处理

在指令系统中，参数处理是一个重要的部分。Yumeri提供了灵活的参数处理机制：

```typescript
ctx.command('greet')
  .action(async (session: Session, param?: any) => {
    const name = param?.name || 'Guest';
    session.body = `Hello, ${name}!`;
    session.setMime('text');
  });
```

在上面的例子中，如果访问`/greet?name=John`，将返回"Hello, John!"；如果没有提供name参数，则返回"Hello, Guest!"。

## 响应格式

Yumeri支持多种响应格式，通过`session.setMime()`方法设置：

```typescript
// 返回纯文本
session.setMime('text');
session.body = 'Hello, World!';

// 返回HTML
session.setMime('html');
session.body = '<h1>Hello, World!</h1>';

// 返回JSON
session.setMime('json');
session.body = { message: 'Hello, World!' };
```

## 路径参数

Yumeri的指令系统支持路径参数，可以通过`param.path`获取：

```typescript
ctx.command('article')
  .action(async (session: Session, param?: any) => {
    // 访问 /article/2023/05/21
    // param.path 将是 "2023/05/21"
    const pathParts = param.path.split('/');
    const year = pathParts[0];
    const month = pathParts[1];
    const day = pathParts[2];
    
    session.body = `Article from ${year}-${month}-${day}`;
    session.setMime('text');
  });
```

## 错误处理

在指令处理中，妥善处理错误是很重要的：

```typescript
ctx.command('risky')
  .action(async (session: Session, param?: any) => {
    try {
      // 可能抛出错误的代码
      const result = await riskyOperation();
      session.body = result;
      session.setMime('text');
    } catch (error) {
      // 错误处理
      session.body = `Error: ${error.message}`;
      session.setMime('text');
      // 可以设置HTTP状态码
      session.status = 500;
    }
  });
```

## 指令链和中间件

> 该功能正在内部测试中，详情可进入风梨团队内部Q群查看进度

Yumeri支持指令链和中间件，可以在指令执行前后添加自定义逻辑：

```typescript
// 定义中间件
const logMiddleware = async (session: Session, next: () => Promise<void>) => {
  console.log(`Request to: ${session.path}`);
  await next();
  console.log(`Response from: ${session.path}`);
};

// 使用中间件
ctx.use(logMiddleware);

// 指令链
ctx.command('chain')
  .use(async (session, next) => {
    // 前置处理
    session.data.startTime = Date.now();
    await next();
    // 后置处理
    const duration = Date.now() - session.data.startTime;
    console.log(`Command execution took ${duration}ms`);
  })
  .action(async (session) => {
    // 主要处理逻辑
    session.body = 'Command executed';
    session.setMime('text');
  });
```

## 最佳实践

1. **命名规范**：使用清晰、一致的命名规范，避免冲突
2. **参数验证**：始终验证用户输入，避免安全问题
3. **错误处理**：妥善处理可能出现的错误，提供友好的错误信息
4. **响应格式**：根据需求选择适当的响应格式
5. **代码组织**：将相关指令组织在一起，便于维护