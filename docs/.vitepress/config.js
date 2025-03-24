export default {
    head: [
        ['link', { rel: 'icon', href: '/logo2.png' }],
    ],
    title: 'MC WindyPear社区服',
    lastUpdated: true,
    description: 'MC WindyPear社区服，为打造良好的养老社区环境而努力',
    lang: 'zh-CN',
    themeConfig: {
        siteTitle: 'MC WindyPear社区服', //站点标题
        logo: "https://api.flweb.cn/logos/MCWP/icon.jpg",
        description: '一个Minecraft养老社区化服务器',//MCWindyPear Organization
        nav: [
            { text: "主页", link: "/" },
            { text: "风梨网", link: "//www.flweb.cn" },
            { text: "鸣谢", link: "/structure/" },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/windypear-team" },
        ],
        footer: {
            message: 'MCWindyPear',
            copyright: 'Copyright © 2018-2024 <a href="https://www.flweb.cn/">风梨团队</a>'
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
