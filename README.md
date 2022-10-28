# Micro-Frontends
微前端实践

https://micro-frontends.org/

## 书籍

* 微前端设计与实现  https://weread.qq.com/web/bookDetail/92d32b60813ab70ccg010da8
* 前端架构：从入门到微前端  链接：https://pan.baidu.com/s/11VNdZ-0xQeHjG500jkjbmw?pwd=ptoj   提取码：ptoj

## 微前端框架
* Single-SPA：是一个用于前端微服务化的JavaScript前端解决方案，实现了路由劫持和应用加载，但是没有处理样式隔离，js执行隔离。https://github.com/single-spa/single-spa
* qiankun：基于Single-SPA提供了更多开箱即用的API（single-spa + sandbox + import-html-entry），做到了与技术栈无关，并且接入简单，靠的是协议接入（子应用必须导出bootstrap、mount、unmount方法）。 https://github.com/umijs/qiankun
* 腾讯的hel-micro：https://github.com/tnfe/hel
* 腾讯的无界：https://github.com/Tencent/wujie
* 美团的Bifrost：[Bifrost微前端框架](https://tech.meituan.com/2019/12/26/meituan-bifrost.html)
* 字节的Garfish：https://github.com/modern-js-dev/garfish
* 阿里的icestark：https://github.com/ice-lab/icestark
* 京东的MicroApp：https://zeroing.jd.com/micro-app/
* EMP：https://github.com/efoxTeam/emp
* 阿里云：https://github.com/aliyun/alibabacloud-alfa

## 相关文章
* [微前端在平台级管理系统中的最佳实践](https://blog.csdn.net/zybank_IT/article/details/120040742)
* [微前端在银行系统中的实践](https://blog.csdn.net/zybank_IT/article/details/120002659)
* [如何落地微前端一体化运营工作台](https://www.bilibili.com/read/cv7859354/)
* [微前端在金融的实践应用](https://mp.weixin.qq.com/s/emZbpCSYtUdvPeZ_aUyVEw)
* [基于 qiankun 的微前端最佳实践（万字长文） - 从 0 到 1 篇](https://github.com/a1029563229/blogs/blob/master/BestPractices/qiankun/Start.md)
* [基于 qiankun 的微前端最佳实践（图文并茂） - 应用间通信篇](https://github.com/a1029563229/blogs/blob/master/BestPractices/qiankun/Communication.md)
* [基于 qiankun 的微前端最佳实践（图文并茂） - 应用部署篇](https://github.com/a1029563229/blogs/blob/master/BestPractices/qiankun/Deploy.md)
* [万字长文+图文并茂+全面解析微前端框架 qiankun 源码 - qiankun 篇](https://github.com/a1029563229/blogs/blob/master/Source-Code/qiankun/1.md)
* [万字长文-落地微前端 qiankun 理论与实践指北](https://juejin.cn/post/7069566144750813197)
* [字节跳动是如何落地微前端的](https://juejin.cn/post/7016911648656982024)
* [基于 iframe 的微前端框架 —— 擎天](https://juejin.cn/post/7143038795816910878)
* [百度关于 EMP 的探索：落地生产可用的微前端架构](https://xie.infoq.cn/article/e16fa87fa8726992a98bb7c99)
* [微前端在得物客服域的实践 ｜ 那么多微前端框架，为啥我们选Qiankun + MF](https://mp.weixin.qq.com/s?__biz=Mzg3OTU5MjY5NQ==&mid=2247485646&idx=2&sn=7c3c9a4433ec3dd9532e2e983260f76d&chksm=cf035d56f874d440da5af431dbb83f1a45d812dbcc70e16cc741a58a5c30476f24ece813c1a8&scene=21#wechat_redirect)
* [京东出品微前端框架MicroApp介绍与落地实践](https://mp.weixin.qq.com/s?__biz=MzUyMDAxMjQ3Ng==&mid=2247496839&idx=1&sn=b2b22a43ecbd93167edeaf86c0683316&chksm=f9f26354ce85ea42f85a5a690aca843dd23f1c2f30c11b5f931dd0c918d388848807a78f1424&scene=21#wechat_redirect)
* [爱番番微前端框架落地实践](https://xie.infoq.cn/article/7dd674911efae889bef4115f8)
* [推开“微前端”的门](https://xie.infoq.cn/article/dc7127af9605a9138d256aeb3)
* [如何设计实现微前端框架-qiankun](https://jishuin.proginn.com/p/763bfbd5a3d8)
* [目标是最完善的微前端解决方案 - qiankun 2.0](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651236407&idx=2&sn=79907657130b49d5c805bbf392bdc39b&chksm=bd4971b38a3ef8a5b4a113eca34834c41b25652e4bba72f09ad718a778723595b790e97b36aa&scene=21#wechat_redirect)
* [iframe 接班人-微前端框架 qiankun 在中后台系统实践](https://zdk.f2er.net/wx/detail/5f7115430ab9263e765c3e25)
* [微前端在网易七鱼的实践](https://juejin.cn/post/6906737928102543374)
* [微前端在美团外卖的实践](https://tech.meituan.com/2020/02/27/meituan-waimai-micro-frontends-practice.html)
* [网易严选企业级微前端解决方案与落地实践](https://www.infoq.cn/article/3azwpv801cuauhiskowb)
* [分享一个美业微前端的落地方案](https://jishuin.proginn.com/p/763bfbd7271c)
* [前端搞微前端 | 伟林 - 如何分三步实施微前端](https://zhuanlan.zhihu.com/p/187187829)
* [一体化微前端研发平台的探索和实践](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651247505&idx=1&sn=b3b44380916b3d6ec183eb26acea4fe7&chksm=bd490a158a3e8303cb1a6e2b5439022566e212c6de018459a5fbab1b8463360ed34fc7f76a55#rd)
* [美团质效工具产品的微前端实践](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651247615&idx=1&sn=0027f14e7b00fffdbbd55cd8a91c2577&chksm=bd490a7b8a3e836d51991745da153538c0d48afb0cfb0a411cc764123b941c8166ba68c2af43#rd)
* [从场景倒推我们要什么样的微前端体系](https://juejin.cn/post/6981638032768106526#heading-5)
* [微前端架构体系思考与实践](https://sunnews.cc/zhihu/518149/%E3%80%90%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB%E3%80%91%E5%BE%AE%E5%89%8D%E7%AB%AF%E6%9E%B6%E6%9E%84%E4%BD%93%E7%B3%BB%E6%80%9D%E8%80%83%E4%B8%8E%E5%AE%9E%E8%B7%B5.html)
* [开源 | 携程度假零成本微前端框架-零界](https://mp.weixin.qq.com/s/AfqA2hpbziweesR3QstYdA)
* [微前端在网易LOFTER中后台业务中的实践（一）——微前端沙箱及微前端应用平台](https://zhuanlan.zhihu.com/p/386839162)
* [微前端在民生 APaaS/PSET 平台的探索与实践](https://xie.infoq.cn/article/a5979a2955050b9201f192c11)
* [微前端技术在游戏平台后台系统的实践](https://xie.infoq.cn/article/56a9596352fbaf52f8cef2711)
* [如何落地微前端一体化运营工作台](https://zhuanlan.zhihu.com/p/161084899)
* [ICE 在微前端的探索](https://zhuanlan.zhihu.com/p/94847293)
* [细述字节的微前端体系](https://jishuin.proginn.com/p/763bfbd65bf0)
* [飞马-中后台微前端页面搭建平台](https://zhuanlan.zhihu.com/p/146709641)
* [手把手教你定制一套适合团队的微前端体系](https://zhuanlan.zhihu.com/p/517175813)
* [微前端如何帮助我们专注业务需求](https://www.infoq.cn/article/saMEwYX67Hm2f2AtkgGc)
* [面向大型工作台的微前端解决方案 icestark](https://zhuanlan.zhihu.com/p/88449415/)
* [前端搞微前端 | 鲲尘 - 如何在大型应用中架构设计微前端方案](https://zhuanlan.zhihu.com/p/197885919)
* [前端搞微前端 | 时光 - 如何在字节设计与实践微前端沙盒](https://zhuanlan.zhihu.com/p/189972873)
