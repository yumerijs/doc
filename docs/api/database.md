# Database 通用接口（最新）

> 通用数据库操作接口，支持增删查改、建表扩展、索引定义以及 upsert 等高级功能。  
> 可由 MySQL 或 SQLite 插件实现，使用时请从 `@yumerijs/types` 导入类型并获取组件（建议类型断言）。

## 接口定义：`Database`

### `extend&lt;K extends keyof Tables&gt;(table: K, schema: Schema&lt;Partial&lt;Tables[K]&gt;&gt;, indexes?: IndexDefinition&lt;Tables[K]&gt;): Promise&lt;void&gt;`
扩展或创建表结构。

- 参数：
  - table: 表名
  - schema: 字段定义
  - indexes?: 索引定义（主键、唯一键、外键等）
- 返回：无

### `create&lt;K extends keyof Tables&gt;(table: K, data: Partial&lt;Tables[K]&gt;): Promise&lt;Tables[K]&gt;`
在表中插入一条新记录。

- 参数：
  - table: 表名
  - data: 插入数据对象
- 返回：插入后的完整记录

### `select&lt;K extends keyof Tables, F extends keyof Tables[K]&gt;(table: K, query: Query&lt;Tables[K]&gt;, fields?: F[]): Promise&lt;Pick&lt;Tables[K], F&gt;&gt;[]`
查询多条记录，可选择字段。

- 参数：
  - table: 表名
  - query: 查询条件
  - fields?: 返回字段列表
- 返回：符合条件的记录数组

### `selectOne&lt;K extends keyof Tables, F extends keyof Tables[K]&gt;(table: K, query: Query&lt;Tables[K]&gt;, fields?: F[]): Promise&lt;Pick&lt;Tables[K], F&gt; | undefined&gt;`
查询符合条件的第一条记录。

- 参数同 select
- 返回：单条记录或 undefined

### `update&lt;K extends keyof Tables&gt;(table: K, query: Query&lt;Tables[K]&gt;, data: UpdateData&lt;Partial&lt;Tables[K]&gt;&gt;): Promise&lt;number&gt;`
更新符合条件的记录。

- 参数：
  - table: 表名
  - query: 查询条件
  - data: 更新数据（支持 $inc 操作）
- 返回：受影响的记录数量

### `remove&lt;K extends keyof Tables&gt;(table: K, query: Query&lt;Tables[K]&gt;): Promise&lt;number&gt;`
删除符合条件的记录。

- 参数：
  - table: 表名
  - query: 查询条件
- 返回：删除的记录数量

### `upsert&lt;K extends keyof Tables&gt;(table: K, data: Partial&lt;Tables[K]&gt;[], key: keyof Tables[K] | (keyof Tables[K])[], update?: UpdateData&lt;Partial&lt;Tables[K]&gt;&gt;): Promise&lt;void&gt;`
插入或更新记录（冲突时按指定 key 更新）。

- 参数：
  - table: 表名
  - data: 数据数组
  - key: 唯一键字段，用于冲突判断
  - update?: 冲突时更新字段（不提供则用 data 更新）
- 返回：无

### `drop&lt;K extends keyof Tables&gt;(table: K): Promise&lt;void&gt;`
删除表。

- 参数：
  - table: 表名
- 返回：无

### SQL 原生接口
- run(sql: string, params?: any[]): Promise&lt;any&gt;
- get(sql: string, params?: any[]): Promise&lt;any&gt;
- all(sql: string, params?: any[]): Promise&lt;any[]&gt;

### close(): Promise&lt;void&gt;
关闭数据库连接。

## 类型定义说明

Tables
```ts
export interface Tables { }
```

FieldType
```ts
'string' | 'text' | 'json' | 'integer' | 'unsigned' | 'bigint' | 'float' | 'double' | 'decimal' | 'boolean' | 'date' | 'time' | 'timestamp'
```

FieldDefinition
```ts
export interface FieldDefinition {
  type: FieldType;
  length?: number;
  precision?: number;
  scale?: number;
  autoIncrement?: boolean;
  initial?: any;
  nullable?: boolean;
  legacy?: string[];
}
```

Schema&lt;T&gt;
```ts
export type Schema&lt;T&gt; = { [K in keyof T]?: FieldType | FieldDefinition } & { [key: string]: FieldType | FieldDefinition };
```

IndexDefinition&lt;T&gt;
```ts
export interface IndexDefinition&lt;T&gt; {
  primary?: keyof T | (keyof T)[];
  autoInc?: boolean;
  unique?: (keyof T | (keyof T)[])[];
  foreign?: { [K in keyof T]?: [keyof Tables, string] };
}
```

Query&lt;T&gt;
```ts
export type Query&lt;T = any&gt; = {
  [K in keyof T]?: T[K] | Operator&lt;T[K]&gt;;
} & {
  $or?: Query&lt;T&gt;[];
  $and?: Query&lt;T&gt;[];
};
```

UpdateData&lt;T&gt;
```ts
export type UpdateData&lt;T&gt; = { [K in keyof T]?: T[K] | { $inc: number } };
```

Operator&lt;T&gt;
```ts
export interface Operator&lt;T&gt; {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
}
```  