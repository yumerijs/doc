# 事件监听

> **重要提示**：Yumeri 框架目前处于快速迭代阶段，本文档中的 API 可能随时发生变化。

## 监听事件

<div class="functional-api">

使用 `ctx.on()` 方法注册事件监听器：

```typescript
export async function apply(ctx: Context) {
  ctx.on('app:start', () => {
    console.log('Application started');
  });
}
```

</div>

<div class="decorator-api">

使用 `@On` 装饰器监听事件：

```typescript
import { Plugin, On } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  @On('app:start')
  onAppStart() {
    console.log('Application started');
  }

  @On('request:start')
  onRequestStart(session: Session) {
    console.log('Request started:', session.sessionid);
  }
}
```

</div>
