# 钩子系统

## 注册钩子

<div class="functional-api">

```typescript
ctx.hook('pointName', 'hookName', (arg1, arg2) => {
  return 'result';
});
```

</div>

<div class="decorator-api">

使用 `@Hook` 装饰器注册钩子：

```typescript
import { Plugin, Hook } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  @Hook('console', 'home')
  renderHomeIcon() {
    return '<i>icon</i>';
  }
}
```

</div>

## 触发钩子

```typescript
const result: any[] = await ctx.excuteHook('pointName', arg1, arg2);
```
