# Database 通用接口

> 这是一个通用数据库操作接口定义，支持基础的增删查改，以及自动建表、更新结构等功能。目前可由mysql和sqlite插件实现，使用时需要从包@yumerijs/types导入类型并获取组件（建议使用类型断言）

## 接口定义：`Database`

---

### `runSQL(sql: string, params?: any[]): Promise<{ insertId?: number; affectedRows?: number }>`
执行任意 SQL 语句，适用于 `INSERT`、`UPDATE`、`DELETE` 等。

- **参数**
  - `sql`: SQL 语句
  - `params`: 可选参数数组（用于预处理语句）
- **返回**
  - 一个对象，包含：
    - `insertId`: 新插入记录的 ID（如果有）
    - `affectedRows`: 受影响的行数

---

### `all(sql: string, params?: any[]): Promise<any[]>`
执行查询并返回所有结果。

- **返回**
  - 包含多行数据的数组。

---

### `get(sql: string, params?: any[]): Promise<any | undefined>`
执行查询并返回第一条记录。

- **返回**
  - 查询结果中的第一条数据，或 `undefined`。

---

### `insert(tableName: string, data: Record<string, any>): Promise<number>`
向指定表插入一条记录。

- **参数**
  - `tableName`: 表名
  - `data`: 要插入的键值对象
- **返回**
  - 新插入记录的 ID。

---

### `batchInsert(tableName: string, dataArray: Record<string, any>[]): Promise<void>`
批量插入多条记录（使用事务保障原子性）。

- **参数**
  - `tableName`: 表名
  - `dataArray`: 多条数据组成的数组

---

### `update(tableName: string, data: Record<string, any>, conditions: Record<string, any>): Promise<void>`
更新指定记录。

- **参数**
  - `tableName`: 表名
  - `data`: 要更新的字段
  - `conditions`: WHERE 条件（键值形式）

---

### `delete(tableName: string, conditions: Record<string, any>): Promise<void>`
删除记录。

- **参数**
  - `tableName`: 表名
  - `conditions`: 删除条件（键值形式）

---

### `find(tableName: string, conditions?: Record<string, any>, options?: any): Promise<any[]>`
查询符合条件的所有记录。

- **参数**
  - `conditions`: 可选，键值形式的过滤条件
  - `options`: 可选，支持分页（`limit`、`offset`）与排序（`orderBy`）
- **返回**
  - 查询结果数组

---

### `findOne(tableName: string, conditions?: Record<string, any>): Promise<any | undefined>`
查询符合条件的第一条记录。

---

### `close(): Promise<void>`
关闭数据库连接池。

---

### `createTable(tableName: string, schema: TableSchema): Promise<void>`
根据结构化定义自动创建表（如果不存在）。

- **参数**
  - `tableName`: 表名
  - `schema`: 表结构定义，详见 `TableSchema`

---

### `updateTableStructure(tableName: string, updates: Partial<TableSchema>): Promise<void>`
更新现有表结构，如新增字段等。

- **参数**
  - `tableName`: 表名
  - `updates`: 更新字段定义

---

### `tableExists(tableName: string): Promise<boolean>`
检查表是否已存在。

---

## 表结构接口：`TableSchema`

```ts
export interface TableSchema {
  [columnName: string]: TableColumn;
}

export interface TableColumn {
  type: string; // 字段类型：如 TEXT、INTEGER、BOOLEAN
  primaryKey?: boolean; // 是否主键
  autoIncrement?: boolean; // 是否自增
  notNull?: boolean; // 是否非空
  default?: any; // 默认值
  comment?: string; // 字段备注
}