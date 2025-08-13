# 作为组件使用

作为一个 Web 开发框架，Yumeri 框架不会也不可能不允许开发者将它作为一个独立组件调用。接下来的部分，就是当你对 Node.js 有着足够的经验后，如何将 Yumeri 框架作为一个组件使用的教程。

## 安装

首先，你需要安装 Yumeri 框架。你可以使用 npm 或者 yarn 来安装：

```bash
npm install yumeri
# or
yarn add yumeri
```
要让框架正常工作，server 插件是少不了的：
```bash
npm install yumeri-plugin-server
# or
yarn add yumeri-plugin-server
```

## 调用

安装完成后，你就可以在你的 Node.js 项目中调用 Yumeri 框架了。以下是一个最简的示例：
```typescript
import { Core, Loader, Context, Config } from 'yumeri';
import * as server from 'yumeri-plugin-server';
const loader = new Loader()
const core = new Core(loader)
const ctx = new Context(core, 'MyAPP')
const serverconfig = new Config('server', {
    port: 8080,
    host: '0.0.0.0'
})
server.apply(ctx, serverconfig)
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
const core = new Core(loader)
const ctx = new Context(core, 'MyAPP')
const serverconfig = new Config('server', {
    port: 8080,
    host: '0.0.0.0'
})
server.apply(ctx, serverconfig)
ctx.route('/hello')
    .action(async (session, _) => {
    session.body = 'Hello, Yumeri!'
})
```
写好代码并编译运行，打开监听地址/hello，浏览器就会显示“Hello, Yumeri!”，是不是很简单？