# Session API

## 概述

Session 类是 Yumerijs 框架中处理用户会话的核心组件，它封装了请求和响应的相关信息，提供了会话数据管理、Cookie 处理、MIME 类型设置等功能。每个命令处理函数都会接收一个 Session 实例，通过它可以获取请求信息并设置响应内容。

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
    public body: any;
    public platform: Platform;
    public properties?: Record<string, any>;

    constructor(ip: string, cookie: Record<string, string>, platform: Platform, query?: Record<string, string>);
    
    public setData(key: string, value: any): void;
    public deleteData(key: string): void;
    public clearData(): void;
    public destroy(): void;
    public setMime(mimeType: 'png' | 'jpg' | 'jpeg' | 'pdf' | 'plain' | 'html' | 'json' | 'xml' | string): void;
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
| body | any | 响应体内容 |
| platform | Platform | 会话所属的平台实例 |
| properties | `Record<string, any>` \| undefined | 会话附加属性 |

## 方法

### setData(key: string, value: any): void

设置会话数据。

**参数：**
- `key: string` - 数据键名
- `value: any` - 数据值

**示例：**
```typescript
session.setData('userId', 12345);
session.setData('preferences', { theme: 'dark', language: 'zh-CN' });
```

### deleteData(key: string): void

删除指定的会话数据。

**参数：**
- `key: string` - 要删除的数据键名

**示例：**
```typescript
session.deleteData('temporaryData');
```

### clearData(): void

清空所有会话数据。

**示例：**
```typescript
session.clearData();
```

### destroy(): void

销毁会话，清理相关资源。

**示例：**
```typescript
session.destroy();
```

### setMime(mimeType: 'png' | 'jpg' | 'jpeg' | 'pdf' | 'plain' | 'html' | 'json' | 'xml' | string): void

设置响应的 MIME 类型。

**参数：**
- `mimeType` - MIME 类型，可以是预定义类型或自定义字符串

**示例：**
```typescript
// 使用预定义类型
session.setMime('json');
session.setMime('html');
session.setMime('png');

// 使用自定义 MIME 类型
session.setMime('application/octet-stream');
```

### send(data: any): any

通过平台发送数据给客户端。

**参数：**
- `data: any` - 要发送的数据

**返回值：**
- 平台处理结果

**示例：**
```typescript
session.send('Hello, World!');
session.send({ message: 'Success', code: 0 });
```

### endsession(message: any): any

结束会话并发送最后的消息。

**参数：**
- `message: any` - 结束会话时发送的消息

**返回值：**
- 平台处理结果

**示例：**
```typescript
session.endsession('Session ended');
session.endsession({ status: 'completed', message: 'Goodbye!' });
```

## 使用示例

### 在命令处理函数中使用 Session

```typescript
import { Context, Config } from 'yumerijs';

export async function apply(ctx: Context, config: Config) {
  ctx.command('user')
    .action(async (session) => {
      // 获取查询参数
      const userId = session.query?.id;
      
      if (!userId) {
        session.status = 400;
        session.body = { error: 'Missing user ID' };
        session.setMime('json');
        return;
      }
      
      // 处理业务逻辑
      const userData = await fetchUserData(userId);
      
      // 存储会话数据
      session.setData('lastAccessedUser', userId);
      
      // 设置响应
      session.status = 200;
      session.body = userData;
      session.setMime('json');
      
      // 设置 Cookie
      session.newCookie.lastVisit = new Date().toISOString();
    });
}
```

### 处理不同类型的响应

```typescript
// 返回 JSON 数据
ctx.command('api')
  .action(async (session) => {
    session.body = { success: true, data: { name: 'Yumeri' } };
    session.setMime('json');
  });

// 返回 HTML 内容
ctx.command('page')
  .action(async (session) => {
    session.body = '<html><body><h1>Welcome to Yumeri</h1></body></html>';
    session.setMime('html');
  });

// 返回纯文本
ctx.command('text')
  .action(async (session) => {
    session.body = 'Hello, World!';
    session.setMime('plain');
  });

// 返回图片
ctx.command('image')
  .action(async (session) => {
    session.body = imageBuffer; // Buffer 或 Uint8Array
    session.setMime('png');
  });
```

## 最佳实践

### 状态码使用

根据操作结果设置适当的 HTTP 状态码：

```typescript
// 成功
session.status = 200; // OK
session.status = 201; // Created

// 客户端错误
session.status = 400; // Bad Request
session.status = 401; // Unauthorized
session.status = 403; // Forbidden
session.status = 404; // Not Found

// 服务器错误
session.status = 500; // Internal Server Error
```

### 会话数据管理

会话数据应该只存储必要的信息，避免存储过大的对象：

```typescript
// 推荐
session.setData('userId', user.id);
session.setData('permissions', user.permissions);

// 不推荐
session.setData('user', completeUserObjectWithLargeData);
```

### 响应格式一致性

保持 API 响应格式的一致性：

```typescript
// 统一的 JSON 响应格式
function sendResponse(session, success, data = null, error = null) {
  session.body = {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
  session.setMime('json');
}

// 使用
ctx.command('api')
  .action(async (session) => {
    try {
      const result = await someOperation();
      sendResponse(session, true, result);
    } catch (err) {
      session.status = 500;
      sendResponse(session, false, null, err.message);
    }
  });