# 作为组件使用

作为一个 Web 开发框架，Yumeri 框架不会也不可能不允许开发者将它作为一个独立组件调用。接下来的部分，就是当你对 Node.js 有着足够的经验后，如何将 Yumeri 框架作为一个组件使用的教程。

## 安装

首先，你需要安装 Yumeri 框架。你可以使用 npm 或者 yarn 来安装：

```bash
npm install yumeri
# or
yarn add yumeri
```

## 调用

安装完成后，你就可以在你的 Node.js 项目中调用 Yumeri 框架了。以下是一个最简的示例：
```typescript
import { Core, Loader, Context, Config } from 'yumeri';
import * as server from 'yumeri-plugin-server';
const loader = new Loader()  // 此时加载器并没有实际作用
const serverconfig = {
    port: 8080,
    host: '0.0.0.0'
}
const core = new Core(loader, serverconfig)
const ctx = new Context(core, 'MyAPP')
core.runCore()
```
不出所料，你的日志应该会输出这样的一行：
```bash
2025/08/13 20:26:36 [I] server Yumeri Server listening on 0.0.0.0:8080
```
恭喜你，你已经成功地将 Yumeri 框架作为一个组件调用了。

## 注册路由

插件注册路由的方式一般是使用 ctx.route，如果作为组件调用，没有插件这种东西，该怎么办呢？很简单，别忘了在上述代码当中，我们为整个 APP 创建了一个名为 MyAPP 的 Context 上下文对象。通过它，我们就可以像编写插件一样注册路由：
```typescript
import { Core, Loader, Context, Config } from 'yumeri';
import * as server from 'yumeri-plugin-server';
const loader = new Loader()
const serverconfig = {
    port: 8080,
    host: '0.0.0.0'
}
const core = new Core(loader, serverconfig)
const ctx = new Context(core, 'MyAPP')
core.runCore()
ctx.route('/hello')
    .action(async (session, _) => {
    session.body = 'Hello, Yumeri!'
})
```
写好代码并编译运行，打开监听地址/hello，浏览器就会显示“Hello, Yumeri!”，是不是很简单？

## 启动多个服务器

Yumeri 提供了一插件多开的功能，基于此，你可以实现同时开启多个应用实例。

> 为防止串路由，建议同时开启多个 Core 实例

```typescript
import { Core, Loader, Context, Config } from 'yumeri';
import * as server from 'yumeri-plugin-server';
const loader = new Loader()
// 第一个 Core 实例
const serverconfig = {
    port: 8080,
    host: '0.0.0.0'
}
const core = new Core(loader, serverconfig)
const ctx = new Context(core, 'MyAPP')
let count = 0
core.runCore()
// 第二个 Core 实例
const serverconfig2 = {
    port: 8081,
    host: '0.0.0.0'
}
const core2 = new Core(loader, serverconfig2)
const ctx2 = new Context(core2, 'MyAPP2')
core2.runCore()
// 第一个hello路由
ctx.route('/hello')
    .action(async (session, _) => {
    session.body = 'Hello, Yumeri!'
})
// 第二个hello路由
ctx2.route('/hello')
    .action(async (session, _) => {
    session.body = 'Hello, Yumeri2!'
})
```
此时访问两个监听地址，浏览器会分别显示“Hello, Yumeri!”和“Hello, Yumeri2!”