# 配置构型

> **重要提示**：Yumeri 的配置能力在 3.0 版本后有明显增强，本文档以当前源码实现为准，重点覆盖 `Schema`、默认值、i18n 绑定和插件加载流程。

## 配置系统概述

Yumeri 通过 `Schema` 定义插件配置结构，并在插件加载时自动合并默认值与用户配置。这样开发者既能获得类型安全，也能在控制台、配置编辑器和国际化显示中获得一致的数据结构。

一个典型的插件配置定义如下：

```ts
import { Schema } from 'yumeri'

export interface MyConfig {
  port: number;
  debug: boolean;
}

export const config: Schema<MyConfig> = Schema.object({
  port: Schema.number('监听端口').default(14510),
  debug: Schema.boolean('是否开启调试模式').default(false),
})
```

## 获取配置内容

解析后的配置会按不同 API 模式注入到插件中：

<div class="functional-api">

函数式插件中，配置作为 `apply` 的第二个参数：

```ts
import { Context } from 'yumeri'

export async function apply(ctx: Context, config: MyConfig) {
  console.log(config.port)
}
```

</div>

<div class="decorator-api">

装饰器模式下，配置会传入 `constructor`：

```ts
import { Plugin } from '@yumerijs/decorator'

@Plugin
export default class MyPlugin {
  constructor(ctx: Context, private config: MyConfig) {
    console.log(this.config.port)
  }
}
```

</div>

## Schema 常用方法

- `Schema.string(description?)`：字符串类型
- `Schema.number(description?)`：数字类型
- `Schema.boolean(description?)`：布尔类型
- `Schema.array(inner, description?)`：数组类型
- `Schema.object(properties, description?)`：对象类型
- `Schema.enum(values, description?)`：枚举类型
- `schema.required()`：标记为必填
- `schema.default(value)`：设置默认值
- `schema.key(name)`：绑定一个 i18n key，用于配置字段说明文字的国际化

## i18n 绑定配置说明

3.0 之后，配置项不仅能写 `description`，还支持通过 `key()` 绑定翻译键：

```ts
export const config: Schema<MyConfig> = Schema.object({
  port: Schema.number('监听端口')
    .key('my-plugin.config.port')
    .default(14510),
  debug: Schema.boolean('启用调试模式')
    .key('my-plugin.config.debug')
    .default(false),
})
```

此时在运行时会按当前请求语言优先级尝试解析对应文本；如果没匹配到，则自动回退到原始 `description`。这让控制台配置编辑器与国际化显示行为保持一致，同时不会破坏旧插件的显示逻辑。

## 默认值合并

Yumeri 并不是简单地“覆盖用户配置”，而是会在加载插件时做默认值回填。也就是说：

- 缺失的字段会使用 `default()` 指定的值
- 结构化对象会递归填充
- 数组会按 schema.items 继续回填

```ts
const schema = Schema.object({
  host: Schema.string('主机名').default('localhost'),
  port: Schema.number('端口').default(3000),
})
```

如果用户配置中未提供 `host` 或 `port`，最终拿到的配置对象会自动补齐默认值。

## 进阶实践

### 1. 使用结构化对象进行复杂配置

```ts
export const config = Schema.object({
  database: Schema.object({
    host: Schema.string('数据库地址').default('127.0.0.1'),
    port: Schema.number('数据库端口').default(3306),
  }),
  features: Schema.object({
    cache: Schema.boolean('是否启用缓存').default(true),
  }),
})
```

### 2. 让配置文案支持多语言

```ts
export const config = Schema.object({
  title: Schema.string('页面标题').key('app.config.title').default('Yumeri'),
})
```

### 3. 配置项设计要保持兼容

1. 优先设定合理默认值，减少新用户配置成本。
2. 对复杂结构使用对象嵌套，而不是散乱的顶层字段。
3. 给关键字段提供 `description` 和 `key()`，便于编辑器、日志和国际化统一消费。

## 相关文档

- [插件基础](./plugin)
- [环境搭建](./setup)
- [I18n API](../api/i18n)
