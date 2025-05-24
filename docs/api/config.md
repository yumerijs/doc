# Config API

## 概述

Config 模块是 Yumerijs 框架中负责配置管理的核心组件，包含 `Config` 类和 `ConfigSchema` 类。`Config` 类用于存储和访问配置数据，而 `ConfigSchema` 类用于定义配置的结构、类型和验证规则。这两个类共同提供了类型安全的配置管理能力。

## ConfigSchema 类

`ConfigSchema` 类用于定义配置项的类型、默认值、描述等信息，支持类型验证。

### 类定义

```typescript
export class ConfigSchema {
    public type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    public default?: any;
    public description?: string;
    public required?: boolean;
    public enum?: any[];
    public items?: ConfigSchema;
    public properties?: Record<string, ConfigSchema>;

    constructor(
      type: 'string' | 'number' | 'boolean' | 'object' | 'array',
      options?: {
        default?: any;
        description?: string;
        required?: boolean;
        enum?: any[];
        items?: ConfigSchema;
        properties?: Record<string, ConfigSchema>;
      }
    );
    
    public static string(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema;
    public static number(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema;
    public static boolean(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema;
    public static object(
      properties: Record<string, ConfigSchema>,
      options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>
    ): ConfigSchema;
    public static array(
      items: ConfigSchema,
      options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>
    ): ConfigSchema;
}
```

### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| type | 'string' \| 'number' \| 'boolean' \| 'object' \| 'array' | 配置项类型 |
| default | any | 配置项默认值 |
| description | string | 配置项描述 |
| required | boolean | 是否必需 |
| enum | any[] | 枚举值列表（可选项） |
| items | ConfigSchema | 数组项类型定义（当type为array时使用） |
| properties | Record<string, ConfigSchema> | 对象属性定义（当type为object时使用） |

### 静态方法

#### static string(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema

创建字符串类型配置模式。

**参数：**
- `options` - 配置选项，除type、items和properties外的其他属性

**返回值：**
- `ConfigSchema` - 配置模式对象

**示例：**
```typescript
const nameSchema = ConfigSchema.string({
  description: '用户名',
  required: true
});

const colorSchema = ConfigSchema.string({
  description: '主题颜色',
  default: 'blue',
  enum: ['red', 'green', 'blue', 'yellow']
});
```

#### static number(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema

创建数字类型配置模式。

**参数：**
- `options` - 配置选项，除type、items和properties外的其他属性

**返回值：**
- `ConfigSchema` - 配置模式对象

**示例：**
```typescript
const portSchema = ConfigSchema.number({
  description: '服务器端口',
  default: 3000
});

const levelSchema = ConfigSchema.number({
  description: '日志级别',
  enum: [0, 1, 2, 3],
  default: 1
});
```

#### static boolean(options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema

创建布尔类型配置模式。

**参数：**
- `options` - 配置选项，除type、items和properties外的其他属性

**返回值：**
- `ConfigSchema` - 配置模式对象

**示例：**
```typescript
const debugSchema = ConfigSchema.boolean({
  description: '是否开启调试模式',
  default: false
});

const sslSchema = ConfigSchema.boolean({
  description: '是否启用SSL',
  required: true
});
```

#### static object(properties: Record<string, ConfigSchema>, options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema

创建对象类型配置模式。

**参数：**
- `properties` - 对象属性定义
- `options` - 配置选项，除type、items和properties外的其他属性

**返回值：**
- `ConfigSchema` - 配置模式对象

**示例：**
```typescript
const serverSchema = ConfigSchema.object({
  host: ConfigSchema.string({ default: 'localhost' }),
  port: ConfigSchema.number({ default: 3000 }),
  ssl: ConfigSchema.boolean({ default: false })
}, {
  description: '服务器配置'
});
```

#### static array(items: ConfigSchema, options?: Omit<ConfigSchema, 'type' | 'items' | 'properties'>): ConfigSchema

创建数组类型配置模式。

**参数：**
- `items` - 数组项类型定义
- `options` - 配置选项，除type、items和properties外的其他属性

**返回值：**
- `ConfigSchema` - 配置模式对象

**示例：**
```typescript
const tagsSchema = ConfigSchema.array(
  ConfigSchema.string(),
  {
    description: '标签列表',
    default: []
  }
);

const serversSchema = ConfigSchema.array(
  ConfigSchema.object({
    host: ConfigSchema.string({ required: true }),
    port: ConfigSchema.number({ default: 80 })
  }),
  {
    description: '服务器列表'
  }
);
```

## Config 类

`Config` 类用于存储和访问配置数据，支持类型安全的配置获取和设置。

### 类定义

```typescript
export class Config {
    public name: string;
    public content: { [name: string]: any };
    public schema?: Record<string, ConfigSchema>;

    constructor(name: string, content?: { [name: string]: any }, schema?: Record<string, ConfigSchema>);
    
    public get<T>(key: string, defaultValue?: T): T;
    public set(key: string, value: any): void;
}
```

### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| name | string | 配置名称 |
| content | { [name: string]: any } | 配置内容 |
| schema | Record<string, ConfigSchema> | 配置模式 |

### 方法

#### get<T>(key: string, defaultValue?: T): T

获取配置项值。

**参数：**
- `key: string` - 配置项键名
- `defaultValue?: T` - 默认值

**返回值：**
- `T` - 配置项值

**示例：**
```typescript
// 获取配置项，提供默认值
const port = config.get<number>('port', 3000);
const debug = config.get<boolean>('debug', false);
const apiUrl = config.get<string>('apiUrl', 'https://api.example.com');

// 获取嵌套配置项
const dbHost = config.get<string>('database.host', 'localhost');
```

#### set(key: string, value: any): void

设置配置项值。

**参数：**
- `key: string` - 配置项键名
- `value: any` - 配置项值

**示例：**
```typescript
// 设置配置项
config.set('port', 8080);
config.set('debug', true);
config.set('apiUrl', 'https://api.example.org');

// 设置嵌套配置项
config.set('database.host', '127.0.0.1');
```

## 使用示例

### 定义插件配置模式

```typescript
import { Context, Config, ConfigSchema } from 'yumerijs';

// 导出配置模式
export const schema = {
  apiKey: ConfigSchema.string({
    description: 'API密钥',
    required: true
  }),
  timeout: ConfigSchema.number({
    description: '超时时间(毫秒)',
    default: 3000
  }),
  debug: ConfigSchema.boolean({
    description: '是否开启调试模式',
    default: false
  }),
  server: ConfigSchema.object({
    host: ConfigSchema.string({ default: 'localhost' }),
    port: ConfigSchema.number({ default: 8080 })
  }, {
    description: '服务器配置'
  }),
  allowedOrigins: ConfigSchema.array(
    ConfigSchema.string(),
    {
      description: '允许的来源域名',
      default: ['localhost']
    }
  )
};

// 插件应用函数
export async function apply(ctx: Context, config: Config) {
  // 获取配置项
  const apiKey = config.get<string>('apiKey');
  const timeout = config.get<number>('timeout');
  const debug = config.get<boolean>('debug');
  const serverHost = config.get<string>('server.host');
  const serverPort = config.get<number>('server.port');
  const allowedOrigins = config.get<string[]>('allowedOrigins');
  
  // 使用配置项
  console.log(`API Key: ${apiKey}`);
  console.log(`Timeout: ${timeout}ms`);
  console.log(`Debug Mode: ${debug ? 'Enabled' : 'Disabled'}`);
  console.log(`Server: ${serverHost}:${serverPort}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
}
```

### 在配置文件中使用

```yaml
# config.yml
plugins:
  my-plugin:
    apiKey: "your-api-key-here"
    timeout: 5000
    debug: true
    server:
      host: "api.example.com"
      port: 443
    allowedOrigins:
      - "example.com"
      - "app.example.com"
```

### 动态修改配置

```typescript
export async function apply(ctx: Context, config: Config) {
  // 初始配置
  let timeout = config.get<number>('timeout', 3000);
  
  // 监听配置变更事件
  ctx.on('config-changed', async (newConfig) => {
    // 更新本地配置变量
    timeout = config.get<number>('timeout', 3000);
    console.log(`Timeout updated to ${timeout}ms`);
  });
  
  // 动态修改配置
  config.set('timeout', 5000);
  
  // 注册一个修改配置的命令
  ctx.command('set-timeout')
    .action(async (session) => {
      const newTimeout = parseInt(session.query?.value || '3000');
      
      if (isNaN(newTimeout) || newTimeout <= 0) {
        session.status = 400;
        session.body = 'Invalid timeout value';
        session.setMime('text');
        return;
      }
      
      config.set('timeout', newTimeout);
      
      session.body = `Timeout set to ${newTimeout}ms`;
      session.setMime('text');
    });
}
```

## 最佳实践

### 提供完整的配置模式

为插件提供完整的配置模式，包括类型、默认值和描述，这样可以提供更好的开发体验和文档生成：

```typescript
export const schema = {
  // 每个配置项都提供描述和默认值
  apiEndpoint: ConfigSchema.string({
    description: 'API 服务端点',
    default: 'https://api.example.com'
  }),
  maxRetries: ConfigSchema.number({
    description: '最大重试次数',
    default: 3
  })
};
```

### 使用类型安全的配置访问

利用 TypeScript 的类型系统，使用泛型参数指定配置项的类型：

```typescript
// 明确指定类型
const port = config.get<number>('port');
const apiKey = config.get<string>('apiKey');
const features = config.get<string[]>('features');

// 使用类型推断
function setupServer(port: number) {
  // ...
}

// TypeScript 会自动推断 port 为 number 类型
setupServer(config.get('port'));
```

### 配置验证和错误处理

在使用配置前进行验证，确保必要的配置项存在：

```typescript
export async function apply(ctx: Context, config: Config) {
  const apiKey = config.get<string>('apiKey');
  
  if (!apiKey) {
    ctx.getCore().logger.error('Missing required configuration: apiKey');
    throw new Error('Missing required configuration: apiKey');
  }
  
  // 继续使用配置
}
```
