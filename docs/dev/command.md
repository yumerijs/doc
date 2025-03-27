# 指令系统

“指令”的概念在Web系统里面非常模糊。它不像机器人中那样是实时响应的会话，因此在Yumeri当中，若非websocket连接，所有的页面响应都将在指令执行完成后。

## 注册指令

指令注册通过链式调用，将command对象返回至core。代码如下：

``` typescript
core.command('foo')
  .action(async (session: Session, param?: any) => {
    logger.info('excute command foo');
    session.body = 'bar';
    session.setMime('plain');
})
```

首先，使用core.command(name)定义一个command对象，然后调用action函数注册指令代码。该函数不能返回任何返回值。传入参数有session以及param。

其中，session为会话信息，存储着包含用户ip在内的信息。

param是参数，包含了二级及之后路径（param.path，如路径是/aaa/bbb/ccc.html，则param.path为bbb/ccc.html）以及用户参数请求。

调用指令主要由yumeri-plugin-server完成。