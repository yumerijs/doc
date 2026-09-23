# 渲染器（实验）

Yumeri 提供了渲染器扩展点，用于把插件中的组件或视图能力接到前端渲染链路中。这个能力不是核心 HTTP 请求能力本身，而是一种“渲染适配层”。

> 这部分属于实验性能力，重点是“框架如何识别渲染器、如何自动注册，并把插件和渲染器绑定起来”，而不是说它已经具备完整的前端 SSR/水合能力。

## 1. 渲染器的设计定位

在框架代码中，渲染器不是全局强绑定的页面层，而是通过 `plugin.render` 和 `Core.renderers` 这两个层次来接管：

- 插件定义 `render` 字段，说明它依赖哪种渲染器
- `PluginLoader` 会在加载插件时检测这个字段
- 如果该渲染器尚未注册，则尝试自动加载对应的 renderer 包
- 注册后，`core.pluginRenderers` 会记录“哪个插件使用了哪个 renderer”

这意味着渲染器被视为插件能力的一部分，而不是独立于插件系统之外的全局容器。

## 2. 插件中声明渲染器

```ts
export const render = 'react'

export async function apply(ctx: Context) {
  ctx.registerComponent('App', App)
}
```

或者在对象插件中：

```ts
export default {
  render: 'ejs',
  async apply(ctx) {
    // setup
  }
}
```

### 关键点

- `render` 是字符串，不是对象
- 它告诉框架：这个插件依赖某种渲染器实现
- 框架会尝试自动加载对应包，并写入 `core.pluginRenderers`

## 3. 自动装载渲染器

在 `PluginLoader.loadSinglePlugin()` 中，Yumeri 会做这样的工作：

```ts
if (pluginInstance.render && typeof pluginInstance.render === 'string') {
  const rendererName = pluginInstance.render;
  this.core.pluginRenderers.set(pluginName, rendererName);

  if (!this.core.renderers.has(rendererName)) {
    const rendererPackageMap: Record<string, string> = {
      'react': '@yumerijs/react-renderer',
      'ejs': '@yumerijs/ejs-renderer'
    };

    const rendererPackageName = rendererPackageMap[rendererName] || rendererName;
    const RendererClass = await import(rendererPackageName);
    const ActualRendererClass = RendererClass.default || RendererClass;
    const rendererInstance = new ActualRendererClass();

    this.core.addRenderer(rendererInstance);
  }
}
```

这意味着渲染器不是手动临时 `require()` 的，而是和插件注册过程一体化。

## 4. 实验性边界

这个能力的边界应该被明确理解：

- 它不是通常意义上的“前端页面引擎”，而是“可扩展渲染适配层”
- 适合在插件中声明 `render`，并让框架自动加载对应前端技术栈
- 但由于前端框架的复杂性，水合、状态同步和组件执行细节仍可能存在平台差异

因此文档需要把它视作“实验性扩展”，而不是稳定的标准用法。

## 5. 实际建议

1. 在插件里不要把渲染器能力当成必需基础能力，优先保证 HTTP、路由和插件生命周期稳定。
2. 仅在明确依赖前端模板/组件能力时再声明 `render`。
3. 如果你要做较复杂的前端集成，最好先验证框架和目标渲染器的兼容性。
4. 对于生产环境，不建议把实验性渲染器作为唯一承载层。

## 6. 相关文档

- [插件基础](./plugin)
- [组件提供](./component)
- [运行时与生命周期](./runtime)
- [Context 运行时入口](./runtime/context)
