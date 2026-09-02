# Plugin Basics

> **Important**: Yumeri is currently in a rapid iteration phase. APIs in this document are subject to change.

## Creating a Plugin

In your project root, run `yarn setup <plugin-name>`. Follow the prompts to enter a description, and the script will automatically create a plugin structure.

## Writing Your Plugin

Locate `src/index.ts` in your plugin directory and enter the following:

<div class="functional-api">

```typescript
import { Context, Config, Session } from 'yumeri';

// Declare dependencies
export const depend = ['database'];

export async function apply(ctx: Context, config: Config) {
  ctx.route('/foo')
    .action(async (session: Session, _) => {
      session.respond(`<h1>This is my plugin</h1>`, 'html');
    });
}

export async function disable(ctx: Context) {
  // Cleanup logic
}
```

</div>

<div class="decorator-api">

```typescript
import { Session, Context } from 'yumeri';
import { Plugin, Get, Inject } from '@yumerijs/decorator';

// Declare dependencies
export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject('database')
  db: any;

  constructor(_ctx: Context, _config: any) {}

  @Get('/foo')
  async action(session: Session) {
    session.respond(`<h1>This is my plugin</h1>`, 'html');
  }
}
```

</div>

## Plugin Structure

```text
yumeri-plugin-example/
├── src/
│   ├── index.ts        # Entry point
├── package.json        # Package info
└── tsconfig.json       # TypeScript config
```

## Dependency Management

If your plugin relies on components provided by other plugins, you must export a `depend` array in your entry file.

```typescript
export const depend = ['database', 'logger'];
```

**This is required even if you use the `@Inject` decorator**. It ensures that Yumeri loads plugins in the correct order, guaranteeing that the target component is ready before injection.

## Best Practices

1. **Naming**: Plugin names should start with `yumeri-plugin-`.
2. **Error Handling**: Gracefully handle errors to avoid crashing the application.
3. **Resource Cleanup**: Ensure all resources are cleaned up in the `disable` function or during unregistration.
