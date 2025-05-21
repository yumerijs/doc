# 快速开始

> **重要提示**：Yumeri框架目前处于快速迭代阶段，本文档中的API可能随时发生变化。请始终以GitHub仓库中的最新代码为准：https://github.com/yumerijs/yumeri

## 环境要求

在开始使用Yumeri之前，请确保您的系统已安装以下软件：

- Node.js（推荐使用最新的LTS版本）
- npm或yarn包管理器

## 安装

Yumeri提供了两种安装方式：使用项目模板或手动安装依赖。

### 方式一：使用项目模板（推荐）

最方便的项目初始化方式是使用项目模板：

使用npm：

```bash
npm init yumeri
```

使用yarn：

```bash
yarn create yumeri
```

这将创建一个基本的Yumeri项目结构，并自动安装所需的依赖。

### 方式二：手动安装依赖

如果您不想使用项目模板，也可以手动安装yumeri依赖：

首先，初始化一个新的Node.js项目：

```bash
npm init
```

然后，安装yumeri依赖：

```bash
npm install yumeri
```

或使用yarn：

```bash
yarn add yumeri
```

## 项目结构

一个典型的Yumeri项目结构如下：

```
my-yumeri-project/
├── node_modules/
├── plugins/           # 存放自定义插件
├── config.yml         # Yumeri配置文件
├── package.json
└── tsconfig.json      # TypeScript配置（如果使用TS）
```

## 基本配置

打开yumeri开发项目的config.yml，在插件配置后面加上自己的插件，重启yumeri便可加载了。

在这种模式下，插件会优先从plugins文件夹下的ts源代码加载。

## 启动项目

在项目根目录下，使用以下命令启动Yumeri：

```bash
npm run dev
```

或使用yarn：

```bash
yarn dev
```

这将启动开发模式，您可以在浏览器中访问相应地址（通常是http://localhost:3000）查看您的应用。

## 基本使用

Yumeri的基本使用流程如下：

1. **创建或使用插件**：Yumeri的功能主要通过插件实现，您可以使用现有插件或创建自己的插件。

2. **配置插件**：在config.yml中配置您需要使用的插件。

3. **启动应用**：使用npm run dev或yarn dev启动应用。

4. **访问应用**：在浏览器中访问相应地址查看您的应用。

## 示例：创建一个简单的Yumeri应用

以下是创建一个简单Yumeri应用的步骤：

1. 初始化项目：

```bash
npm init yumeri my-first-yumeri-app
cd my-first-yumeri-app
```

2. 启动项目：

```bash
npm run dev
```

3. 访问http://localhost:3000，您应该能看到Yumeri的欢迎页面。

## 下一步

现在您已经了解了Yumeri的基本安装和使用方法，接下来可以：

- 学习[插件系统](./plugin.md)，了解如何使用插件
- 深入[开发指南](/dev/)，学习如何为yumeri进行开发
- 查看[示例项目](https://github.com/yumerijs/yumeri/tree/main/plugins)，获取实际应用的灵感

记住，由于Yumeri仍在快速迭代中，请定期查看官方仓库获取最新更新和API变更。
