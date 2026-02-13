# 用户模型 (User)

用户模型插件为 Yumeri 提供基础用户数据表与常用的注册、登录、查询能力，便于在其他插件（如登录、权限）中复用。

## 依赖

- `database`

## 配置项

### name

- 类型: `string`
- 默认值: `user`

用户表名。

### isEmailopen

- 类型: `boolean`
- 默认值: `true`

是否启用邮箱字段。

### isPhoneopen

- 类型: `boolean`
- 默认值: `true`

是否启用手机号字段。

### encryptType

- 类型: `string`
- 默认值: `md5`

密码加密算法（使用 Node.js `crypto.createHash`），可填写 `md5`、`sha256` 等。

## 提供服务: user

### `user.getuserinfo(username: string)`

通过用户名获取用户信息（不包含密码字段）。

### `user.getuserinfobyid(id: number)`

通过用户 ID 获取用户信息（不包含密码字段）。

### `user.updateuserinfo(id: number, data: Partial<UserTable>)`

更新用户信息。

### `user.changepassword(username: string, password: string)`

修改用户密码（自动使用 `encryptType` 加密）。

### `user.register(username: string, password: string, email?: string, phone?: string)`

注册用户，返回插入结果或 `false`。

### `user.login(username: string, password: string): Promise<boolean>`

验证登录，返回是否匹配。

## 数据表结构

默认表名为 `user`（可通过 `name` 配置修改）。

```ts
interface UserTable {
  id: number
  username: string
  password: string
  email?: string | null
  phone?: string | null
  createAt: Date
  updateAt: Date
}
```

> 邮箱与手机号字段会根据 `isEmailopen`/`isPhoneopen` 开关决定是否创建。
