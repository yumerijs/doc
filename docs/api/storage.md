# Storage API

## 概述

Storage 是 Yumeri 提供的数据存储抽象接口，用于为 Session 提供底层存储能力。

框架默认使用 `MemoryStorage` 作为存储实现，并通过 `SessionStorageProcessor` 完成 Session 数据的读写。

开发者可以实现自己的 `Storage` 接口，并通过 `Core.setStorage()` 替换默认存储。

---

# MaybePromise

## 类型定义

```typescript
export type MaybePromise<T> = T | Promise<T>;
```

用于表示接口既支持同步实现，也支持异步实现。

---

# Storage

## 接口定义

```typescript
export interface Storage<T = any> {
    get(key: string): MaybePromise<T | undefined | null>;
    set(key: string, value: T): MaybePromise<void>;
    delete(key: string): MaybePromise<void>;
    clear?(): MaybePromise<void>;
}
```

## 方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| get(key) | `MaybePromise<T \| undefined \| null>` | 获取指定键的数据 |
| set(key, value) | `MaybePromise<void>` | 保存数据 |
| delete(key) | `MaybePromise<void>` | 删除指定键 |
| clear() | `MaybePromise<void>` | 清空全部数据（可选实现） |

---

## 自定义 Storage

实现 `Storage` 接口即可作为 SessionStorageProcessor 的底层存储。

```typescript
class RedisStorage implements Storage<any> {

    async get(key: string) {
        return await redis.get(key);
    }

    async set(key: string, value: any) {
        await redis.set(key, value);
    }

    async delete(key: string) {
        await redis.del(key);
    }

    async clear() {
        await redis.flushdb();
    }

}
```

---

# MemoryStorage

## 概述

MemoryStorage 是框架提供的内存存储实现。

## 类定义

```typescript
export class MemoryStorage<T = any> implements Storage<T> {

    get(key: string): T | undefined;

    set(key: string, value: T): void;

    delete(key: string): void;

    clear(): void;

}
```

---

# SessionStorageSnapshot

## 概述

SessionStorageSnapshot 表示 Session 在 Storage 中保存的数据结构。

## 接口定义

```typescript
export interface SessionStorageSnapshot {
    sessionid: string;
    data: Record<string, any>;
    createdAt: number;
    updatedAt: number;
    expiresAt?: number | null;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| sessionid | string | Session ID |
| data | `Record<string, any>` | Session 数据 |
| createdAt | number | 创建时间（毫秒时间戳） |
| updatedAt | number | 最后更新时间（毫秒时间戳） |
| expiresAt | number \| null | 过期时间，为 `null` 时表示不过期 |

---

# SessionStorageOptions

## 接口定义

```typescript
export interface SessionStorageOptions {
    keyPrefix?: string;
    ttl?: number;
}
```

## 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| keyPrefix | string | Storage 中保存 Session 时使用的键前缀，默认为 `"session:"` |
| ttl | number | Session 生命周期（毫秒），未设置时不过期 |

---

# SessionStorageProcessor

## 概述

SessionStorageProcessor 用于管理 Session 数据在 Storage 中的读写。

它负责：

- 加载 Session
- 保存 Session
- 删除 Session
- 判断 Session 是否过期

SessionStorageProcessor 使用任意实现了 `Storage` 接口的对象作为底层存储。

---

## 类定义

```typescript
export class SessionStorageProcessor {

    constructor(
        storage?: Storage<SessionStorageSnapshot>,
        options?: SessionStorageOptions
    );

    public setStorage(
        storage: Storage<SessionStorageSnapshot>
    ): void;

    public getStorage(): Storage<SessionStorageSnapshot>;

    public load(
        sessionid: string
    ): Promise<Record<string, any>>;

    public save(
        sessionid: string,
        data: Record<string, any>
    ): Promise<void>;

    public delete(
        sessionid: string
    ): Promise<void>;

    public clear(): Promise<void>;

}
```

---

## 构造函数

```typescript
new SessionStorageProcessor(storage?, options?)
```

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| storage | `Storage<SessionStorageSnapshot>` | 底层存储实现，默认为 `MemoryStorage` |
| options | SessionStorageOptions | 配置项 |

---

## 方法

### `load(sessionid: string): Promise<Record<string, any>>`

读取指定 Session 的数据。

如果 Session 不存在或已过期，则返回空对象 `{}`。

若 Session 已过期，将自动调用 `delete()` 删除对应数据。

#### 参数

- `sessionid`：Session ID

#### 示例

```typescript
const data = await processor.load(session.sessionid);
```

---

### `save(sessionid: string, data: Record<string, any>): Promise<void>`

保存 Session 数据。

如果当前 Session 已存在，则保留原有的 `createdAt`，并更新 `updatedAt` 与 `expiresAt`。

#### 参数

- `sessionid`：Session ID
- `data`：需要保存的数据

#### 示例

```typescript
await processor.save(session.sessionid, {
    userId: 1001
});
```

---

### `delete(sessionid: string): Promise<void>`

删除指定 Session。

#### 参数

- `sessionid`：Session ID

#### 示例

```typescript
await processor.delete(session.sessionid);
```

---

### `clear(): Promise<void>`

清空底层 Storage。

如果当前 Storage 未实现 `clear()`，则不会执行任何操作。

#### 示例

```typescript
await processor.clear();
```

---

### `setStorage(storage: Storage<SessionStorageSnapshot>): void`

设置底层 Storage。

#### 参数

- `storage`：新的 Storage 实现

#### 示例

```typescript
processor.setStorage(new RedisStorage());
```

---

### `getStorage(): Storage<SessionStorageSnapshot>`

获取当前使用的 Storage。

#### 返回值

当前 Storage 实例。

#### 示例

```typescript
const storage = processor.getStorage();
```

---

# 使用示例

## 使用默认存储

```typescript
const processor = new SessionStorageProcessor();

await processor.save("session1", {
    userId: 1
});

const data = await processor.load("session1");
```

---

## 设置过期时间

```typescript
const processor = new SessionStorageProcessor(
    undefined,
    {
        ttl: 30 * 60 * 1000
    }
);
```

---

## 使用自定义 Storage

```typescript
const processor = new SessionStorageProcessor(
    new RedisStorage(),
    {
        keyPrefix: "session:"
    }
);
```

---

## 在 Core 中替换 Storage

Core 默认使用 `SessionStorageProcessor` 管理 Session。

可以直接替换底层 Storage：

```typescript
core.setStorage(new RedisStorage());
```

也可以替换整个 SessionStorageProcessor：

```typescript
const processor = new SessionStorageProcessor(
    new RedisStorage()
);

core.setStorage(processor);
```