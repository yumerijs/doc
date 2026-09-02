# Hook System

The hook system allows you to insert functionality or content into specific locations (Hook Points).

## Registering Hooks

<div class="functional-api">

```typescript
ctx.hook('pointName', 'hookName', (arg1) => {
  return 'result';
});
```

</div>

<div class="decorator-api">

Use the `@Hook` decorator:

```typescript
import { Plugin, Hook } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  @Hook('console', 'home')
  renderIcon() {
    return '<i>icon</i>';
  }
}
```

</div>

## Executing Hooks

```typescript
const result: any[] = await ctx.excuteHook('pointName', arg1);
```
