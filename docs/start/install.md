# 安装

Yumeri 框架的最基本安装方式是使用模板项目，操作简单，适合初次使用的用户。

## 配置镜像源

由于众所周知的原因，国内下载node包会十分缓慢，在没有魔法条件的情况下，我们非常建议配置国内镜像源。

NPM:

```npm
npm config set registry https://registry.npmmirror.com
```

YARN:

```yarn
yarn config set registry https://registry.npmmirror.com
```

## 创建项目

在你想要创建项目的目录打开cmd/bash。

输入下面的命令以安装Yumeri：
```npm
npm init yumeri
```

```yarn
yarn create yumeri
```

## 启动Yumeri

如果你没有选择自动安装依赖并启动，你可能需要使用`yarn` 或 `npm i`进行依赖安装，然后执行如下命令启动：

```npm
npm start
```

```yarn
yarn start
```