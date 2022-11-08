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
                        },
                        {
                            text: "模块联邦",
                            link: "/guide/module-federation",
                        }
                    ],
                },
                {
                    text: "基础设施",
                    collapsible: true,
                    items: [
                        {
                            text: "运行时框架",
                            link: "/guide/runtime",
                        }
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
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        }
    }
}