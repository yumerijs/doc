# 用户登录 (Authority)

提供登录/注册页面与 API，同时暴露登录状态与用户信息查询接口。

## 依赖

- `user`

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

判断指定 `sessionid` 是否已登录。

### `authority.getUserinfo(sessionid: string): Promise<Record<string, any>> | false`

获取登录用户信息，未登录时返回 `false`。

## 路由与接口

- `GET /auth/login`  
  登录页面。

- `GET /auth/register`  
  注册页面。

- `GET /auth/style.css`  
  登录/注册页面样式。

- `GET /auth/script.js`  
  登录/注册页面脚本。

- `POST /auth/api/login`  
  登录接口，请求体包含 `username`、`password`。

- `POST /auth/api/register`  
  注册接口，请求体包含 `username`、`password`。

## Hook 点位

页面模板支持以下 Hook（用于插入额外 HTML）：

- `authority:htmlheader`
- `authority:preloginform`
- `authority:loginform`
- `authority:postloginform`
- `authority:preregisterform`
- `authority:registerform`
- `authority:postregisterform`
- `authority:htmlfooter`

资源文件支持以下 Hook（可注入自定义内容）：

- `authority:css`
- `authority:js`

登录/注册前置校验 Hook：

- `authority:login`
- `authority:register`

> 上述 Hook 返回 `false` 时会阻止流程继续执行。
