# 配置构型

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 配置系统概述

Yumeri框架提供了强大而灵活的配置系统，允许开发者定义和管理插件配置。配置由 `Schema` 描述结构，实际注入到插件 `apply(ctx, config)` 中的是普通对象。

## 当前的 Schema 定义方式（推荐）

现版本使用 `Schema` 类来定义配置结构，`ConfigSchema` 只是 `Schema` 的别名（`export { Schema as ConfigSchema }`）。在插件中推荐直接使用 `Schema`：

```ts
import { Schema } from 'yumeri'

export interface MyPluginConfig {
  port: number
  host: string
  enableCache: boolean
  roles: string[]
  database: {
    url: string
    poolSize: number
  }
}

export const config: Schema<MyPluginConfig> = Schema.object({
  port: Schema.number('监听端口').default(14510),
  host: Schema.string('监听地址').default('0.0.0.0'),
  enableCache: Schema.boolean('是否启用缓存').default(false),
  roles: Schema.array(Schema.string(), '角色列表').default(['user']),
  database: Schema.object({
    url: Schema.string('数据库连接').required(),
    poolSize: Schema.number('连接池大小').default(10),
  }, '数据库配置'),
})
```

常用方法：

- `Schema.string/number/boolean`：基础类型
- `Schema.array(inner)`：数组类型
- `Schema.object(properties)`：对象类型
- `Schema.enum(values)`：枚举类型
- `Schema.extend(base, extension)`：扩展已有对象 Schema
- `schema.required()`：必填
- `schema.default(value)`：默认值

配置读取时会自动应用默认值（`fallback` 机制），插件 `apply(ctx, config)` 中接收到的是普通对象：

```ts
export async function apply(ctx, config: MyPluginConfig) {
  // config 已包含默认值
  const { port, database } = config
}
```

## 配置文件示例（YAML格式）

```yaml
# config.yml
plugins:
  yumeri-plugin-example:
    port: 8080
    host: '0.0.0.0'
    database:
      url: 'mongodb://localhost:27017/myapp'
      poolSize: 20
    roles:
      - user
      - admin
    enableCache: true
```

## 最佳实践

1. **提供清晰的描述**：为每个配置项提供清晰的描述，帮助用户理解配置项的用途。

2. **设置合理的默认值**：为非必需的配置项设置合理的默认值，减少用户配置的复杂度。

3. **使用枚举限制选项**：对于有限选项的配置项，使用枚举限制可选值，避免用户输入错误。

4. **结构化配置**：使用对象和数组组织相关的配置项，使配置结构更清晰。

5. **类型安全**：使用泛型约束配置对象类型，减少运行时错误。

## 注意事项

1. Yumeri 当前的配置校验还未完全成熟，请等待后续更改。

2. 配置系统支持从 Schema 中获取默认值，如果配置内容中没有指定值，将使用 Schema 中的默认值。

3. 由于框架处于快速迭代阶段，配置 API 可能会发生变化，请以最新代码为准。
