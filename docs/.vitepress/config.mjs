import { defineConfig } from 'vitepress'

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: 'https://api.flweb.cn/logos/yumeri/circle.png' }],
  ],
  lastUpdated: true,
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: 'Yumeri',
      description: '基于nodejs的新一代模块化web应用构建平台',

      themeConfig: {
        lastUpdatedText: "最近更新时间",
        nav: [
          { text: "主页", link: "/" },
          {
            text: "开发",
            items: [
              { text: "开发指南", link: "/dev/" },
              { text: "插件列表", link: "/plugins/" },
              { text: "API参考", link: "/api/" },
            ]
          },
          { text: "风梨团队", link: "//doc.flweb.cn" },
          { text: "鸣谢", link: "/structure/" },
        ],
        sidebar: {
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
                    { text: '日志 (Logger)', link: '/api/logger' },
                    { text: '国际化 (I18n)', link: '/api/i18n' }
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

          '/plugins/': [
            {
              text: '插件列表',
              items: [
                { text: '插件市场', link: '/plugins/' },
                { text: '数据统计', link: '/plugins/analyse' },
                { text: '用户登录', link: '/plugins/authority' },
                { text: '文件管理', link: '/plugins/files' },
                { text: '控制台日志', link: '/plugins/logger' },
                { text: '插件商店', link: '/plugins/market' },
                { text: '页面模型', link: '/plugins/pages' },
                { text: '权限模型', link: '/plugins/permission' },
                { text: '全局代理', link: '/plugins/proxy-agent' },
                { text: '前端小工具合集', link: '/plugins/tinytools' },
                { text: '用户模型', link: '/plugins/user' },
              ]
            }
          ],

          '/dev/': [
            {
              text: '开发指南',
              items: [
                { text: '总览', link: '/dev/' },
                { text: '环境搭建', link: '/dev/setup' },
                { text: '插件基础', link: '/dev/plugin' },
                { text: '装饰器 API', link: '/dev/decorator' },
                { text: '路由系统', link: '/dev/route' },
                { text: '配置构型', link: '/dev/config' },
                { text: '中间件', link: '/dev/middleware' },
                { text: '钩子系统', link: '/dev/hook' },
                { text: '事件监听', link: '/dev/event' },
                { text: 'Schema 可视化', link: '/dev/schema-builder' },
                { text: '渲染器（实验）', link: '/dev/renderer' }
              ]
            }
          ]
        },
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Yumeri',
      description: 'A new generation modular web application building platform based on nodejs',

      themeConfig: {
        lastUpdatedText: "Last Updated",
        nav: [
          { text: "Home", link: "/en/" },
          {
            text: "Development",
            items: [
              { text: "Guide", link: "/en/dev/" },
              { text: "Plugins", link: "/en/plugins/" },
              { text: "API Reference", link: "/en/api/" },
            ]
          },
          { text: "WindyPear Team", link: "//doc.flweb.cn" },
        ],
        sidebar: {
          '/en/dev/': [
            {
              text: 'Development Guide',
              items: [
                { text: 'Overview', link: '/en/dev/' },
                { text: 'Setup', link: '/en/dev/setup' },
                { text: 'Plugin Basics', link: '/en/dev/plugin' },
                { text: 'Route Development', link: '/en/dev/route' },
                { text: 'Hooks', link: '/en/dev/hook' },
                { text: 'Config Structure', link: '/en/dev/config' },
                { text: 'Middleware', link: '/en/dev/middleware' },
                { text: 'Event Listening', link: '/en/dev/event' }
              ]
            }
          ]
          // ... similarly update en/api/ and en/plugins/ if needed, but keeping en/dev focus for now
        },
      }
    },
  },
  themeConfig: {
    logo: "https://api.flweb.cn/logos/yumeri/circle.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/yumerijs" },
    ],
    footer: {
      message: 'Yumerijs',
      copyright: 'Copyright © 2018-2025 <a href="https://doc.flweb.cn/">风梨团队</a>'
    },
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
  }
});
