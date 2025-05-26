# Yumeri 框架手动安装与启动指南

> **重要提示**：Yumeri 框架正在快速迭代中，请随时参考 [官方仓库](https://github.com/yumerijs/yumeri) 获取最新信息。

如果你想为你现有的项目集成Yumeri框架，或者说想获得更高的扩展性，那么这种方案适合你。

## 环境准备

在开始安装前，请确保您的系统满足以下要求：

### 必要软件

- **Node.js**: 版本 18.0.0 或更高
- **npm**: 版本 8.0.0 或更高（Node.js 安装时自带）
- **Yarn**: 版本 4.0.0 或更高（如果选择从源码构建）

### 安装 Node.js

1. 访问 [Node.js 官网](https://nodejs.org/) 下载并安装适合您操作系统的版本
2. 或使用 nvm（Node Version Manager）安装：

```bash
# 安装 nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 安装 Node.js
nvm install 18
nvm use 18
```

## 方案一：直接安装 npm 包

这是最简单的方式，适合快速开始使用 Yumeri 框架或在生产环境中部署。

### 创建项目

```bash
# 创建项目目录
mkdir yumeri-app
cd yumeri-app

# 初始化 npm 项目
npm init -y
```

### 安装 Yumeri

```bash
# 安装 Yumeri 框架（会自动包含 core 和 loader）
npm install yumeri
```

### 安装基础插件

```bash
# 安装服务器插件（可选但几乎是底层依赖）
npm install yumeri-plugin-server

# 安装控制台插件（可选但推荐）
npm install yumeri-plugin-console
```

### 创建插件目录（可选，用于开发）

```bash
# 创建插件目录
mkdir -p plugins
```

## 方案二：从源码构建

这种方式适合希望深入了解框架内部结构、进行框架开发或贡献代码的开发者。

### 安装 Yarn

```bash
# 安装 Yarn
npm install -g yarn

# 升级到 Yarn 4 (如果需要)
yarn set version 4.9.1
```

### 获取源码

```bash
# 克隆仓库
git clone https://github.com/yumerijs/yumeri.git

# 进入项目目录
cd yumeri
```

### 安装依赖

Yumeri 使用 Yarn Workspaces 管理多包项目结构，包括核心包和插件。

```bash
# 安装所有依赖
yarn install
```

### 构建项目

```bash
# 构建所有包
yarn workspaces foreach run build

# 或者分别构建各个包
cd package/core && yarn build
cd ../loader && yarn build
cd ../yumeri && yarn build
cd ../../
```

## 配置文件

无论选择哪种安装方式，都需要创建配置文件。在项目根目录创建 `config.yml` 文件：

```bash
# 创建配置文件
touch config.yml
```

编辑 `config.yml` 文件，添加以下基本配置：

```yaml
# 基本配置
plugins:
  # 服务器插件（可选但几乎是底层依赖）
  yumeri-plugin-server:
    port: 14510
    host: 0.0.0.0
  
  # 控制台插件（可选但推荐）
  yumeri-plugin-console:
    path: console
    adminname: admin
    adminpassword: admin
```

如果想直接引用默认配置，可删掉插件名下的所有配置项，但插件名和冒号必须保留。

## 编写启动脚本

### JavaScript 版本 (start.js)

```javascript
// 导入必要的模块
const { Core } = require('yumeri');
const PluginLoader = require('yumeri').PluginLoader;

async function main() {
  // 创建插件加载器
  const loader = new PluginLoader();
  
  // 创建核心实例
  const core = new Core(loader);

  try {
    // 加载配置文件
    await core.loadConfig('./config.yml');
    
    // 加载插件
    await core.loadPlugins();
    
    console.log('Yumeri 框架已成功启动！');
    
    // 处理进程退出
    process.on('SIGINT', async () => {
      console.log('正在关闭 Yumeri 框架...');
      await core.stop();
      console.log('Yumeri 框架已安全关闭');
      process.exit(0);
    });
  } catch (err) {
    console.error('Yumeri 框架启动失败:', err);
    process.exit(1);
  }
}

// 执行主函数
main();
```

### TypeScript 版本 (start.ts)

```typescript
// 导入必要的模块
import { Core } from 'yumeri';
import PluginLoader from 'yumeri/dist/loader';

async function main() {
  // 创建插件加载器
  const loader = new PluginLoader();
  
  // 创建核心实例
  const core = new Core(loader);

  try {
    // 加载配置文件
    await core.loadConfig('./config.yml');
    
    // 加载插件
    await core.loadPlugins();
    
    console.log('Yumeri 框架已成功启动！');
    
    // 处理进程退出
    process.on('SIGINT', async () => {
      console.log('正在关闭 Yumeri 框架...');
      await core.stop();
      console.log('Yumeri 框架已安全关闭');
      process.exit(0);
    });
  } catch (err) {
    console.error('Yumeri 框架启动失败:', err);
    process.exit(1);
  }
}

// 执行主函数
main();
```

## 启动框架

### 使用 Node.js 直接启动

如果您使用的是 JavaScript 启动脚本：

```bash
# 启动框架
node start.js
```

如果您使用的是 TypeScript 启动脚本：

```bash
# 安装 TypeScript 和 ts-node
npm install -D typescript ts-node

# 使用 ts-node 启动
npx ts-node start.ts

# 或者先编译再启动
npx tsc start.ts
node start.js
```

### 创建 npm 脚本

您可以在项目的 `package.json` 中添加启动脚本：

```json
{
  "scripts": {
    "start": "node start.js",
    "dev": "ts-node start.ts"
  }
}
```

然后使用以下命令启动：

```bash
# 生产环境
npm start

# 开发环境
npm run dev
```

## 常见问题

### 依赖安装失败

**问题**: 安装依赖时出现错误。

**解决方案**:
- 确保您使用的是兼容版本的 Node.js
- 尝试删除 `node_modules` 文件夹和 `package-lock.json`，然后重新安装
- 检查网络连接，必要时使用代理或镜像源

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
```

### 找不到模块错误

**问题**: 启动时报告 `Cannot find module 'xxx'` 错误。

**解决方案**:
- 确保所有依赖已正确安装
- 检查导入路径是否正确
- 对于 TypeScript 项目，确保已正确编译

### 插件加载失败

**问题**: 框架启动时无法加载插件。

**解决方案**:
- 确保插件已正确构建（检查 `dist` 目录是否存在）
- 检查 `config.yml` 中的插件配置是否正确
- 检查插件的依赖是否已安装
- 确保插件目录结构正确

### 端口占用

**问题**: 启动时报告端口已被占用。

**解决方案**:
- 在 `config.yml` 中修改 `yumeri-plugin-server` 的端口配置
- 使用 `lsof -i :端口号` 或 `netstat -ano | findstr 端口号` 找出占用端口的进程并关闭