# Config Structure

Yumeri uses `Schema` to define the configuration structure for plugins. The parsed configuration (with default values) is automatically injected during plugin loading.

## Defining a Schema

Regardless of the API mode, you need to define a `config` export of type `Schema`:

```ts
import { Schema } from 'yumeri'

export interface MyConfig {
  port: number;
}

export const config: Schema<MyConfig> = Schema.object({
  port: Schema.number('Listening port').default(14510),
});
```

## Accessing Configuration

<div class="functional-api">

In Functional mode, the config is passed as the second argument to `apply`:

```typescript
export async function apply(ctx: Context, config: MyConfig) {
  console.log(config.port);
}
```

</div>

<div class="decorator-api">

In Decorator mode, the config is passed as the second argument to the `constructor`:

```typescript
import { Plugin } from '@yumerijs/decorator';

@Plugin
export default class MyPlugin {
  constructor(ctx: Context, private config: MyConfig) {
    console.log(this.config.port);
  }
}
```

</div>

## Schema Methods

- `Schema.string/number/boolean`: Basic types
- `Schema.array(inner)`: Array types
- `Schema.object(properties)`: Object types
- `Schema.enum(values)`: Enumerations
- `schema.required()`: Mark as required
- `schema.default(value)`: Set a default value
