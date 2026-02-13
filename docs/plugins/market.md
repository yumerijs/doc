# 插件市场 (Market)

插件市场用于浏览、安装、更新和移除 Yumeri 插件，并在控制台内提供可视化管理入口。

## 依赖

- `console`

## 配置项

### url

- 类型: `string`
- 默认值: `https://registry.yumeri.dev`

插件市场 Registry 地址

### npmregistry

- 类型: `string`
- 默认值: `https://registry.npmmirror.com`

npm Registry 地址

## 控制台入口

插件会在控制台中新增两个页面：

- 插件市场
- 依赖管理

## API 接口

> 以下接口需要登录控制台后才能访问。

- `GET /api/market/list`  
  获取插件列表。

- `GET /api/market/search?q=keyword`  
  搜索插件。

- `GET /api/market/install?name=yumeri-plugin-xxx&version=latest`  
  安装插件，仅允许 `yumeri-plugin-` 前缀。安装时会自动解析插件依赖。

- `GET /api/market/uninstall?name=yumeri-plugin-xxx`  
  卸载插件。

- `GET /api/market/versions?name=yumeri-plugin-xxx`  
  获取某插件的版本列表。

- `GET /api/market/npm-versions`  
  读取本地依赖并对比 npm 版本信息。

- `GET /api/market/currentver?name=yumeri-plugin-xxx`  
  获取当前已安装版本。

- `GET /api/market/dependencies`  
  获取当前项目依赖列表。

- `GET /api/market/savever?deps=name@1.2.3,name2@latest,name3@null`  
  批量更新依赖版本或移除依赖（`@null` 表示卸载）。

## 注意事项

- 安装/卸载会修改 `package.json` 并执行 `yarn install`。
- Registry 可自建，避免公网不可用导致拉取失败。
