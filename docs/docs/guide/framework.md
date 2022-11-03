# 技术框架

* Single-SPA：是一个用于前端微服务化的JavaScript前端解决方案，实现了路由劫持和应用加载，但是没有处理样式隔离，js执行隔离。https://github.com/single-spa/single-spa
* qiankun：基于Single-SPA提供了更多开箱即用的API（single-spa + sandbox + import-html-entry），做到了与技术栈无关，并且接入简单，靠的是协议接入（子应用必须导出bootstrap、mount、unmount方法）。 https://github.com/umijs/qiankun
* 腾讯的无界：https://github.com/Tencent/wujie
* 腾讯的hel-micro：https://github.com/tnfe/hel
* 美团的Bifrost：[Bifrost微前端框架](https://tech.meituan.com/2019/12/26/meituan-bifrost.html)
* 字节的Garfish：https://github.com/modern-js-dev/garfish
* 阿里的icestark：https://github.com/ice-lab/icestark
* 京东的MicroApp：https://zeroing.jd.com/micro-app/
* EMP：https://github.com/efoxTeam/emp
* 阿里云：https://github.com/aliyun/alibabacloud-alfa

## 实现微前端的几种方式：
* 基于single-spa的qiankun：single-spa的实现原理是首先在基座应用中注册所有App的路由，single-spa保存各子应用的路由映射关系，充当微前端控制器Controler，URL响应时，匹配子应用路由并加载渲染子应用。相比于single-spa，qiankun他解决了JS沙盒环境，不需要我们自己去进行处理。在single-spa的开发过程中，我们需要自己手动的去写调用子应用JS的方法（如上面的 createScript方法），而qiankun不需要，乾坤只需要你传入响应的apps的配置即可，会帮助我们去加载。
* 基于WebComponent的micro-app：micro-app并没有沿袭single-spa的思路，而是借鉴了WebComponent的思想，通过CustomElement结合自定义的ShadowDom，将微前端封装成一个类WebComponent组件，从而实现微前端的组件化渲染。并且由于自定义ShadowDom的隔离特性，micro-app不需要像single-spa和qiankun一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改webpack配置，是目前市面上接入微前端成本最低的方案。
* 基于webpack5提供的Module Federation的hel-micro框架：Module Federation是Webpack5提出的概念，module federation用来解决多个应用之间代码共享的问题，让我们更加优雅的实现跨应用的代码共享。
* 基于iframe的wujie

### iframe方案
iframe 大家都很熟悉，使用简单方便，提供天然的 js/css 隔离，也带来了数据传输的不便，一些数据无法共享（主要是本地存储、全局变量和公共插件），两个项目不同源（跨域）情况下数据传输需要依赖 postMessage 。

iframe 有很多坑，但是大多都有解决的办法：

1. 页面加载问题
iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载，阻塞 onload 事件。每次点击都需要重新加载，虽然可以采用 display:none 来做缓存，但是页面缓存过多会导致电脑卡顿。(无法解决)

2. 布局问题
iframe 必须给一个指定的高度，否则会塌陷。

解决办法：子项目实时计算高度并通过 postMessage 发送给主页面，主页面动态设置 iframe 高度。有些情况会出现多个滚动条，用户体验不佳。

3. 弹窗及遮罩层问题
弹窗只能在 iframe 范围内垂直水平居中，没法在整个页面垂直水平居中。
* 解决办法1：通过与框架页面消息同步解决，将弹窗消息发送给主页面，主页面来弹窗，对原项目改动大且影响原项目的使用。
* 解决办法2：修改弹窗的样式：隐藏遮罩层，修改弹窗的位置。

4. iframe 内的 div 无法全屏
弹窗的全屏，指的是在浏览器可视区全屏。这个全屏指的是占满用户屏幕。

全屏方案，原生方法使用的是 Element.requestFullscreen()，插件：vue-fullscreen。当页面在 iframe 里面时，全屏会报错，且 dom 结构错乱。

解决方案：iframe 标签设置 allow="fullscreen" 属性即可

5. 浏览器前进/后退问题
iframe 和主页面共用一个浏览历史，iframe 会影响页面的前进后退。大部分时候正常，iframe 多次重定向则会导致浏览器的前进后退功能无法正常使用。并且 iframe 页面刷新会重置（比如说从列表页跳转到详情页，然后刷新，会返回到列表页），因为浏览器的地址栏没有变化，iframe 的 src 也没有变化。

6. iframe 加载失败的情况不好处理
非同源的 iframe 在火狐及 chorme 都不支持 onerror 事件。
* 解决办法1：onload 事件里面判断页面的标题，是否 404 或者 500
* 解决办法2：使用 try catch 解决此问题，尝试获取 contentDocument 时将抛出异常。

### single-spa 微前端方案
spa 单页应用时代，我们的页面只有 index.html 这一个 html 文件，并且这个文件里面只有一个内容标签 <div id="app"></div>，用来充当其他内容的容器，而其他的内容都是通过 js 生成的。也就是说，我们只要拿到了子项目的容器 <div id="app"></div> 和生成内容的 js，插入到主项目，就可以呈现出子项目的内容。

```js
<link href=/css/app.c8c4d97c.css rel=stylesheet>
<div id=app></div>
<script src=/js/chunk-vendors.164d8230.js> </script>
<script src=/js/app.6a6f1dda.js> </script>
```

我们只需要拿到子项目的上面四个标签，插入到主项目的 HTML 中，就可以在父项目中展现出子项目。

这里有个问题，由于子项目的内容标签是动态生成的，其中的 img/video/audio 等资源文件和按需加载的路由页面 js/css 都是相对路径，在子项目的 index.html 里面，可以正确请求，而在主项目的 index.html 里面，则不能。

举个例子，假设我们主项目的网址是 `www.baidu.com` ，子项目的网址是 `www.taobao.com` ，在子项目的 index.html 里面有一张图片 `<img src="./logo.jpg">`，那么这张图片的完整地址是 `www.taobao.com/logo.jpg`，现在将这个图片的 img 标签生成到了父项目的 index.html，那么图片请求的地址是 `www.baidu.com/logo.jpg`，很显然，父项目服务器上并没有这张图。

解决思路：
1. 这里面的 js/css/img/video 等都是相对路径，能否通过 webpack 打包，将这些路径全部打包成绝对路径？这样就可以解决文件请求失败的问题。
2. 能否手动（或借助 node ）将子项目的文件全部拷贝到主项目服务器上，node 监听子项目文件有更新，就自动拷贝过来，并且按 js/css/img 文件夹合并
3. 能否像 CDN 一样，一个服务器挂了，会去其他服务器上请求对应文件。或者说服务器之间的文件共享，主项目上的文件请求失败会自动去子服务器上找到并返回。

通常做法是动态修改 webpack 打包的 publicPath，然后就可以自动注入前缀给这些资源。

single-spa 是一个微前端框架，基本原理如上，在上述呈现子项目的基础上，还新增了 bootstrap 、 mount 、 unmount 等生命周期。

相对于 iframe，single-spa 让父子项目属于同一个 document，这样做既有好处，也有坏处。好处就是数据/文件都可以共享，公共插件共享，子项目加载就更快了，缺点是带来了 js/css 污染。

single-spa 上手并不简单，也不能开箱即用，开发部署更是需要修改大量的 webpack 配置，对子项目的改造也非常多。
