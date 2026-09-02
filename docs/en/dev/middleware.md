# Middleware

Middleware allows developers to insert custom logic into the request processing flow. It follows the "Onion Model".

## Creating Middleware

Middleware is an asynchronous function that accepts `session` and `next`:

```typescript
type Middleware = (session: Session, next: () => Promise<void>) => Promise<void>;
```

## Registration

<div class="functional-api">

```typescript
export async function apply(ctx: Context) {
  ctx.use(myMiddleware); // Global
  
  ctx.route('/foo')
     .use(authMiddleware) // Route-specific
     .action(...)
}
```

</div>

<div class="decorator-api">

Use the `@Use` decorator for route-specific middleware:

```typescript
import { Plugin, Get, Use } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  @Get('/admin')
  @Use(authMiddleware)
  async admin(session: Session) {
    session.respond('Secret', 'plain');
  }
}
```

Global middleware should still be registered in the `constructor` via `ctx.use()`.

</div>

## Response Note

Do not set `session.body` directly. Always use `session.respond(content, type)` to send a response.
