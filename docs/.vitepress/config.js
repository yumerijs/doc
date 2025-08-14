export default {
  head: [
    ['link', { rel: 'icon', href: 'https://api.flweb.cn/doc/image/bot.jpg' }],
  ],
  title: 'Yumeri',
  lastUpdated: true,
  description: '基于nodejs的新一代模块化web应用构建平台',
  lang: 'zh-CN',
  themeConfig: {
    sidebar: {
      '/start/': [
        {
          text: '开始',
          items: [{
            text: '安装',
            items: [
              { text: '安装指南', link: '/start/install' },
              { text: '手动安装', link: '/start/direct' },
              { text: '作为组件使用', link: '/start/dep' }]
          },{text: '使用',
          items: [
            { text: '开始之前', link: '/start/' },
            { text: '插件系统', link: '/start/plugin' },
            { text: '路由系统', link: '/start/route' }
          ]}]
        }
      ],

      '/api/': [
        {
          text: 'API参考',
          items: [
            { text: '总览', link: '/api/' },
            {
              text: '核心模块',
              items: [
                { text: '路由 (Route)', link: '/api/route' },
                { text: '会话 (Session)', link: '/api/session' },
                { text: '上下文 (Context)', link: '/api/context' },
                { text: '配置 (Config)', link: '/api/config' },
                { text: '平台 (Platform)', link: '/api/platform' },
                { text: '日志 (Logger)', link: '/api/logger' }
              ]
            },
            {
              text: '组件',
              items: [
                { text: '事件 (Event)', link: '/api/event' },
                { text: '中间件 (Middleware)', link: '/api/middleware' },
                { text: '控制台 (Console)', link: '/api/console' },
                { text: '数据库 (Database)', link: '/api/database' },
              ]
            }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发指南',
          items: [
            { text: '总览', link: '/dev/' },
            { text: '插件基础', link: '/dev/plugin' },
            { text: '路由开发', link: '/dev/route' },
            { text: '钩子', link: '/dev/hook' },
            { text: '配置构型', link: '/dev/config' },
            { text: '中间件', link: '/dev/middleware' },
            { text: '事件监听', link: '/dev/event' }
          ]
        }
      ]
    },
    siteTitle: 'Yumeri', //站点标题
    logo: "https://api.flweb.cn/doc/image/bot.jpg",
    nav: [
      { text: "主页", link: "/" },
      { text: "开始", link: "/start/" },
      { text: "开发指南", link: "/dev/" },
      { text: "插件", link: "/plugins/" },
      { text: "API参考", link: "/api/" },
      { text: "风梨团队", link: "//doc.flweb.cn" },
      { text: "鸣谢", link: "/structure/" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/yumerijs" },
    ],
    footer: {
      message: 'Yumerijs',
      copyright: 'Copyright © 2018-2025 <a href="https://doc.flweb.cn/">风梨团队</a>'
    },
    lastUpdatedText: "最近更新时间",
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文章",
            buttonAriaLabel: "搜索文章",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
};
