# Decorator API

> **Note**: To use the Decorator API, you must enable `experimentalDecorators` in your `tsconfig.json`.

## Introduction

The Decorator API provides a more declarative way to write plugins. It is based on a Class structure, where the `@Plugin` decorator automatically handles route registration, event listening, hook mounting, and dependency injection.

## Decorator Categories

### 1. Class Decorator
* **@Plugin**: The core decorator. Marks a class as a Yumeri plugin.

### 2. Routing Decorators (Method)
* **@Get(path), @Post(path), @Put(path), @Patch(path), @Delete(path), @Head(path)**: Define routes for different HTTP methods.
* **@Use(...middlewares)**: Add middleware to a specific route.
* **@Host(host)**: Restrict the route to a specific domain/host.

### 3. Event & Hook Decorators (Method)
* **@On(event)**: Register an event listener. e.g., `@On('request:start')`.
* **@Hook(point, name)**: Register a plugin hook. e.g., `@Hook('console', 'home')`.

### 4. Dependency Injection (Property)
* **@Inject(name?)**: Property injection. Automatically retrieves the component from `ctx.component`. Uses the property name if `name` is omitted.

## Dependency Declaration

Even with `@Inject`, you must export a `depend` array at the top level of your plugin entry to ensure correct loading order.

```typescript
export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject()
  database: any;
}
```

## Example Usage

```typescript
import { Session, Context } from 'yumeri';
import { Plugin, Get, Inject, On, Use } from '@yumerijs/decorator';

export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject()
  database: any;

  @On('request:start')
  onStart() {
    console.log('Request started');
  }

  @Get('/hello')
  async sayHello(session: Session) {
    session.respond('Hello World', 'plain');
  }
}
```

## Response Standard

Always use `session.respond(content, type)` to send a response. `type` must be either `'plain'` or `'html'`.
