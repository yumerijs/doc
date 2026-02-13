# 页面模型 (Pages)

提供文章/页面数据模型及常用查询方法，适用于博客、页面渲染等场景。

## 依赖

- `database`
- `user`

## 配置项

该插件没有配置项。

## 提供服务: pages

### `pages.get(condition: Partial<Pages>)`

获取指定条件的文章

### `pages.getType(id: number)`

获取一个文章的类型字段

### `pages.getMetadatas(id: number)`

获取一个文章的所有元信息

### `pages.selectMetadata(id: number, key: string)`

获取一个文章的指定元信息

### `pages.insert(page: Partial<Pages>)`

插入一篇文章

### `pages.update(id: number, page: Partial<Pages>)`

更新文章

### `pages.getTypes()`

获取所有文章类型

> 插入时会自动补充 `created_at` / `updated_at` 字段，并默认设置 `status = published`、`comment_status = open`。

## Pages 模型定义
```typescript
interface Pages {
    id: number;
    name: string;
    description?: string;
    type: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    author_id: number;
    status: string;
    comment_status: string;
}
```

## Pagesmeta 模型定义
```typescript
interface Pagesmeta {
    id: number;
    page_id: number;
    meta_key: string;
    meta_value: string;
}
```
