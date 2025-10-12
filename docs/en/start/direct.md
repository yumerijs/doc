# Manual Install

> Important: Yumeri is under rapid iteration. Always check the latest on GitHub: https://github.com/yumerijs/yumeri

If you want to integrate Yumeri into an existing project or need finer control, manual installation is for you.

## Environment

- Node.js 18+ recommended
- npm or yarn

### Install Node.js

Using nvm on Linux/macOS:

~~~bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 22
nvm use 22
~~~

## Option 1: Install npm package

Create a project and install Yumeri:

~~~bash
mkdir yumeri-app
cd yumeri-app
npm init -y
npm install yumeri
~~~

Install base plugins (optional but recommended):

~~~bash
npm install yumeri-plugin-console
~~~

Create a plugins folder for development (optional):

~~~bash
mkdir -p plugins
~~~

## Option 2: Build from source

For contributing or deep inspection of the framework internals.

### Install yarn and clone

~~~bash
npm install -g yarn
yarn set version 4.9.1
git clone https://github.com/yumerijs/yumeri.git
cd yumeri
yarn
~~~

### Develop plugins

Create your plugin in the "plugins" folder and configure it in "config.yml". Restart Yumeri to load changes.

## Project structure

Typical app layout:

~~~
yumeri-app/
├── node_modules/
├── plugins/
├── config.yml
├── package.json
└── tsconfig.json
~~~

## Start in dev

~~~bash
npm run dev
# or
yarn dev
~~~

Visit http://localhost:14510 in your browser.

## Next steps

- Learn the Plugin System: /en/start/plugin
- Developer Guide: /en/dev/
- Examples: https://github.com/yumerijs/yumeri/tree/main/plugins

