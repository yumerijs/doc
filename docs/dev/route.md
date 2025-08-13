# 路由系统

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 路由系统简介

Yumeri框架的路由系统是一个标准的Express语法路由，它允许你自由定义路由规则，并在应用程序中实现页面导航、参数传递等功能。

## 注册路由

路由注册通过链式调用实现，将route对象返回至上下文，代码如下：

```typescript
ctx.route('/user/:id')
    .action((session, params, id) => {
        logger.info('user id: ' + id)
        session.setMime('html')
        session.body = 'user id: ' + id
    })
```

## 路由规则

Yumeri框架的路由规则遵循Express语法，支持多种路由规则，包括：

- 路径参数：`/user/:id`
- 查询参数：`/user?id=123`
- 路径参数和查询参数：`/user/:id?id=123`
- 正则表达式：`/user/:id(\\d+)`

## 路由方法

Yumeri框架的路由方法包括：

- `get`：GET请求
- `post`：POST请求
- `put`：PUT请求

设置路由支持的方法可通过以下表达式：

```typescript
ctx.route('/user/:id')
    .action((session, params, id) => {
        logger.info('user id: ' + id)
        session.setMime('html')
        session.body = 'user id: ' + id
    })
    .methods('get', 'post')
```

## 路由中间件

Yumeri框架的路由中间件允许你在路由处理之前或之后执行一些操作，例如身份验证、日志记录等。中间件通过`use`方法注册，代码如下：

```typescript
ctx.route('/user/:id')
    .use((session, next) => {
        logger.info('before action')
        next()
    })
    .action((session, params, id) => {
        logger.info('user id: ' + id)
        session.setMime('html')
        session.body = 'user id: ' + id
    })
```