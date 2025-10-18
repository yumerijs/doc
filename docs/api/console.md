# Console API

## 概述
`console` 是 **Yumeri** 框架的内置控制台组件，用于管理控制台页面、插件配置界面与登录状态。  
通过 `ctx.getComponent('console')` 获取该组件后，可以安全地注册、移除控制台项，并检测管理员登录状态。  

控制台插件为框架运行时的重要组成部分，请勿直接禁用或卸载。

---

## 获取组件

```ts
const console = ctx.getComponent('console');
```

返回值：`ConsoleComponent` 实例。

---

## 类定义

```ts
export interface ConsoleComponent {
  addconsoleitem(name: string, icon: string, displayname: string, htmlpath: string, staticpath: string): void;
  removeconsoleitem(name: string): void;
  getloginstatus(session: Session): boolean;
}
```

---

## 方法

### addconsoleitem(name: string, icon: string, displayname: string, htmlpath: string, staticpath: string): void
注册一个新的控制台项。

**参数：**

| 参数名 | 类型 | 描述 |
|--------|------|------|
| name | string | 控制台项唯一标识 |
| icon | string | 控制台图标（FontAwesome 类名，如 `"fa-cog"`） |
| displayname | string | 控制台显示名称 |
| htmlpath | string | 控制台页面 HTML 文件路径 |
| staticpath | string | 控制台静态资源目录路径 |

**示例：**
```ts
const console = ctx.getComponent('console');
console.addconsoleitem(
  'config',
  'fa-cog',
  '配置',
  path.join(__dirname, 'static/config.html'),
  path.join(__dirname, 'static/config')
);
```

---

### removeconsoleitem(name: string): void
移除已注册的控制台项。

**参数：**

| 参数名 | 类型 | 描述 |
|--------|------|------|
| name | string | 控制台项标识 |

**示例：**
```ts
const console = ctx.getComponent('console');
console.removeconsoleitem('config');
```

---

### getloginstatus(session: Session): boolean
获取当前 Session 是否已登录控制台。

**参数：**

| 参数名 | 类型 | 描述 |
|--------|------|------|
| session | Session | 当前会话对象 |

**返回值：**

| 类型 | 描述 |
|------|------|
| boolean | 是否处于登录状态 |

**示例：**
```ts
const console = ctx.getComponent('console');
if (console.getloginstatus(session)) {
  session.body = '欢迎回来，管理员！';
}
```

---

## 使用示例

```ts
import { Context, Config } from 'yumeri';
import path from 'path';

export async function apply(ctx: Context, config: Config) {
  const console = ctx.getComponent('console');

  console.addconsoleitem(
    'dashboard',
    'fa-home',
    '仪表盘',
    path.join(__dirname, 'static/dashboard.html'),
    path.join(__dirname, 'static/dashboard')
  );
}
```

---

## 注意事项
- `console` 是 Yumeri 的核心组件，不可卸载；
- 控制台页面必须位于插件的静态目录下；
- 所有控制台项名称应唯一；
- `addconsoleitem()` 与 `removeconsoleitem()` 可在插件初始化阶段调用；
- 若插件需判断用户登录状态，应使用 `getloginstatus()` 而非自行维护认证。
```