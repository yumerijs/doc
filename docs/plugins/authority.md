# 用户登录 (Authority)

## 配置项

### loginpath

- 类型: `string`
- 默认值: `../static/login.html`

登录页面模板地址

### regpath

- 类型: `string`
- 默认值: `../static/reg.html`

注册页面模板地址

## 提供服务: authority

### `authority.getLoginstatus(sessionid: string): boolean`

### `authority.getUserinfo(sessionid: string): Promise<Record<string, any>> | false`