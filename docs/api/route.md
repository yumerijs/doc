# Route API

## 概述

`Route` 类用于定义和管理 Yumerijs 框架中的路由规则。  
它基于分段（segment）匹配机制，实现了灵活的路径参数解析，并支持可选、多段等高级匹配模式。  

特点：
- 支持静态路径与参数化路径混合
- 提供 `:param`（必需）、`:param?`（可选）、`:param+`（一个或多个）、`:param*`（零个或多个）四种参数匹配模式
- 内置中间件机制
- 支持指定允许的 HTTP 方法
- 可安全地从请求路径中提取参数

---

## 类定义

```typescript
export class Route {
    public middlewares: Middleware[];
    public allowedMethods: string[];

    constructor(public path: string);

    action(handler: RouteHandler): this;
    use(middleware: Middleware): this;
    match(pathname: string): { params: Record<string, string | undefined>; pathParams: string[] } | null;
    executeHandler(session: Session, params: URLSearchParams, pathParams: string[]): Promise<void>;
    methods(...methods: string[]): this;
}
```

---

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| path | string | 路由路径模式（支持参数占位符） |
| middlewares | Middleware[] | 绑定在该路由上的中间件列表 |
| allowedMethods | string[] | 当前路由允许的 HTTP 方法列表（默认：`['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']`） |

---

## 方法

### constructor(path: string)

创建一个新的路由实例，并解析路径模式。

**参数：**
- `path: string` - 路由路径模式，可包含参数（如 `"/user/:id"`）

---

### action(handler: RouteHandler): this

设置路由的主处理器。

**参数：**
- `handler: RouteHandler` - 路由处理函数

**返回值：**
- `this` - 当前路由实例，支持链式调用

**示例：**
```typescript
const route = new Route('/hello');
route.action(async (session, query, ...params) => {
    session.body = 'Hello, World!';
});
```

---

### use(middleware: Middleware): this

为路由挂载中间件。

**参数：**
- `middleware: Middleware` - 中间件函数

**返回值：**
- `this` - 当前路由实例，支持链式调用

**示例：**
```typescript
route.use(async (session, next) => {
    console.log('请求开始');
    await next();
    console.log('请求结束');
});
```

---

### match(pathname: string)

匹配请求路径与路由模式。

**参数：**
- `pathname: string` - 请求路径

**返回值：**
- `{ params: Record<string, string | undefined>; pathParams: string[] } | null` - 匹配结果，如果不匹配返回 `null`

**示例：**
```typescript
const result = route.match('/hello');
if (result) {
    console.log(result.params);
}
```

---
### executeHandler(session: Session, params: URLSearchParams, pathParams: string[]): `Promise<void>`

执行路由绑定的处理器。

**参数：**
- `session: Session` - 会话对象
- `params: URLSearchParams` - 查询参数
- `pathParams: string[]` - 路由参数

**示例：**
```typescript
await route.executeHandler(session, new URLSearchParams('?q=test'), ['123']);
```

---

### methods(...methods: string[]): this

设置路由允许的 HTTP 方法。

**参数：**
- `methods: string[]` - 方法列表，如 `'GET', 'POST'`

**返回值：**
- `this` - 当前路由实例

**示例：**
```typescript
route.methods('GET', 'POST');
```

