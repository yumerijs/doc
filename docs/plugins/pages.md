# 页面模型 (Pages)

## 配置项

该插件没有配置项。

## 提供服务: Pages

- get(condition: Partial&lt;Pages&lt;): Promise&lt;Pick&lt;Pages, keyof Pages&gt;[]&gt;;
- getType(id: number): Promise&lt;string | null&gt;;
- getMetadatas(id: number): Promise&lt;Pick&lt;Pagesmeta, keyof Pagesmeta&gt;[]&gt;;
- selectMetadata(id: number, key: string): Promise&lt;Pick&lt;Pagesmeta, keyof Pagesmeta&gt; | null&gt;;
- insert(page: Partial&lt;Pages&gt;): Promise&lt;Pages&gt;;
- update(id: number, page: Partial&lt;Pages&gt;): Promise&lt;number&gt;;
    getTypes(): Promise&lt;string[] | null&gt;;