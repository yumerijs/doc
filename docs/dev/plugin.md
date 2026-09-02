# 插件基础

> **重要提示**：Yumeri 框架目前处于快速迭代阶段。

## 编写你的插件

<div class="functional-api">

```typescript
import { Context, Config, Session } from 'yumeri';

// 声明依赖的组件
export const depend = ['database', 'user'];

export async function apply(ctx: Context, config: Config) {
  ctx.route('/foo').action(async (session) => {
    session.respond('Hello', 'plain');
  });
}
```

</div>

<div class="decorator-api">

```typescript
import { Session, Context } from 'yumeri';
import { Plugin, Get, Inject } from '@yumerijs/decorator';

// 声明依赖的组件
export const depend = ['database'];

@Plugin
export default class MyPlugin {
  @Inject('database')
  db: any;

  @Get('/foo')
  async action(session: Session) {
    session.respond('Hello', 'plain');
  }
}
```

</div>

## 依赖管理

如果你的插件依赖于其他插件提供的组件，你必须在入口文件中导出一个名为 `depend` 的字符串数组。

```typescript
export const depend = ['database', 'logger'];
```

每个字符串对应所依赖的组件名称。**即使在装饰器模式下使用了 `@Inject` 装饰器，这个 `depend` 导出依然是必需的**。它决定了插件的加载顺序，确保被依赖的组件在你的插件实例化之前已经准备就绪。
