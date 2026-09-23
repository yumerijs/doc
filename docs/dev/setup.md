# 环境搭建

本指南用于快速搭建 Yumeri 开发环境，并说明 3.0 之后的实际启动方式。重点不是“概念介绍”，而是帮助你从零到一把项目跑起来，并理解框架在启动时真正做了什么。

## 1. 环境要求

- Node.js：建议 LTS，至少 18+
- 包管理器：建议使用 Yarn，也支持 npm
- TypeScript：如果做插件开发，建议同时安装 TypeScript 与 Node 类型声明

## 2. 安装 Yumeri

### 方式 A：新项目安装

```bash
mkdir my-yumeri-app
cd my-yumeri-app
yarn init -y
yarn add yumeri
```

### 方式 B：安装开发依赖

```bash
yarn add -D typescript @types/node
```

### 方式 C：直接使用 Core

```ts
import { Core } from 'yumeri'

const core = new Core()
await core.runCore()
```

> 在真实的应用启动链路中，Yumeri 不是单独“new Core 然后手动跑”，而是通过 `PluginLoader` 读取配置、装载插件并最终执行 `core.runCore()`。

---

## 3. 推荐工程结构

一个典型工程大致如下：

```text
yumeri-app/
├── plugins/          # 自定义插件目录
├── dist/             # 编译后的应用入口
├── yumeri.json       # 主配置文件
├── package.json      # 项目依赖与脚本
├── tsconfig.json     # TypeScript 配置
├── src/              # 源码目录（可选）
└── README.md         # 项目说明
```

---

## 4. 配置文件

Yumeri 的启动器优先读取 `yumeri.json`，同时兼容旧的 `config.yml`。如果项目中存在 `config.yml` 且没有 `yumeri.json`，框架会自动迁移：

```bash
config.yml -> yumeri.json
```

并将旧文件重命名为：

```bash
config.yml.migrated
```

### 最小配置

```json
{
  "plugins": {
    "console": true,
    "logger": true
  }
}
```

### 对象形式插件配置

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

这里的插件对象形式是 Yumeri 允许的实际配置模型之一，它和传统的 `{ "pluginId": true }` 形式并行存在。

---

## 5. CLI 启动方式

通常以命令行直接启动：

```bash
yumeri
```

常见参数：

```bash
yumeri --config ./config/my-yumeri.json
yumeri --auto-install
```

### 参数说明

- `--config` / `-c`：指定配置文件路径
- `--auto-install`：自动安装缺失插件并在必要时重启 worker

---

## 6. 启动时的真实流程

Yumeri 的启动并不是简单“读取 JSON 后直接跑服务器”，而是有明确步骤：

1. 解析 CLI 参数
2. 确定配置文件路径（`yumeri.json` / `config.yml`）
3. `PluginLoader.loadConfig()` 载入配置
4. `PluginLoader.loadPlugins()` 处理插件依赖和安装
5. 如开启 `--auto-install`，缺失插件会先安装
6. 若需要重启，退出并要求重新执行 worker
7. 读取本地应用入口（通常是 `dist/index.js`）
8. 将应用作为插件挂载到 `loader` 中
9. 最终执行 `loader.getCore().runCore()`，启动真实 HTTP / WS 服务

这套流程是 Yumeri 平台化设计的关键：应用本身也会被当作一种插件来装载，而不是独立于插件系统之外。

---

## 7. 自动安装与重启

如果配置中声明了某个插件，但模块包未安装，Yumeri 会在 `loadPlugins()` 中尝试安装缺失模块：

```ts
const restartRequired = await loader.loadPlugins()
if (restartRequired) {
  console.log('Missing plugin packages were installed. Restarting the worker to load them.')
  process.exitCode = 10
  return
}
```

这说明：

- 自动安装不是“静默跳过”
- 它会明确要求重启，确保新安装的依赖真正被加载
- 这是一种更稳定的部署方式，尤其适合 CI 和团队协作

---

## 8. 最佳实践

1. 用 `yumeri.json` 作为主配置文件，避免多套配置同时存在。
2. 在生产环境里显式指定 `--config`，减少路径依赖。
3. 完整声明 `depend`，不要依赖“启动时偶然通过”。
4. 在多成员协作中开启 `--auto-install`，降低插件遗漏造成的启动失败概率。
5. 把应用入口放在稳定的 `dist/index.js` 或明确的构建目录中，避免启动时定位不到入口。

---

## 相关文档

- [插件基础](./plugin)
- [配置构型](./config)
- [路由系统](./route)
- [运行时与生命周期](./runtime)
