# Routing System

Yumeri's routing system provides a flexible path matching and handling mechanism. You can define routes using the Functional API or Decorator API.

## Registering Routes

<div class="functional-api">

```typescript
ctx.route('/user/:id')
    .action((session, params, id) => {
        session.respond('user id: ' + id, 'plain');
    })
```

</div>

<div class="decorator-api">

```typescript
import { Plugin, Get } from '@yumerijs/decorator';

@Plugin
export default class UserController {
  @Get('/user/:id')
  async getUser(session, params, id) {
    session.respond('user id: ' + id, 'plain');
  }
}
```

</div>

## Routing Rules

- **Path Parameters**: `/user/:id`
- **Optional Parameters**: `/user/:id?`
- **Regex Support**

## Advanced Decorator Usage

You can use a function to dynamically resolve paths or hostnames. The `@Host` decorator is equivalent to the `.host()` method in the Functional API.

<div class="decorator-api">

```typescript
import { Plugin, Get, Host } from '@yumerijs/decorator';

@Plugin
export default class EchoPlugin {
  constructor(_ctx: Context, private config: any) {}

  @Get((plugin: EchoPlugin) => `/${plugin.config.path}`)
  @Host((plugin: EchoPlugin) => plugin.config.host || undefined)
  async echo(session: Session) {
    session.respond('Echo content', 'plain');
  }
}
```

</div>

## Middleware

<div class="functional-api">

```typescript
ctx.route('/user/:id')
    .use(async (session, next) => {
        await next();
    })
    .action(...)
```

</div>

<div class="decorator-api">

```typescript
import { Plugin, Get, Use } from '@yumerijs/decorator';

@Plugin
export default class UserController {
  @Get('/user/:id')
  @Use(myMiddleware)
  async getUser(session: Session) {
    session.respond('Hello', 'plain');
  }
}
```

</div>
