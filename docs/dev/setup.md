# 环境搭建

本指南将帮助你快速搭建 Yumeri 开发环境，并介绍 3.0 之后新增的配置和 CLI 方式。

## 环境要求

- **Node.js**: 建议使用 LTS 版本，至少 18+
- **包管理器**: 推荐使用 Yarn；也支持 NPM
- **TypeScript**: 如果你做插件开发，建议引入 TypeScript

## 安装 Yumeri

### 1. 新项目安装

```bash
mkdir my-yumeri-app
cd my-yumeri-app
yarn init -y
yarn add yumeri
```

### 2. 安装开发依赖

```bash
yarn add -D typescript @types/node
```

### 3. 作为组件使用

```ts
import { Core } from 'yumeri'

const core = new Core()
core.start()
```

## 项目结构

一个典型的 Yumeri 应用结构如下：

```text
yumeri-app/
├── plugins/          # 插件目录
├── dist/             # 构建输出
├── yumeri.json       # 主配置文件
├── package.json      # 项目依赖与脚本
├── tsconfig.json     # TypeScript 配置
└── src/              # 应用代码（可选）
```

## 配置文件

3.0 之后，Yumeri 优先支持 `yumeri.json`，同时也兼容旧的 `config.yml`。

当项目中存在 `config.yml` 且没有 `yumeri.json` 时，启动器会自动迁移：

```bash
config.yml -> yumeri.json
```

旧文件会被重命名为 `config.yml.migrated`，避免配置丢失。

一个最小配置示例：

```json
{
  "plugins": {
    "console": true,
    "logger": true
  }
}
```

或者使用对象形式：

```json
{
  "plugins": {
    "demo": {
      "module": "yumeri-plugin-demo",
      "config": {
        "enabled": true
      }
    }
  }
}
```

## 启动命令

```bash
yarn yumeri
```

常用参数：

```bash
yumeri --config ./config/my-yumeri.json
yumeri --auto-install
```

含义：

- `--config`: 指定配置文件路径
- `--auto-install`: 自动安装缺失的插件包并按需重启 worker

## 运行时加载流程

Yumeri 在启动时会：

1. 读取 `yumeri.json` 或 `config.yml`
2. 解析插件配置
3. 解析 `depend` / `optional` 依赖
4. 自动安装缺失插件（如启用了 `--auto-install`）
5. 加载插件与应用入口

如果某个插件是配置项命名实例，Loader 会按实例 ID 做独立管理，并保留其 `enabled` / `disabled` 状态。

## 最佳实践

1. 使用 `yumeri.json` 作为主配置文件，避免混用多种格式。
2. 生产环境中尽量显式指定 `--config`，降低依赖当前工作目录的风险。
3. 让插件依赖声明完整，尤其是 `depend`，保证启动时没有“隐形缺失”。
4. 定期检查缺失插件与版本兼容问题，必要时使用 `--auto-install`。

## 相关文档

- [插件基础](./plugin)
- [配置构型](./config)
- [路由系统](./route)
