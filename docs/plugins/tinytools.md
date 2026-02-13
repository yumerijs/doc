# 前端小工具 (TinyTools)

TinyTools 提供前端模板可调用的小工具集合，目前内置一个常用的文章列表渲染工具。它通过 `frontend:render` 钩子向模板注入 HTML 片段。

## 依赖

- `pages`

## 配置项

该插件没有配置项。

## 可用工具

### `tinytools:postlist[:limit]`

生成文章列表的 HTML。

- `limit` 为可选参数，默认 `5`
- 仅展示 `type=post`且`status=publish` 的文章
- 输出的 HTML 会自带简单样式

## 使用方式

在模板中使用 <span v-pre>`{{tinytools:postlist}}`</span> 或 <span v-pre>`{{tinytools:postlist:10}}`</span> 这类占位符即可自动替换。

> 实际替换由 `frontend:render` 钩子完成，TinyTools 只负责生成内容。
