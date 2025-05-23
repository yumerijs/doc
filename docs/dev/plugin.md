# 插件基础

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 创建一个插件

在`plugins`文件夹下新建一个以"yumeri-plugin-"开头的文件夹，进入后使用`npm init`初始化node项目，然后在项目根使用`npm install yumeri`安装yumerijs及其依赖。

打开yumeri开发项目的`config.yml`，在插件配置后面加上自己的插件，重启yumeri便可加载了。

## 编写你的插件

在插件的`src`目录下新建`index.ts`，在其中输入以下内容：

```typescript
import { Context, Config, Session } from 'yumeri';

export async function apply(ctx: Context, config: Config) {
  // 加载插件时执行的操作
  ctx.command('foo')
    .action(async (session: Session, param?: any) => {
      session.setMime('text');
      session.body = `<h1>This is my plugin</h1>
<h2>welcome!</h2>`;
    });
}

export async function disable(ctx: Context) {
  // 卸载插件时执行的操作
}
```

重启yumeri以运行，打开yumeri监听地址+/foo，你将会看到：This is myplugin welcome!

恭喜你，你运行了你的第一个插件。

## 插件结构详解

一个标准的Yumeri插件通常包含以下文件和目录：

```
yumeri-plugin-example/
├── src/
│   ├── index.ts        # 插件入口
├── package.json        # 包信息
└── tsconfig.json       # TypeScript配置
```

### 插件入口文件

插件的入口文件（编译后通常是是`dist/index.js`）可以导出两个函数：

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

## 核心API

### Context对象

`Context`对象是Yumeri插件系统的重要组成部分，提供了对于Core的注册命令、中间件和事件监听等功能的封装：

```typescript
interface Context {
  // 注册命令
  command(name: string): Command;
  
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
  
  // 响应体
  body: any;
  
  // 其他属性和方法...
}
```

## 注册命令

命令是Yumeri插件的核心功能之一，用于处理特定的请求路径：

```typescript
ctx.command('hello')
  .action(async (session: Session, param?: any) => {
    session.setMime('text');
    session.body = 'Hello, World!';
  });
```

上面的代码注册了一个名为`hello`的命令，当访问`/hello`路径时，会返回"Hello, World!"。

## 插件开发最佳实践

1. **命名规范**：插件名称应以`yumeri-plugin-`开头，便于识别
2. **版本管理**：使用语义化版本控制，明确标注与Yumeri核心的兼容性
3. **错误处理**：妥善处理可能出现的错误，避免影响整个应用
4. **资源清理**：在`disable`函数中清理所有资源，避免内存泄漏
5. **文档完善**：为插件提供清晰的文档，包括安装、配置和使用方法

## 示例：创建一个计数器插件

以下是一个简单的计数器插件示例：

```typescript
import { Context, Config, Session } from 'yumeri';

let counter = 0;

export async function apply(ctx: Context, config: Config) {
  // 注册增加计数的命令
  ctx.command('counter-increment')
    .action(async (session: Session) => {
      counter++;
      session.setMime('text');
      session.body = `Counter: ${counter}`;
    });
  
  // 注册获取计数的命令
  ctx.command('counter-get')
    .action(async (session: Session) => {
      session.setMime('text');
      session.body = `Current count: ${counter}`;
    });
}

export async function disable(ctx: Context) {
  // 清理资源
  delete counter;
}
```

这个插件提供了两个命令：
- `/counter-increment`：增加计数并返回当前值
- `/counter-get`：获取当前计数值
