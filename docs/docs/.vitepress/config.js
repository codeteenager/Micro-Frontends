module.exports = {
    title: '微前端',
    description: '微前端技术解析与实践',
    base: '/Micro-Frontends/',
    themeConfig: {
        // siteTitle: false,
        // logo: "/logo.svg",
        nav: [
            {
                text: '首页',
                link: "/guide/introduction"
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-present Codeteenager'
        },
        socialLinks: [{ icon: "github", link: "https://github.com/codeteenager/Micro-Frontends" }],
        sidebar: {
            "/guide/": [
                {
                    text: "基础",
                    items: [
                        {
                            text: "介绍",
                            link: "/guide/introduction",
                        },
                        {
                            text: "框架",
                            link: "/guide/framework",
                        }
                    ],
                },
                {
                    text: "运行时框架",
                    collapsible: true,
                    items: [
                        {
                            text: "应用加载",
                            link: "/guide/load",
                        },
                        {
                            text: "生命周期",
                            link: "/guide/lifecycles",
                        },
                        {
                            text: "路由同步",
                            link: "/guide/route",
                        },
                        {
                            text: "应用通信",
                            link: "/guide/message",
                        },
                        {
                            text: "沙箱隔离",
                            link: "/guide/sandbox",
                        },
                        {
                            text: "异常处理",
                            link: "/guide/error",
                        },
                    ],
                },
                {
                    text: "源码解析",
                    items: [
                        {
                            text: "single-spa",
                            link: "/guide/single-spa",
                        },
                        {
                            text: "qiankun",
                            link: "/guide/qiankun",
                        }
                    ],
                },
                {
                    text: "学习",
                    items: [
                        {
                            text: "相关文章",
                            link: "/guide/learn",
                        },
                        {
                            text: "技术分享",
                            link: "/guide/share",
                        }
                    ],
                }
            ],
        }
    }
}