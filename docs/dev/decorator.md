# 装饰器 API

> **重要提示**：使用装饰器 API 需要在 `tsconfig.json` 中开启 `experimentalDecorators`。

## 简介

装饰器 API 提供了一种更具声明性的方式来编写插件。它基于类（Class）结构，由 `@Plugin` 核心装饰器自动处理路由注册、事件监听、钩子挂载以及依赖注入。

## 装饰器分类

### 1. 类装饰器
* **@Plugin**：核心装饰器。将一个类标记为 Yumeri 插件。

### 2. 路由处理装饰器 (Method)
* **@Get(path), @Post(path), @Put(path), @Patch(path), @Delete(path), @Head(path)**：定义不同 HTTP 方法的路由。
* **@Use(...middlewares)**：为特定路由方法添加中间件。
* **@Host(host)**：限制路由仅在特定域名/主机下生效。

### 3. 事件与钩子装饰器 (Method)
* **@On(event)**：注册事件监听器。
* **@Hook(name, hookname)**：注册插件钩子。

### 4. 依赖注入装饰器 (Property)
* **@Inject(name?)**：属性注入。自动从 `ctx.component` 中取出对应的组件。如果未提供 `name`，则默认使用属性名作为组件名。

## 依赖声明

**注意**：虽然可以使用 `@Inject` 进行属性注入，但你仍然需要在插件入口处导出一个 `depend` 数组来声明依赖，以保证加载顺序。

```typescript
export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject()
  database: any;
}
```

## 使用示例

```typescript
import { Session, Context } from 'yumeri';
import { Plugin, Get, Inject, On, Use } from '@yumerijs/decorator';

// 显式声明依赖
export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject()
  database: any;

  @On('request:start')
  onStart() {
    console.log('请求开始');
  }

  @Get('/hello')
  async sayHello(session: Session) {
    session.respond('Hello World', 'plain');
  }
}
```
