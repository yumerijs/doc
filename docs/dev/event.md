# 事件监听

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 事件系统概述

Yumeri提供了一个强大的事件系统，允许插件监听和响应各种框架事件。通过事件系统，插件可以在不直接依赖其他插件的情况下，对特定操作或状态变化做出响应，从而实现松耦合的模块化设计。

## 事件类型

Yumeri框架内置了多种事件类型，包括但不限于：

- **生命周期事件**：如应用启动、关闭等
- **请求事件**：如请求开始、请求结束等
- **插件事件**：如插件加载、卸载等
- **自定义事件**：开发者可以定义和触发自己的事件

## 监听事件

使用`core.on()`方法注册事件监听器：

```typescript
export async function apply(core: Core, config: Config) {
  // 监听应用启动事件
  core.on('app:start', () => {
    console.log('Application started');
  });
  
  // 监听请求完成事件
  core.on('request:end', (session: Session) => {
    console.log(`Request to ${session.path} completed with status ${session.status}`);
  });
  
  // 其他插件初始化代码...
}
```

## 触发事件

使用`core.emit()`方法触发事件：

```typescript
// 触发自定义事件
core.emit('myPlugin:dataUpdated', { id: 123, name: 'Example' });
```

## 事件监听器的移除

在插件卸载时，应该移除注册的事件监听器，以避免内存泄漏：

```typescript
// 存储事件监听器引用
const listeners = [];

export async function apply(core: Core, config: Config) {
  // 注册事件监听器并存储引用
  const listener = () => console.log('Event triggered');
  core.on('someEvent', listener);
  listeners.push({ event: 'someEvent', listener });
  
  // 其他插件初始化代码...
}

export async function disable(core: Core) {
  // 移除所有注册的事件监听器
  for (const { event, listener } of listeners) {
    core.off(event, listener);
  }
}
```

## 事件传播

Yumeri的事件系统支持事件传播，事件监听器按照注册顺序依次执行：

```typescript
// 第一个监听器
core.on('someEvent', (data) => {
  console.log('First listener:', data);
});

// 第二个监听器
core.on('someEvent', (data) => {
  console.log('Second listener:', data);
});

// 触发事件
core.emit('someEvent', { message: 'Hello' });

// 输出:
// First listener: { message: 'Hello' }
// Second listener: { message: 'Hello' }
```

## 异步事件处理

事件监听器可以是异步函数，但需要注意的是，Yumeri不会等待异步监听器完成后再继续执行：

```typescript
// 异步事件监听器
core.on('someEvent', async (data) => {
  await someAsyncOperation();
  console.log('Async operation completed');
});

// 触发事件
core.emit('someEvent', { message: 'Hello' });
// 代码会立即继续执行，不会等待异步操作完成
```

如果需要等待所有监听器执行完成，可以使用`core.emitAsync()`方法（如果Yumeri提供此方法）：

```typescript
// 触发事件并等待所有监听器执行完成
await core.emitAsync('someEvent', { message: 'Hello' });
// 所有监听器（包括异步监听器）执行完成后才会继续
```

## 事件命名空间

为了避免事件名称冲突，建议使用命名空间前缀：

```typescript
// 使用插件名作为命名空间前缀
core.on('myPlugin:userLoggedIn', (user) => {
  console.log(`User ${user.name} logged in`);
});

core.emit('myPlugin:userLoggedIn', { id: 123, name: 'John' });
```

## 常见用例

### 插件间通信

事件系统是插件间通信的理想方式，无需直接依赖：

```typescript
// 插件A
export async function apply(core: Core, config: Config) {
  // 触发事件
  setInterval(() => {
    core.emit('pluginA:heartbeat', { timestamp: Date.now() });
  }, 5000);
}

// 插件B
export async function apply(core: Core, config: Config) {
  // 监听事件
  core.on('pluginA:heartbeat', (data) => {
    console.log(`Received heartbeat from Plugin A at ${new Date(data.timestamp)}`);
  });
}
```

### 状态变化通知

使用事件系统通知状态变化：

```typescript
// 数据更新时触发事件
function updateData(id, newData) {
  database[id] = newData;
  core.emit('data:updated', { id, data: newData });
}

// 监听数据更新事件
core.on('data:updated', ({ id, data }) => {
  console.log(`Data ${id} updated:`, data);
  // 更新缓存、UI等
});
```

## 最佳实践

1. **命名空间**：使用命名空间前缀避免事件名冲突
2. **文档化**：为插件触发的事件提供清晰的文档，包括事件名称、参数和触发条件
3. **清理资源**：在插件卸载时移除所有注册的事件监听器
4. **错误处理**：在事件监听器中妥善处理错误，避免影响其他监听器
5. **性能考虑**：避免在频繁触发的事件监听器中执行耗时操作

## 注意事项

由于Yumeri目前版本，不支持自动卸载插件注册的事件监听器，因此在插件的`disable`函数中需要手动清理注册的监听器。具体实现方式可能随版本变化，请参考最新的官方文档或源码。

---

请记住，由于Yumeri框架仍在快速迭代中，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准。
