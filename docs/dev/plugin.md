# 插件基础

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 创建一个插件

在开发项目的根目录，执行yarn setup 插件名称，根据提示输入插件的描述，脚本将会自动创建好一个插件。打开 plugins目录，找到新建的插件，即可开始开发工作。

为了实时查看ts代码更新，请使用yarn dev来启动开发环境。

## 编写你的插件

在插件的`src`目录下找到`index.ts`，在其中输入以下内容：

<div class="functional-api">

```typescript
import { Context, Config, Session } from 'yumeri';

export async function apply(ctx: Context, config: Config) {
  // 加载插件时执行的操作
  ctx.route('/foo')
    .action(async (session: Session, _) => {
      session.respond(`<h1>This is my plugin</h1>
<h2>welcome!</h2>`, 'html');
    });
}

export async function disable(ctx: Context) {
  // 卸载插件时执行的操作
}
```

</div>

<div class="decorator-api">

```typescript
import { Session, Context } from 'yumeri';
import { Plugin, Get } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  constructor(_ctx: Context, _config: any) {}

  @Get('/foo')
  async action(session: Session) {
    session.respond(`<h1>This is my plugin</h1>
<h2>welcome!</h2>`, 'html');
  }
}
```

</div>

重启yumeri以运行，打开yumeri监听地址+/foo，你将会看到：This is myplugin welcome!

恭喜你，你运行了你的第一个插件。

## 插件结构详解

一个标准的Yumeri插件通常包含以下文件和目录（开发模式下）：

```
yumeri-plugin-example/
├── src/
│   ├── index.ts        # 插件入口
├── package.json        # 包信息
└── tsconfig.json       # TypeScript配置
```

### 插件入口文件

插件的入口文件（编译后通常是是`dist/index.js`）可以根据选用的 API 模式导出：

<div class="functional-api">

1. **apply**：插件加载时调用，用于初始化插件和注册功能
2. **disable**：插件卸载时调用，用于清理资源等

这两个函数的签名如下：

```typescript
export async function apply(ctx: Context, config: Config): Promise<void> {
  // 初始化代码
}

export async function disable(ctx: Context): Promise<void> {
  // 清理代码
}
```

</div>

<div class="decorator-api">

在装饰器模式下，插件入口必须 **默认导出 (default export)** 一个类，并且类上必须使用 `@Plugin` 装饰器。Yumeri 会自动实例化该类并解析其中的装饰器。

```typescript
import { Context } from 'yumeri';
import { Plugin } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  constructor(ctx: Context, config: any) {
    // 初始化代码
  }
}
```

</div>

## 核心API

### Context对象

`Context`对象是Yumeri插件系统的重要组成部分，提供了对于Core的注册命令、中间件和事件监听等功能的封装：

```typescript
interface Context {
  // 注册路由
  route(name: string): route;
  
  // 注册中间件
  use(middleware: Middleware): void;
  
  // 监听事件
  on(event: string, listener: EventListener): void;

  // 获取Core实例
  getCore(): Core;
  
  // 其他方法...
}

一般而言，除非有特殊需求，否则请使用Context对象来注册组件和指令。直接操作Core将导致无法正确卸载插件。
```

### Config对象

`Config`对象包含插件的配置信息：

```typescript
interface Config {
  // 插件配置
  [key: string]: any;
}
```

### Session对象

`Session`对象表示一个会话，包含请求和响应信息：

```typescript
interface Session {
  // 设置响应MIME类型
  setMime(mime: string): void;
  
  // 发送响应内容 (type 可选 'plain' 或 'html')
  respond(content: any, type: 'plain' | 'html'): void;
  
  // 其他属性和方法...
}
```

## 注册路由

路由是Yumeri插件的核心功能之一，用于处理特定的请求路径：

<div class="functional-api">

```typescript
ctx.route('/hello')
  .action(async (session: Session, param?: any) => {
    session.respond('Hello, World!', 'plain');
  });
```

</div>

<div class="decorator-api">

```typescript
import { Plugin, Get } from '@yumerijs/decorator';

@Plugin
export default class HelloPlugin {
  @Get('/hello')
  async sayHello(session: Session) {
    session.respond('Hello, World!', 'plain');
  }
}
```

</div>

## 示例：创建一个计数器插件

以下是一个简单的计数器插件示例：

<div class="functional-api">

```typescript
import { Context, Config, Session } from 'yumeri';

let counter = 0;

export async function apply(ctx: Context, config: Config) {
  // 注册增加计数的路由
  ctx.route('/counter-increment')
    .action(async (session: Session, param?: any) => {
      counter++;
      session.respond(`Counter: ${counter}`, 'plain');
    });
  
  // 注册获取计数的路由
  ctx.route('/counter-get')
    .action(async (session: Session, param?: any) => {
      session.respond(`Current count: ${counter}`, 'plain');
    });
}

export async function disable(ctx: Context) {
  // 清理资源
}
```

</div>

<div class="decorator-api">

```typescript
import { Context, Session } from 'yumeri';
import { Plugin, Get } from '@yumerijs/decorator';

@Plugin
export default class CounterPlugin {
  private counter = 0;

  @Get('/counter-increment')
  async increment(session: Session) {
    this.counter++;
    session.respond(`Counter: ${this.counter}`, 'plain');
  }

  @Get('/counter-get')
  async getCount(session: Session) {
    session.respond(`Current count: ${this.counter}`, 'plain');
  }
}
```

</div>
