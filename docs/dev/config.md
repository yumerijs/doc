# 配置构型

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 配置系统概述

Yumeri框架通过 `Schema` 定义插件的配置结构，并在加载插件时自动注入解析后的配置对象（包含默认值）。

## 定义 Schema

无论使用哪种 API 模式，你都需要定义一个 `config` 导出项（类型为 `Schema`）：

```ts
import { Schema } from 'yumeri'

export interface MyConfig {
  port: number;
}

export const config: Schema<MyConfig> = Schema.object({
  port: Schema.number('监听端口').default(14510),
});
```

## 获取配置内容

解析后的配置会根据你选择的 API 模式注入到不同位置：

<div class="functional-api">

在函数式模式下，配置作为 `apply` 函数的第二个参数：

```typescript
export async function apply(ctx: Context, config: MyConfig) {
  console.log(config.port);
}
```

</div>

<div class="decorator-api">

在装饰器模式下，配置作为 `constructor` 的第二个参数：

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

## Schema 常用方法

- `Schema.string/number/boolean`：基础类型
- `Schema.array(inner)`：数组类型
- `Schema.object(properties)`：对象类型
- `Schema.enum(values)`：枚举类型
- `schema.required()`：设为必填
- `schema.default(value)`：设置默认值

## 最佳实践

1. **设置合理的默认值**：减少用户的配置负担。
2. **结构化配置**：对于复杂的插件，使用对象嵌套来组织配置项。
3. **类型安全**：始终为配置定义接口，并将其传给 `Schema<T>` 以获得更好的开发体验。
