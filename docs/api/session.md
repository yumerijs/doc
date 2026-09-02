# Session API

## 概述

Session 类是 Yumerijs 框架中处理用户会话的核心组件，它封装了请求和响应的相关信息，提供了会话数据管理、Cookie 处理、MIME 类型设置等功能。每个路由或命令处理函数都会接收一个 Session 实例，通过它可以获取请求信息并设置响应内容。

## 类定义

```typescript
export class Session {
    public ip: string;
    public cookie: Record<string, string>;
    public query: Record<string, string> | undefined;
    public sessionid: string;
    public data: Record<string, any>;
    public newCookie: Record<string, string>;
    public head: Record<string, any>;
    public status: number;
    public platform: Platform;
    public properties?: Record<string, any>;

    constructor(ip: string, cookie: Record<string, string>, platform: Platform, query?: Record<string, string>);
    
    public setData(key: string, value: any): void;
    public deleteData(key: string): void;
    public clearData(): void;
    public destroy(): void;
    public setMime(mimeType: 'png' | 'jpg' | 'jpeg' | 'pdf' | 'plain' | 'html' | 'json' | 'xml' | string): void;
    
    /**
     * 发送响应内容
     * @param content 响应体
     * @param type 响应类型，只能是 'plain' 或 'html'
     */
    public respond(content: any, type: 'plain' | 'html'): void;
    
    public send(data: any): any;
    public endsession(message: any): any;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| ip | string | 用户 IP 地址 |
| cookie | `Record<string, string>` | 请求中的 Cookie 信息 |
| query | `Record<string, string>` \| undefined | 请求查询参数 |
| sessionid | string | 会话唯一标识符 |
| data | `Record<string, any>` | 会话数据存储 |
| newCookie | `Record<string, string>` | 要设置的新 Cookie |
| head | `Record<string, any>` | 响应头信息 |
| status | number | 响应状态码，默认为 200 |
| platform | Platform | 会话所属的平台实例 |
| properties | `Record<string, any>` \| undefined | 会话附加属性 |

## 方法

### respond(content: any, type: 'plain' | 'html'): void

发送响应内容。这是推荐的设置响应体的方式。

**注意：** `type` 参数仅用于指定基础的响应格式（纯文本或 HTML），它并不替代 `setMime` 方法。如果需要更细粒度的 MIME 类型控制，请先调用 `setMime`。

**参数：**
- `content: any` - 响应体内容
- `type: 'plain' | 'html'` - 响应类型

**示例：**
```typescript
session.respond('Hello, World!', 'plain');
session.respond('<h1>Welcome</h1>', 'html');
```

### setMime(mimeType: 'png' | 'jpg' | 'jpeg' | 'pdf' | 'plain' | 'html' | 'json' | 'xml' | string): void

设置响应的 MIME 类型。

**参数：**
- `mimeType` - MIME 类型，可以是预定义类型或自定义字符串

**示例：**
```typescript
session.setMime('json');
session.setMime('application/octet-stream');
```

### setData(key: string, value: any): void

设置会话数据。

**参数：**
- `key: string` - 数据键名
- `value: any` - 数据值

**示例：**
```typescript
session.setData('userId', 12345);
```

### send(data: any): any

通过平台发送数据给客户端。通常用于即时通讯平台的消息下发。

**示例：**
```typescript
session.send('Hello, World!');
```

## 使用示例

### 处理不同类型的响应

```typescript
// 返回纯文本
ctx.route('/text')
  .action(async (session) => {
    session.respond('Hello, World!', 'plain');
  });

// 返回 HTML 内容
ctx.route('/page')
  .action(async (session) => {
    session.respond('<html><body><h1>Welcome to Yumeri</h1></body></html>', 'html');
  });

// 返回 JSON 数据 (需配合 setMime)
ctx.route('/api')
  .action(async (session) => {
    session.setMime('json');
    session.respond(JSON.stringify({ success: true }), 'plain');
  });
```

## 最佳实践

### 响应规范

在 Yumeri 中，**不要** 直接给 `session.body` 赋值。始终使用 `session.respond()` 来发送响应，这能确保框架正确处理不同平台的下发逻辑。

```typescript
// 推荐方式
session.respond('Content', 'plain');

// 不推荐方式 (已废弃)
// session.body = 'Content'; 
```
