# 文件管理 (Files)

文件管理插件为控制台提供文件浏览与编辑能力，所有操作都限制在配置的根目录中，避免越权访问。

## 依赖

- `console`

## 配置项

### root

- 类型: `string`
- 默认值: `.`

文件管理的根目录（相对于项目根）

## 控制台入口

插件会在控制台中新增「文件管理」页面。

## API 接口

所有接口均需要控制台登录权限。

- `GET /api/files/list?path=.`  
  列出目录内容，返回文件与文件夹信息。

- `GET /api/files/read?path=path/to/file`  
  读取文件内容。

- `GET /api/files/download?path=path/to/file`  
  下载文件，自动设置 MIME 类型。

- `POST /api/files/write`  
  写入文件内容，`body` 示例：
  ```json
  { "path": "README.md", "content": "..." }
  ```

- `POST /api/files/create-dir`  
  创建目录，`body` 示例：
  ```json
  { "path": ".", "name": "assets" }
  ```

## 安全说明

- 插件会阻止路径穿越（`..` 等）请求。
- 所有路径都相对于 `root` 目录解析。
