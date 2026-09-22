# 插件基础

> **重要提示**：Yumeri 的插件系统在 3.0 之后继续增强，关键变化包括更灵活的依赖声明、自动安装缺失插件，以及命名插件实例的配置方式。

## 编写你的插件

<div class="functional-api">

```ts
import { Context, Config } from 'yumeri'

export const depend = ['database', 'logger']
export const optional = ['cache']

export async function apply(ctx: Context, config: Config) {
  ctx.route('/foo').action(async (session) => {
    session.respond('Hello', 'plain')
  })
}
```

</div>

<div class="decorator-api">

```ts
import { Session, Context } from 'yumeri'
import { Plugin, Get, Inject } from '@yumerijs/decorator'

export const depend = ['database']

@Plugin
export default class MyPlugin {
  @Inject('database')
  db: any

  @Get('/foo')
  async action(session: Session) {
    session.respond('Hello', 'plain')
  }
}
```

</div>

## 必需依赖与可选依赖

插件入口文件中最重要的声明通常是：

```ts
export const depend = ['database', 'logger']
export const optional = ['cache']
```

含义如下：

- `depend`：必需依赖，若缺失则插件无法正常加载。
- `optional`：可选依赖，若存在就尽量加载；若不存在则不阻塞插件本身的加载。

在 3.0 以后，Loader 会优先处理 `depend` 与 `optional`，使插件装配过程更稳定，也能处理“非核心能力缺失但功能可降级”的场景。

## 依赖管理

如果你的插件依赖于其他插件提供的组件，必须在入口文件中导出一个 `depend` 数组：

```ts
export const depend = ['database', 'logger']
```

每个字符串对应所依赖的组件名称。即使在装饰器模式下使用了 `@Inject`，这个 `depend` 也依然是必需的，因为它决定了插件加载顺序，并确保依赖项在实例化前已经就绪。

## 插件配置与实例化

插件可以通过 `config` 导出定义结构：

```ts
import { Schema } from 'yumeri'

export const config = Schema.object({
  enabled: Schema.boolean('是否启用').default(true),
  timeout: Schema.number('超时时间').default(3000),
})
```

加载时，Yumeri 会把配置对象注入给插件，并自动填充缺失的默认值。更多细节请见 [配置构型](./config)。

## 命名插件实例

3.0 之后，配置文件中的插件不再只支持传统的 `{ "plugin-name": { ... } }` 形式，还支持命名实例方式：

```json
{
  "plugins": {
    "demo": {
      "module": "yumeri-plugin-demo",
      "config": {
        "enabled": true
      }
    },
    "~demo-disabled": {
      "module": "yumeri-plugin-demo",
      "config": {
        "enabled": false
      }
    }
  }
}
```

其中：

- 未加 `~`：表示正常启用的插件
- 加 `~`：表示该插件实例被禁用，但配置仍保留，便于后续重新启用
- `module`：指定真实的插件模块名称
- `config`：插件实例配置

这种形式允许同一插件在同一应用中存在多个实例，并分别配置不同参数。

### 配置形式对照

| 形式 | 含义 | 适用场景 |
|------|------|----------|
| `"demo": { ... }` | 传统插件配置 | 单实例插件 |
| `"demo": { "module": "...", "config": {...} }` | 实例化配置 | 同插件多实例 |
| `"~demo"` | 禁用状态保留配置 | 预留配置但暂不启用 |

## 缺失插件自动安装

Yumeri 3.0 引入了更友好的插件缺失处理：

- 如果配置中某个插件未安装，Loader 可检测到这个情况。
- 可通过 `--auto-install` 参数自动执行安装。
- 安装成功后需要重启进程以加载新插件。

启动命令示例：

```bash
yumeri --auto-install
yumeri --config ./config/my-yumeri.json
```

这使得开发和部署时的插件依赖管理更加顺畅，尤其适合团队协作和自动化环境。

## 最佳实践

1. 把真正“必需”的能力放进 `depend`，把“增强型/降级型”能力放进 `optional`。
2. 始终为插件定义 `config`，避免让配置散落在代码中。
3. 对复杂配置使用 `Schema.object()`，并设置合理默认值。
4. 在团队或 CI 环境中使用 `--auto-install` 以减少插件遗漏问题。

## 相关文档

- [配置构型](./config)
- [环境搭建](./setup)
- [路由系统](./route)
