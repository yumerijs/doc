# 页面模型 (Pages)

## 配置项

该插件没有配置项。

## 提供服务: Pages

### get(condition: Partial&lt;Pages&lt;): Promise&lt;Pick&lt;Pages, keyof Pages&gt;[]&gt;;

获取指定条件的文章

### getType(id: number): Promise&lt;string | null&gt;;

获取一个文章的类型字段

### getMetadatas(id: number): Promise&lt;Pick&lt;Pagesmeta, keyof Pagesmeta&gt;[]&gt;;

获取一个文章的所有元信息

### selectMetadata(id: number, key: string): Promise&lt;Pick&lt;Pagesmeta, keyof Pagesmeta&gt; | null&gt;;

获取一个文章的指定元信息

### insert(page: Partial&lt;Pages&gt;): Promise&lt;Pages&gt;;

插入一篇文章

### update(id: number, page: Partial&lt;Pages&gt;): Promise&lt;number&gt;;

更新文章

### getTypes(): Promise&lt;string[] | null&gt;;

获取所有文章类型

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