# Route API

## 概述
`Route` 类用于定义和管理 **Yumerijs** 框架中的路由规则。  
它采用基于“分段匹配”的机制，能够灵活地解析路径参数，并支持高级的多段、可选匹配模式。  

特点：
- 支持静态路径与参数化路径混合
- 提供四种参数修饰符：`:param`（必需）、`:param?`（可选）、`:param+`（一个或多个）、`:param*`（零个或多个）
- 内置中间件机制
- 支持自定义 HTTP 方法
- WebSocket 路由支持
- 可安全地从请求路径中提取参数并传递给处理函数

---

## 类定义
```ts
export class Route {
  private segments: Segment[];
  private paramsInfo: ParamInfo[];
  private handler: RouteHandler | null;
  public middlewares: Middleware[];
  public allowedMethods: string[];
  public ws: WebSocketServer | null;

  constructor(public path: string);

  action(handler: RouteHandler): this;
  use(middleware: Middleware): this;
  match(pathname: string): { params: Record<string, string | undefined>; pathParams: string[] } | null;
  executeHandler(session: Session, params: URLSearchParams, pathParams: string[]): Promise<void>;
  methods(...methods: string[]): this;
  wsOn(event: string, handler: (...args: any[]) => void): this;
}
```

---

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| path | string | 当前路由路径模式 |
| middlewares | Middleware[] | 绑定在该路由上的中间件列表 |
| allowedMethods | string[] | 当前路由允许的 HTTP 方法（默认：`['GET','POST','PUT','DELETE','PATCH','HEAD']`） |
| ws | WebSocketServer \| null | WebSocket 服务器实例（仅在调用 `wsOn()` 后创建） |

---

## 方法

### constructor(path: string)
创建一个新的路由实例并解析路径模式。

**参数：**
- `path: string` - 路由路径模式，可包含参数（例如：`"/user/:id"`）

**示例：**
```ts
ctx.route('/user/:id');
```

---

### action(handler: RouteHandler): this
设置路由的主处理器。

**参数：**
- `handler: RouteHandler` - 路由处理函数

**返回值：**
- `this` - 当前路由实例（支持链式调用）

**示例：**
```ts
ctx.route.action(async (session, query, ...params) => {
  session.body = 'Hello, World!';
});
```

---

### use(middleware: Middleware): this
为路由挂载中间件。

**参数：**
- `middleware: Middleware` - 中间件函数

**返回值：**
- `this`

**示例：**
```ts
route.use(async (session, next) => {
  logger.info('请求开始');
  await next();
  logger.info('请求结束');
});
```

---

### match(pathname: string)
匹配请求路径与路由模式。

**参数：**
- `pathname: string` - 请求路径

**返回值：**
- 匹配成功时返回 `{ params, pathParams }`，否则返回 `null`  
  - `params`: 键值映射的命名参数  
  - `pathParams`: 位置参数数组

**示例：**
```ts
const result = route.match('/user/42');
if (result) logger.info(result.params.id); // => 42
```

---

### executeHandler(session: Session, params: URLSearchParams, pathParams: string[]): Promise&lt;void&gt;
执行路由绑定的处理函数。

**参数：**
- `session: Session` - 会话对象  
- `params: URLSearchParams` - 查询参数  
- `pathParams: string[]` - 路由参数

**示例：**
```ts
await route.executeHandler(session, new URLSearchParams('?a=1'), ['test']);
```

---

### methods(...methods: string[]): this
设置允许的 HTTP 方法。

**参数：**
- `methods: string[]` - 允许的方法（例如 `'GET','POST'`）

**返回值：**
- `this`

**示例：**
```ts
route.methods('GET', 'POST');
```

---

### wsOn(event: string, handler: (...args: any[]) => void): this
为当前路由注册一个 WebSocket 事件监听器。  
若该路由尚未创建 `WebSocketServer` 实例，会自动初始化。

**参数：**
- `event: string` - WebSocket 事件名（如 `"connection"`, `"message"`, `"close"`）
- `handler: (...args: any[]) => void` - 事件回调函数

**返回值：**
- `this`

**示例：**
```ts
route.wsOn('connection', (ws) => {
  ws.on('message', (msg) => console.log('收到消息:', msg.toString()));
});
```

---

## 路由参数匹配规则

| 模式 | 示例 | 匹配示例 | 描述 |
|------|------|-----------|------|
| `:id` | `/user/:id` | `/user/42` | 必填单段 |
| `:id?` | `/user/:id?` | `/user` 或 `/user/42` | 可选单段 |
| `:path+` | `/file/:path+` | `/file/a/b/c` | 至少一段 |
| `:path*` | `/file/:path*` | `/file` 或 `/file/a/b` | 可为零段 |

---

## 使用示例
```ts
import { Context } from 'yumeri';

export async function apply(ctx: Context) {
  ctx.route('/api/:type/:id?')
    .methods('GET')
    .use(async (session, next) => {
      logger.info('进入中间件');
      await next();
    })
    .action(async (session, query, type, id) => {
      session.body = `type=${type}, id=${id}`;
    });
}
```