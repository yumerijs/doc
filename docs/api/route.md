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

## 方法

### action(handler: RouteHandler): this
设置路由的主处理器。建议在处理函数中使用 `session.respond()` 发送响应。

**示例：**
```ts
ctx.route('/hello').action(async (session) => {
  session.respond('Hello, World!', 'plain');
});
```

---

### use(middleware: Middleware): this
为路由挂载中间件。

**示例：**
```ts
route.use(async (session, next) => {
  console.log('请求开始');
  await next();
});
```

---

### methods(...methods: string[]): this
设置允许的 HTTP 方法。

**示例：**
```ts
route.methods('GET', 'POST');
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
      console.log('进入中间件');
      await next();
    })
    .action(async (session, query, type, id) => {
      session.respond(`type=${type}, id=${id}`, 'plain');
    });
}
```
