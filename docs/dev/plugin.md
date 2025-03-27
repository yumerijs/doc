# 创建一个插件

在plugins文件夹新建一个以“yumeri-plugin-”开头的文件夹，进入后使用npm init初始化node项目，然后使用npm install yumeri安装yumerijs及其依赖。

打开yumeri开发项目的config.yml，在插件配置后面加上自己的插件，重启yumeri便可加载了。

## 编写你的插件

在插件src目录下新建index.ts，在其中输入以下内容：

``` typescript
import { Core, Config, Session, Logger } from 'yumeri';
//import { Logger } from '@yumerijs/core';
import http from 'http';
import { URL } from 'url'; // 导入 URL 模块

export async function apply(core: Core, config: Config) {
  core.command('myplugin')
    .action(async (session: Session, param?: any) => {
      session.setMime('text');
      session.body = `<h1>This is myplugin</h1>
<h2>welcome!</h2>`;
    });
}

export async function disable(core: Core) {

}
```

重启yumeri以运行，打开yumeri监听地址+/myplugin，你将会看到：
This is myplugin
welcome!

恭喜你，你运行了你的第一个插件。
