# 权限模型 (Permission)

提供基础的用户权限数值模型，适合做权限等级控制。

## 依赖

- `database`
- `user`

## 配置项

### defaultpermit

- 类型: `number`
- 默认值: `1`

默认用户权限

> 我们约定，最高管理员的权限为 10。

## 提供服务: permission

### `permission.getPermit(id: number): Promise<number>`

获取指定用户的权限数值。

如果记录不存在，会自动创建一条默认记录。

Permission 模型定义：
```typescript
interface Permission {
    id: number;
    permit: number;
}
```
