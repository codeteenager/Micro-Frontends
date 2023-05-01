import{_ as e,c as a,o as t,V as s}from"./chunks/framework.adb4887c.js";const g=JSON.parse('{"title":"技术框架","description":"","frontmatter":{},"headers":[],"relativePath":"guide/framework.md","filePath":"guide/framework.md","lastUpdated":1667534116000}'),l={name:"guide/framework.md"},i=s(`<h1 id="技术框架" tabindex="-1">技术框架 <a class="header-anchor" href="#技术框架" aria-label="Permalink to &quot;技术框架&quot;">​</a></h1><ul><li>Single-SPA：是一个用于前端微服务化的JavaScript前端解决方案，实现了路由劫持和应用加载，但是没有处理样式隔离，js执行隔离。<a href="https://github.com/single-spa/single-spa" target="_blank" rel="noreferrer">https://github.com/single-spa/single-spa</a></li><li>qiankun：基于Single-SPA提供了更多开箱即用的API（single-spa + sandbox + import-html-entry），做到了与技术栈无关，并且接入简单，靠的是协议接入（子应用必须导出bootstrap、mount、unmount方法）。 <a href="https://github.com/umijs/qiankun" target="_blank" rel="noreferrer">https://github.com/umijs/qiankun</a></li><li>腾讯的无界：<a href="https://github.com/Tencent/wujie" target="_blank" rel="noreferrer">https://github.com/Tencent/wujie</a></li><li>腾讯的hel-micro：<a href="https://github.com/tnfe/hel" target="_blank" rel="noreferrer">https://github.com/tnfe/hel</a></li><li>美团的Bifrost：<a href="https://tech.meituan.com/2019/12/26/meituan-bifrost.html" target="_blank" rel="noreferrer">Bifrost微前端框架</a></li><li>字节的Garfish：<a href="https://github.com/modern-js-dev/garfish" target="_blank" rel="noreferrer">https://github.com/modern-js-dev/garfish</a></li><li>阿里的icestark：<a href="https://github.com/ice-lab/icestark" target="_blank" rel="noreferrer">https://github.com/ice-lab/icestark</a></li><li>京东的MicroApp：<a href="https://zeroing.jd.com/micro-app/" target="_blank" rel="noreferrer">https://zeroing.jd.com/micro-app/</a></li><li>EMP：<a href="https://github.com/efoxTeam/emp" target="_blank" rel="noreferrer">https://github.com/efoxTeam/emp</a></li><li>阿里云：<a href="https://github.com/aliyun/alibabacloud-alfa" target="_blank" rel="noreferrer">https://github.com/aliyun/alibabacloud-alfa</a></li></ul><h2 id="实现微前端的几种方式" tabindex="-1">实现微前端的几种方式： <a class="header-anchor" href="#实现微前端的几种方式" aria-label="Permalink to &quot;实现微前端的几种方式：&quot;">​</a></h2><ul><li>基于single-spa的qiankun：single-spa的实现原理是首先在基座应用中注册所有App的路由，single-spa保存各子应用的路由映射关系，充当微前端控制器Controler，URL响应时，匹配子应用路由并加载渲染子应用。相比于single-spa，qiankun他解决了JS沙盒环境，不需要我们自己去进行处理。在single-spa的开发过程中，我们需要自己手动的去写调用子应用JS的方法（如上面的 createScript方法），而qiankun不需要，乾坤只需要你传入响应的apps的配置即可，会帮助我们去加载。</li><li>基于WebComponent的micro-app：micro-app并没有沿袭single-spa的思路，而是借鉴了WebComponent的思想，通过CustomElement结合自定义的ShadowDom，将微前端封装成一个类WebComponent组件，从而实现微前端的组件化渲染。并且由于自定义ShadowDom的隔离特性，micro-app不需要像single-spa和qiankun一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改webpack配置，是目前市面上接入微前端成本最低的方案。</li><li>基于webpack5提供的Module Federation的hel-micro框架：Module Federation是Webpack5提出的概念，module federation用来解决多个应用之间代码共享的问题，让我们更加优雅的实现跨应用的代码共享。</li><li>基于iframe的wujie</li></ul><h3 id="iframe方案" tabindex="-1">iframe方案 <a class="header-anchor" href="#iframe方案" aria-label="Permalink to &quot;iframe方案&quot;">​</a></h3><p>qiankun技术圆桌中有一篇关于微前端<a href="https://www.yuque.com/kuitos/gky7yw/gesexv" target="_blank" rel="noreferrer">Why Not Iframe</a>的思考，主要有以下几点：</p><ul><li>iframe 提供了浏览器原生的硬隔离方案，不论是样式隔离、 js 隔离这类问题统统都能被完美解决。</li><li>url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。</li><li>UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..</li><li>全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。</li><li>慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。</li></ul><p>因为这些原因，最终大家都舍弃了 iframe 方案。</p><h3 id="web-component" tabindex="-1">Web Component <a class="header-anchor" href="#web-component" aria-label="Permalink to &quot;Web Component&quot;">​</a></h3><p><a href="https://developer.mozilla.org/zh-CN/docs/Web/Web_Components" target="_blank" rel="noreferrer">MDN Web Components</a>由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。</p><ul><li>Custom elements（自定义元素）：一组JavaScript API，允许您定义custom elements及其行为，然后可以在您的用户界面中按照需要使用它们。</li><li>Shadow DOM（影子DOM）：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。</li><li>HTML templates（HTML模板）： <code>&lt;template&gt;</code> 和 <code>&lt;slot&gt;</code> 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。</li></ul><p>但是兼容性很差，查看<a href="https://caniuse.com/?search=WebComponents" target="_blank" rel="noreferrer">can i use WebComponents</a>。</p><h3 id="single-spa-微前端方案" tabindex="-1">single-spa 微前端方案 <a class="header-anchor" href="#single-spa-微前端方案" aria-label="Permalink to &quot;single-spa 微前端方案&quot;">​</a></h3><p>spa 单页应用时代，我们的页面只有 index.html 这一个 html 文件，并且这个文件里面只有一个内容标签 <div id="app"></div>，用来充当其他内容的容器，而其他的内容都是通过 js 生成的。也就是说，我们只要拿到了子项目的容器 <div id="app"></div> 和生成内容的 js，插入到主项目，就可以呈现出子项目的内容。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">link</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">href</span><span style="color:#89DDFF;">=/css/app.c8c4d97c.css </span><span style="color:#C792EA;">rel</span><span style="color:#89DDFF;">=stylesheet&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;div </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=app&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;script </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=/js/chunk-vendors.164d8230.js&gt; &lt;/script&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;script </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=/js/app.6a6f1dda.js&gt; &lt;/script&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>我们只需要拿到子项目的上面四个标签，插入到主项目的 HTML 中，就可以在父项目中展现出子项目。</p><p>这里有个问题，由于子项目的内容标签是动态生成的，其中的 img/video/audio 等资源文件和按需加载的路由页面 js/css 都是相对路径，在子项目的 index.html 里面，可以正确请求，而在主项目的 index.html 里面，则不能。</p><p>举个例子，假设我们主项目的网址是 <code>www.baidu.com</code> ，子项目的网址是 <code>www.taobao.com</code> ，在子项目的 index.html 里面有一张图片 <code>&lt;img src=&quot;./logo.jpg&quot;&gt;</code>，那么这张图片的完整地址是 <code>www.taobao.com/logo.jpg</code>，现在将这个图片的 img 标签生成到了父项目的 index.html，那么图片请求的地址是 <code>www.baidu.com/logo.jpg</code>，很显然，父项目服务器上并没有这张图。</p><p>解决思路：</p><ol><li>这里面的 js/css/img/video 等都是相对路径，能否通过 webpack 打包，将这些路径全部打包成绝对路径？这样就可以解决文件请求失败的问题。</li><li>能否手动（或借助 node ）将子项目的文件全部拷贝到主项目服务器上，node 监听子项目文件有更新，就自动拷贝过来，并且按 js/css/img 文件夹合并</li><li>能否像 CDN 一样，一个服务器挂了，会去其他服务器上请求对应文件。或者说服务器之间的文件共享，主项目上的文件请求失败会自动去子服务器上找到并返回。</li></ol><p>通常做法是动态修改 webpack 打包的 publicPath，然后就可以自动注入前缀给这些资源。</p><p>single-spa 是一个微前端框架，基本原理如上，在上述呈现子项目的基础上，还新增了 bootstrap 、 mount 、 unmount 等生命周期。</p><p>相对于 iframe，single-spa 让父子项目属于同一个 document，这样做既有好处，也有坏处。好处就是数据/文件都可以共享，公共插件共享，子项目加载就更快了，缺点是带来了 js/css 污染。</p><p>single-spa 上手并不简单，也不能开箱即用，开发部署更是需要修改大量的 webpack 配置，对子项目的改造也非常多。</p>`,24),r=[i];function n(o,p,c,m,h,d){return t(),a("div",null,r)}const b=e(l,[["render",n]]);export{g as __pageData,b as default};
