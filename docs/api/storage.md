# Storage API

## 概述

Storage 是 Yumeri 会话数据存储的抽象层。它负责把 Session 的快照保存在某种底层介质中，例如内存、Redis、SQLite 或其他数据库实现。

框架默认使用 `MemoryStorage`，而真正的会话读写由 `SessionStorageProcessor` 负责。也就是说：

- `Storage` 是底层存储接口
- `SessionStorageProcessor` 是 Session 级别的读写协调器
- `Core.setStorage()` 可以替换底层存储实现

这个设计让框架适应不同部署场景：本地开发可用内存，生产环境可切换成 Redis 或自定义持久化层。

---

## MaybePromise

```typescript
export type MaybePromise<T> = T | Promise<T>;
```

这里的语义是：方法既支持同步返回，也支持异步返回。这样底层存储可以在不同环境中保持统一接口。

---

## Storage 接口

```ts
export interface Storage<T = any> {
  get(key: string): MaybePromise<T | undefined | null>;
  set(key: string, value: T): MaybePromise<void>;
  delete(key: string): MaybePromise<void>;
  clear?(): MaybePromise<void>;
}
```

### 关键点

- `get()`：读取某个 key 的值
- `set()`：写入某个 key
- `delete()`：删除某个 key
- `clear()`：可选，适合重置全表或全库

这说明 Yumeri 的存储层不是“Session 特有对象”，而是可以复用的通用键值抽象。

---

## 默认实现：MemoryStorage

```ts
export class MemoryStorage<T = any> implements Storage<T> {
  private data = new Map<string, T>();

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}
```

默认行为非常简单：使用 `Map` 保存键值。适合开发环境、单进程调试和实验场景。

---

## SessionSnapshot 结构

Session 在底层存储中不是直接散落的 JSON，而是一个快照对象：

```ts
export interface SessionStorageSnapshot {
  sessionid: string;
  data: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number | null;
}
```

每个字段的含义：

- `sessionid`：会话 id
- `data`：实际保存的数据
- `createdAt`：创建时间戳
- `updatedAt`：上次更新时间戳
- `expiresAt`：过期时间戳；如果为 `null`，则表示不过期

这使得框架可以把 Session 的生命周期和业务数据一起存储，并在读取时判断是否过期。

---

## SessionStorageOptions

```ts
export interface SessionStorageOptions {
  keyPrefix?: string;
  ttl?: number;
}
```

### 参数说明

- `keyPrefix`：保存 Session 时的前缀，默认是 `session:`
- `ttl`：整个 Session 的超时时间，单位毫秒

这意味着你可以像下面这样配置：

```ts
const storage = new SessionStorageProcessor(new MemoryStorage(), {
  keyPrefix: 'app-session:',
  ttl: 30 * 60 * 1000,
})
```

---

## SessionStorageProcessor

SessionStorageProcessor 是 Yumeri 的真正 Session 管理器，它负责：

- 按 `sessionid` 读取数据
- 通过快照保存数据
- 判定是否过期
- 删除 Session
- 允许替换底层 `Storage`

### 关键实现逻辑

```ts
async load(sessionid: string): Promise<Record<string, any>> {
  const snapshot = await this.storage.get(this.getKey(sessionid));
  if (!snapshot) return {};

  if (this.isExpired(snapshot)) {
    await this.delete(sessionid);
    return {};
  }

  return { ...(snapshot.data || {}) };
}
```

```ts
async save(sessionid: string, data: Record<string, any>): Promise<void> {
  const key = this.getKey(sessionid);
  const now = Date.now();
  const current = await this.storage.get(key);
  const createdAt = current && !this.isExpired(current) ? current.createdAt : now;

  const snapshot: SessionStorageSnapshot = {
    sessionid,
    data: { ...(data || {}) },
    createdAt,
    updatedAt: now,
    expiresAt: this.ttl ? now + this.ttl : null,
  };

  await this.storage.set(key, snapshot);
}
```

这说明：

1. 读取时如果过期就直接清理
2. 保存时会维护 `createdAt` / `updatedAt`
3. TTL 是全 Session 生命周期，而不是单个字段级 TTL

---

## 自定义 Storage 的实践

你可以自己实现一个 `Storage`：

```ts
class RedisStorage implements Storage<any> {
  async get(key: string) {
    return await redis.get(key)
  }

  async set(key: string, value: any) {
    await redis.set(key, JSON.stringify(value))
  }

  async delete(key: string) {
    await redis.del(key)
  }

  async clear() {
    await redis.flushdb()
  }
}
```

然后挂到 Context 或 Core：

```ts
const processor = new SessionStorageProcessor(new RedisStorage(), {
  keyPrefix: 'yumeri:',
  ttl: 60 * 60 * 1000,
})

ctx.setStorage(processor)
```

如果你不想替换整个 `SessionStorageProcessor`，也可以直接提供底层存储对象：

```ts
ctx.setStorage(new RedisStorage())
```

因为 `Context.setStorage()` 和 `Core.setStorage()` 都允许直接替换底层存储。

---

## 实际使用建议

1. 开发环境使用默认 `MemoryStorage`，启动快且调试简单。
2. 生产环境优先做持久化存储，以避免进程重启导致 Session 丢失。
3. 若业务有明确会话超时策略，优先使用 `ttl` 来统一控制。
4. 自定义 `Storage` 时，注意 `get()` / `set()` / `delete()` 的幂等性和异常处理。

---

## 相关文档

- [Context 运行时入口](../dev/runtime/context)
- [生命周期与清理](../dev/runtime/lifecycle)
- [插件基础](../dev/plugin)

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