# Logger API

## 概述

Logger 类是 Yumerijs 框架中的日志记录组件，提供了简单而统一的日志记录接口。它支持不同级别的日志记录，并自动为每条日志添加时间戳和来源标识。Logger 实例通常在插件初始化时通过 Core 实例获取，或者直接创建新实例。

## 类定义

```typescript
export class Logger {
  private title: string;
  private titleColor: any;

  constructor(title: string);
  
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| title | string | 日志来源标识（私有） |
| titleColor | any | 日志标题颜色（私有） |

## 方法

### constructor(title: string)

创建一个新的日志记录器实例。

**参数：**
- `title: string` - 日志来源标识，通常是插件名称或模块名称

**示例：**
```typescript
// 创建一个新的日志记录器
const logger = new Logger('my-plugin');
```

### info(...args: any[]): void

记录信息级别的日志。

**参数：**
- `...args: any[]` - 要记录的日志内容

**示例：**
```typescript
logger.info('Server started on port', 3000);
logger.info('User logged in:', { id: 123, username: 'admin' });
```

### warn(...args: any[]): void

记录警告级别的日志。

**参数：**
- `...args: any[]` - 要记录的日志内容

**示例：**
```typescript
logger.warn('Deprecated feature used:', 'oldMethod()');
logger.warn('Connection pool running low:', { available: 2, total: 10 });
```

### error(...args: any[]): void

记录错误级别的日志。

**参数：**
- `...args: any[]` - 要记录的日志内容

**示例：**
```typescript
logger.error('Failed to connect to database:', err);
logger.error('API request failed:', { url: '/api/data', status: 500 });
```

## 使用示例

### 在插件中使用 Logger

```typescript
import { Context, Config, Logger } from 'yumerijs';

export async function apply(ctx: Context, config: Config) {
  // 获取 Core 实例的 logger
  const coreLogger = ctx.getCore().logger;
  
  // 或创建插件专用的 logger
  const logger = new Logger('my-plugin');
  
  // 记录信息日志
  logger.info('Plugin initialized with config:', config.content);
  
  // 注册命令
  ctx.command('log-test')
    .action(async (session) => {
      // 记录不同级别的日志
      logger.info('Command executed:', session.query);
      
      if (!session.query?.message) {
        logger.warn('Missing message parameter');
        session.status = 400;
        session.body = 'Missing message parameter';
        session.setMime('text');
        return;
      }
      
      try {
        // 执行某些操作
        const result = await someOperation(session.query.message);
        logger.info('Operation result:', result);
        
        session.body = { success: true, result };
        session.setMime('json');
      } catch (err) {
        logger.error('Operation failed:', err);
        
        session.status = 500;
        session.body = { success: false, error: err.message };
        session.setMime('json');
      }
    });
}

async function someOperation(message) {
  // 模拟操作
  if (message === 'error') {
    throw new Error('Simulated error');
  }
  return { processed: message.toUpperCase() };
}
```

### 在不同模块中使用 Logger

```typescript
// database.ts
import { Logger } from 'yumerijs';

export class Database {
  private logger: Logger;
  private connection: any;
  
  constructor() {
    this.logger = new Logger('database');
  }
  
  async connect(connectionString: string) {
    this.logger.info('Connecting to database...');
    try {
      // 连接数据库的逻辑
      this.connection = await createConnection(connectionString);
      this.logger.info('Database connected successfully');
      return true;
    } catch (err) {
      this.logger.error('Failed to connect to database:', err);
      throw err;
    }
  }
  
  async query(sql: string, params: any[]) {
    this.logger.info('Executing query:', sql);
    try {
      const result = await this.connection.query(sql, params);
      this.logger.info('Query executed successfully, rows:', result.rowCount);
      return result;
    } catch (err) {
      this.logger.error('Query execution failed:', err);
      throw err;
    }
  }
}
```

### 记录复杂对象

```typescript
// 记录对象
const user = {
  id: 123,
  username: 'admin',
  roles: ['admin', 'user'],
  metadata: {
    lastLogin: new Date(),
    loginCount: 42
  }
};

logger.info('User details:', user);

// 记录错误对象
try {
  throw new Error('Something went wrong');
} catch (err) {
  logger.error('Caught an error:', err);
  logger.error('Error stack:', err.stack);
}
```

## 最佳实践

### 为每个模块创建专用的 Logger

为每个模块或功能区域创建专用的 Logger 实例，这样可以更容易地识别日志的来源：

```typescript
// 主插件 logger
const pluginLogger = new Logger('my-plugin');

// 子模块 loggers
const apiLogger = new Logger('my-plugin:api');
const dbLogger = new Logger('my-plugin:database');
const authLogger = new Logger('my-plugin:auth');

// 在相应模块中使用
apiLogger.info('API endpoint called:', endpoint);
dbLogger.info('Database query executed:', query);
authLogger.info('User authenticated:', userId);
```

### 合理选择日志级别

根据信息的重要性和紧急程度选择合适的日志级别：

- **info**: 一般信息，记录正常操作和状态
- **warn**: 警告信息，表示潜在问题但不影响正常运行
- **error**: 错误信息，表示发生了影响功能的错误

```typescript
// 信息级别示例
logger.info('Server started on port 3000');
logger.info('User logged in:', userId);
logger.info('Cache refreshed, items:', itemCount);

// 警告级别示例
logger.warn('Deprecated API called:', apiName);
logger.warn('Connection pool running low:', connectionCount);
logger.warn('Rate limit approaching:', { current: 95, limit: 100 });

// 错误级别示例
logger.error('Database connection failed:', err);
logger.error('API request failed:', { url, status, response });
logger.error('Authentication failed for user:', userId);
```

### 结构化日志内容

使用结构化的方式记录日志，便于后续分析和处理：

```typescript
// 不推荐
logger.info('User ' + userId + ' performed action ' + action + ' on resource ' + resourceId);

// 推荐
logger.info('User action:', {
  userId,
  action,
  resourceId,
  timestamp: new Date().toISOString()
});
```

### 避免敏感信息泄露

确保不要在日志中记录敏感信息：

```typescript
// 不安全
logger.info('User login:', { username: 'admin', password: 'secret123' });

// 安全
logger.info('User login:', { username: 'admin', hasPassword: true });
```
