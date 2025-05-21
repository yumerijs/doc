# Yumeri 配置构型文档

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 配置系统概述

Yumeri框架提供了强大而灵活的配置系统，允许开发者定义和管理插件配置。配置系统主要由两个核心类组成：`ConfigSchema`（配置模式）和`Config`（配置对象）。

## 配置模式（ConfigSchema）

`ConfigSchema`类用于描述配置项的类型、默认值、描述等信息，是Yumeri配置系统的基础。

### 基本属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `type` | `'string' \| 'number' \| 'boolean' \| 'object' \| 'array'` | 配置项类型 |
| `default` | `any` | 配置项默认值 |
| `description` | `string` | 配置项描述 |
| `required` | `boolean` | 是否必需 |
| `enum` | `any[]` | 枚举值列表（可选项） |
| `items` | `ConfigSchema` | 数组项类型定义（当type为array时使用） |
| `properties` | `Record<string, ConfigSchema>` | 对象属性定义（当type为object时使用） |

### 创建配置模式

可以通过构造函数或静态方法创建配置模式：

```typescript
// 使用构造函数
const schema = new ConfigSchema('string', {
  default: 'default value',
  description: '配置项描述',
  required: true,
  enum: ['option1', 'option2']
});

// 使用静态方法
const stringSchema = ConfigSchema.string({
  default: 'default value',
  description: '字符串配置项',
  required: true,
  enum: ['option1', 'option2']
});

const numberSchema = ConfigSchema.number({
  default: 42,
  description: '数字配置项',
  required: false
});

const booleanSchema = ConfigSchema.boolean({
  default: true,
  description: '布尔配置项'
});
```

### 复杂类型配置模式

#### 对象类型

```typescript
const objectSchema = ConfigSchema.object(
  {
    name: ConfigSchema.string({ required: true }),
    age: ConfigSchema.number({ default: 18 }),
    active: ConfigSchema.boolean({ default: true })
  },
  {
    description: '用户配置',
    required: true
  }
);
```

#### 数组类型

```typescript
const arraySchema = ConfigSchema.array(
  ConfigSchema.string({ enum: ['admin', 'user', 'guest'] }),
  {
    description: '角色列表',
    default: ['user']
  }
);
```

#### 嵌套复杂类型

```typescript
const complexSchema = ConfigSchema.object(
  {
    name: ConfigSchema.string({ required: true }),
    settings: ConfigSchema.object(
      {
        theme: ConfigSchema.string({ default: 'light', enum: ['light', 'dark'] }),
        notifications: ConfigSchema.boolean({ default: true })
      }
    ),
    tags: ConfigSchema.array(
      ConfigSchema.string()
    )
  }
);
```

## 配置对象（Config）

`Config`类用于存储和管理配置内容，提供了获取和设置配置项的方法。

### 基本属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `name` | `string` | 配置名称 |
| `content` | `{ [name: string]: any }` | 配置内容 |
| `schema` | `Record<string, ConfigSchema>` | 配置模式 |

### 创建配置对象

```typescript
// 创建配置对象
const config = new Config(
  'myPlugin',  // 配置名称
  {  // 配置内容
    port: 3000,
    debug: true,
    host: 'localhost'
  },
  {  // 配置模式
    port: ConfigSchema.number({ default: 8080, description: '服务端口' }),
    debug: ConfigSchema.boolean({ default: false, description: '是否开启调试模式' }),
    host: ConfigSchema.string({ default: '127.0.0.1', description: '服务主机' })
  }
);
```

### 获取配置项

使用`get`方法获取配置项值，如果配置项不存在，将返回默认值：

```typescript
// 获取配置项
const port = config.get<number>('port');  // 3000
const debug = config.get<boolean>('debug');  // true
const timeout = config.get<number>('timeout', 5000);  // 5000（使用传入的默认值）
```

### 设置配置项

使用`set`方法设置配置项值：

```typescript
// 设置配置项
config.set('port', 8080);
config.set('debug', false);
```

## 实际应用示例

### 插件配置定义

```typescript
// 定义插件配置模式
const pluginSchema = {
  server: ConfigSchema.object(
    {
      port: ConfigSchema.number({ default: 3000, description: '服务端口' }),
      host: ConfigSchema.string({ default: 'localhost', description: '服务主机' })
    },
    { description: '服务器配置' }
  ),
  database: ConfigSchema.object(
    {
      url: ConfigSchema.string({ required: true, description: '数据库连接URL' }),
      poolSize: ConfigSchema.number({ default: 10, description: '连接池大小' })
    },
    { description: '数据库配置' }
  ),
  features: ConfigSchema.array(
    ConfigSchema.string({ enum: ['auth', 'logging', 'caching'] }),
    { default: ['logging'], description: '启用的功能' }
  ),
  debug: ConfigSchema.boolean({ default: false, description: '调试模式' })
};

// 在插件的apply函数中使用
export async function apply(core: Core, config: Config) {
  // 获取配置项
  const serverPort = config.get<number>('server.port');
  const databaseUrl = config.get<string>('database.url');
  const enabledFeatures = config.get<string[]>('features');
  const isDebug = config.get<boolean>('debug');
  
  // 使用配置项初始化插件
  // ...
}
```

### 配置文件示例（YAML格式）

```yaml
# config.yml
plugins:
  - yumeri-plugin-server:
      server:
        port: 8080
        host: '0.0.0.0'
      database:
        url: 'mongodb://localhost:27017/myapp'
        poolSize: 20
      features:
        - auth
        - logging
        - caching
      debug: true
```

## 最佳实践

1. **提供清晰的描述**：为每个配置项提供清晰的描述，帮助用户理解配置项的用途。

2. **设置合理的默认值**：为非必需的配置项设置合理的默认值，减少用户配置的复杂度。

3. **使用枚举限制选项**：对于有限选项的配置项，使用枚举限制可选值，避免用户输入错误。

4. **结构化配置**：使用对象和数组组织相关的配置项，使配置结构更清晰。

5. **类型安全**：使用泛型获取配置项值，确保类型安全。

## 注意事项

1. 当前版本的Yumeri配置系统已注释掉了配置验证功能，但保留了相关代码结构，未来版本可能会重新启用。

2. 配置系统支持从schema中获取默认值，如果配置内容中没有指定值，将使用schema中的默认值。

3. 由于框架处于快速迭代阶段，配置API可能会发生变化，请以最新代码为准。
