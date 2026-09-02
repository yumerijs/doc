# Event Listening

## Listening to Events

<div class="functional-api">

```typescript
export async function apply(ctx: Context) {
  ctx.on('app:start', () => {
    console.log('App started');
  });
}
```

</div>

<div class="decorator-api">

Use the `@On` decorator:

```typescript
import { Plugin, On } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  @On('app:start')
  onStart() {
    console.log('App started');
  }
}
```

</div>
