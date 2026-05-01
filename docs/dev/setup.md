# 环境搭建

本指南将帮助你搭建 Yumeri 开发环境。

## 环境要求

- **Node.js**: LTS 版本 (建议 v18+)
- **包管理器**: Yarn (推荐) 或 NPM

## 安装方式

### 1. 使用脚手架 (推荐)
通过脚手架可以快速创建一个包含基础结构的 Yumeri 应用：

```bash
yarn create yumeri
# 或
npm init yumeri
```

### 2. 手动安装
如果你想在现有项目中集成 Yumeri：

```bash
# 初始化项目
mkdir my-yumeri-app && cd my-yumeri-app
yarn init -y

# 安装核心依赖
yarn add yumeri
```

### 3. 作为组件使用
Yumeri 支持作为其他 Node.js 应用的组件运行：

```typescript
import { Core } from 'yumeri';

const core = new Core();
core.start();
```

## 目录结构

一个标准的开发者项目结构如下：

```text
yumeri-app/
├── plugins/          # 插件存放目录
├── config.yml        # 配置文件
├── package.json      # 项目配置
└── tsconfig.json     # TypeScript 配置
```

## 启动开发环境

```bash
yarn dev
```
默认监听地址为 `http://localhost:14510`。
