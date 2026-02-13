# 全局代理 (Proxy Agent)

为 Node.js 进程设置全局 HTTP/HTTPS/SOCKS 代理。插件启用后，会替换 `http.globalAgent` 与 `https.globalAgent`，从而影响整个进程中发起的请求。

## 配置项

### proxyUrl

- 类型: `string`
- 默认值: `http://127.0.0.1:7890`

代理地址，支持 `http` / `https` / `socks5`。

## 行为说明

- 插件启用后，全局请求都会走代理。
- 插件禁用时会恢复原始 Agent。

## 注意事项

- 请确保代理服务可用，否则请求会失败。
- 该设置是全局级别，可能影响所有依赖网络请求的功能。
