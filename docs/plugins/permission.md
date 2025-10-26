# 权限模型 (Permission)

## 配置项

### defaultpermit

- 类型: `number`
- 默认值: `1`

默认用户权限

> 我们约定，最高管理员的权限为 10。

## 提供服务: Permission

### getPermit(id: number): Promise&lt;number&gt;;

获取指定用户的权限数值。

Permission 模型定义：
```typescript
interface Permission {
    id: number;
    permit: number;
}
```