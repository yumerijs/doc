# 路由系统

## 简介

路由系统是大部分后端开发框架的基础，路由系统负责接收客户端请求，然后根据请求路径和方法，把请求分发给对应的处理函数（Handler）。

基本流程：

1. **客户端发起请求**  
2. **路由系统匹配路径和方法**  
3. **调用对应的处理函数**  
4. **返回响应给客户端**

流程大致如下：
```
    +----------------+
    |  客户端请求     |
    | GET /users     |
    +--------+-------+
             |
             v
    +--------+--------+
    |  路由系统        |
    | 匹配路径和方法   |
    +--------+--------+
             |
    +--------+--------+
    | 处理函数 Handler |
    | getUsers()      |
    +--------+--------+
             |
             v
    +--------+--------+
    | 响应客户端        |
    | JSON 数据       |
    +----------------+
```
在 Yumeri 中，路由定义采用分段式（Segment）的形式，例如 `/users/:id`，其中 `:id` 是一个参数，表示该路径可以匹配 `/users/1`、`/users/2` 等等。

## 路由匹配语法

Yumeri 的路由系统支持以下几种匹配语法：

1. **普通路径**  
例如 `/users`，表示匹配 `/users` 路径。

2. **参数路径**  
例如 `/users/:id`，表示匹配 `/users/1`、`/users/2` 等等。

其中，`:` 后面的部分表示一个参数，可以匹配任意字符串。匹配模式如下：

- `/users/:id` 匹配 `/users/1`、`/users/2` 等等。
- `/users/:id/posts` 匹配 `/users/1/posts`、`/users/2/posts` 等等。
- `/users/:id/posts/:post_id` 匹配 `/users/1/posts/1`、`/users/2/posts/2` 等等。
- `/users/:id+` 匹配 `/users/1`、`/users/1/2` 等等，表示参数可以匹配多个值。
- `/users/:id*` 匹配 `/users/1`、`/users/1/2` 等等，表示参数可以匹配多个值，也可以不匹配。
- `/users/:id?` 匹配 `/users/1`、`/users/` 等等，表示参数可以匹配一个值，也可以不匹配。

通过这种灵活的匹配模式，可以实现变量的快速抓取。当然，如果你仅仅只是用户，以上内容了解即可。

## 匹配顺序

Yumeri 的 Core 维护着一个路由列表，每次新增路由将会在路由列表尾部添加路由。因此，路由的匹配顺序是按照路由列表的顺序进行的，即先添加的路由会先匹配。

例如：
```typescript
ctx.route('/users/:id')
    .action(handler1(session, params, id))
ctx.route('/users/:id')
    .action(handler2(session, params, id))
```
上面的代码中，`/users/:id` 会先匹配，然后才会匹配 `/users/:id`，因此只有 `handler1` 会被执行。

匹配顺序的了解有助于防止出现错误匹配，例如：
```typescript
ctx.route('/users/:id?/:others')
    .action(handler1(session, params, id?, others))
ctx.route('/users/:id')
    .action(handler2(session, params, id))
```
上面的代码中，对于路径/users/aaa，`/users/:id?/:others` 会先匹配，然后才会匹配 `/users/:id`，因此只有 `handler1` 会被执行，而 `handler2` 不会被执行。
