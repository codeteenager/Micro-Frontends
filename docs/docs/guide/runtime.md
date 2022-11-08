# 运行时框架
运行时框架主要做了以下这些事：

* 应用加载 - 根据注册的子应用，通过给定的 url，加载约定格式的子应用入口，并挂载到给定位置
部分框架是根据类似 manifest 的数据，来获取子应用注册情况以及入口地址
部分框架支持和管理平台配合，运行时接受平台动态注入的入口地址 (也有框架宣称运行时注入和管理平台解耦，但实际是如果不用，就得自己实现注入逻辑)
JS 做入口更纯粹，用 HTML 做入口更易于旧项目改造
业界目前常用两种入口格式， HTML 和 JS
父子入口组合(即确定依赖关系)也有两种模式，构建时组合 和 运行时组合
* 生命周期 - 加载 / 挂载 / 更新 / 卸载 等
加载 / 挂载时做的初始化、权限守卫、i18n 语言等
卸载时做清理，如卸载 script 标签、style 标签、子应用 dom 等
以及路由、父子通信时做双向更新的桥梁
* 路由同步 - 子应用的路由切换时，同步更新 url；url 跳转 / 更新时，同步更新子应用
也就是对子应用做到路由等同于 url
* 应用通信 - 是说支持父子应用之间便捷地相互通信，不像 postMessage 那样难用 (指字符串)
什么。
* 沙箱隔离 - 为了各个应用「互补干扰」，需要把各个应用在“隔离”的环境中执行
缺少隔离的话，CSS 全局样式可能 冲突混乱，JS 全局变量可能被 污染 / 篡改 / 替换。
* 异常处理 - 以上所有东西在报错时的统一处理，比如加载失败、或者路由匹配失败

## 应用加载

App Entry作为子应用的加载入口，微前端框架根据注册的子应用，通过给定的 url，加载约定格式的子应用入口，并挂载到给定位置，目前业内有两种entry: JS Entry 和 Html Entry。

|     | 说明  |优点  |缺点  |
|  ----  | ----  |----  |----  |
|  html | html作为子应用入口 | 解耦更彻底，子应用不依赖于主应用DOM，子应用独立开发，独立部署     | 多了一次对html的请求，解析有性能损耗，无法做构建时优化     |   
| js  | js作为子应用入口 |  便于做构建时优化     |   依赖主应用提供挂载节点，打包产物体积膨胀，资源无法并行加载    |

Js Entry 的缺点是：
* 子应用更新打包后的 js bundle 名称会变化，主应用需要保证每次获取都是最新的 js bundle
* 子应用所有资源打包到一个文件中，会失去 css 提取、静态资源并行加载、首屏加载(体积巨大)等优化。
* 需要在子应用打包过程中，修改相应的配置以补全子应用 js 资源的路径。

而Html Entry只需要指定子应用的 html 入口即可，微前端框架在加载 html 字符串后，从中提取出 css、js 资源，运行子应用时，安装样式、执行脚本，运行脚本中提供的生命周期钩子。因此优点也很明显：
* 无需关心应用打包后的 js 名称变化的问题。
* 仍然可以享受 css提取、静态资源并行加载（内部使用 Promise.all 并行发出请求资源）、首屏加载等优化。
* 请求资源时，自动补全资源路径。

### JS Entry
JS Entry 的方式通常是子应用将资源打成一个 entry script，要求子应用的所有资源打包到一个 js bundle 里，包括 css、图片等资源。像single-spa通常是结合SystemJS来实现，在single-spa框架中，基座会检测浏览器url的变化，在变化时往往通过SystemJS的import映射，来加载不同的子应用js。

#### Import maps
[Import maps](https://github.com/WICG/import-maps)这个功能是Chrome 89才支持的。它是对import的一个映射处理，让你控制在js中使用import时，到底从哪个url获取这些库。

比如通常我们会在js中，以下面这种方式引入模块：
```js
import moment from "moment"
```

正常情况下肯定是node_modules中引入，但是现在我们在html中加入下面的代码：

```js
<script type="importmap">
    {
        "imports": {
            "moment": "/moment/src/moment.js"
        }
    }
</script>
```

这里/moment/src/moment.js这个地址换成一个cdn资源也是可以的。最终达到的效果就是：

```js
import moment from "/moment/src/moment.js"
```

有了Import maps，import的语法就可以直接在浏览器中使用，而不再需要webpack来帮我们进行处理，不需要从node_modules中去加载库。

Import maps甚至还有一个兜底的玩法：

```js
"imports": {
        "jquery": [
            "https://某CDN/jquery.min.js",
            "/node_modules/jquery/dist/jquery.js"
        ]
}

```

当cdn无效时，再从本地库中获取内容。

尽管Import maps非常强大，但是毕竟浏览器兼容性还并不是很好，所以就有了我们的polifill方案：SystemJS

#### SystemJS
SystemJs是一个通用的模块加载器，有属于自己的模块化规范。他能在浏览器和node环境上动态加载模块，微前端的核心就是加载子应用，因此将子应用打包成模块，在浏览器中通过SystemJs来加载模块。SystemJS可兼容到IE11，但是它对于插件版本要求非常严格，而且变化非常大，兼容性也不是特别好，使用体验也不是很好，所以目前实践中用的非常少。它同样支持import映射，但是它的语法稍有不同:

```js
<script src="system.js"></script>
<script type="systemjs-importmap">
{
    "imports": {
        "lodash": "https://unpkg.com/lodash@4.17.10/lodash.js"
    }
}
</script>
```
在浏览器中引入system.js后，会去解析type为systemjs-importmap的script下的import映射。

### Html Entry

HTML Entry 是由 [import-html-entry](https://github.com/kuitos/import-html-entry) 库实现的，这个库主要做了这些事情：
1. 加载 entry html (index.html) 的内容到内存。
2. 将 entry html 中的 css、js、link 等标签下的内容获取出来(包含外部的和内联的)，整理成网页所需的 js、css 列表。并将无用标签去掉(例如注释、ignore 等)。
3. 加载所有外链 js 脚本，并将这些外链 js 和内联 js 一起整理为 script list。
4. 加载所有外链 css 文件，并将其以内联(`<style/>`)的方式插入到 entry html 中。
5. 将处理后的 entry html 和待执行的 script list 返回给调用方(基座)。


通过 http 请求加载指定地址的首屏内容即 html 页面，然后解析这个 html 模版得到 template, scripts , entry, styles。

```js
{
  template: 经过处理的脚本，link、script 标签都被注释掉了,
  scripts: [脚本的http地址 或者 { async: true, src: xx } 或者 代码块],
  styles: [样式的http地址],
 	entry: 入口脚本的地址，要不是标有 entry 的 script 的 src，要不就是最后一个 script 标签的 src
}
```

然后远程加载 styles 中的样式内容，将 template 模版中注释掉的 link 标签替换为相应的 style 元素。

然后向外暴露一个 Promise 对象
```js
{
  // template 是 link 替换为 style 后的 template
	template: embedHTML,
	// 静态资源地址
	assetPublicPath,
	// 获取外部脚本，最终得到所有脚本的代码内容
	getExternalScripts: () => getExternalScripts(scripts, fetch),
	// 获取外部样式文件的内容
	getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
	// 脚本执行器，让 JS 代码(scripts)在指定 上下文 中运行
	execScripts: (proxy, strictGlobal) => {
		if (!scripts.length) {
			return Promise.resolve();
		}
		return execScripts(entry, scripts, proxy, { fetch, strictGlobal });
	}
}

```

在 import-html-entry 库处理完之后，基座在需要的加载子应用时候将这个 html 放到对应的 DOM 容器节点，并执行 script list，即完成子应用的加载。

![](/application/runtime/1.webp)

>了解更多
* [HTML Entry 源码分析](https://blog.csdn.net/m0_66439275/article/details/122792280)
* [揭开 import-html-entry 面纱](https://blog.csdn.net/qq_41800366/article/details/122093720)


## 路由同步
子应用注册的时候，提供子应用激活规则 (路由字符串 或 函数)。因此，监听 hashchange 和 popstate 事件，在事件回调函数中，根据注册的子应用激活规则，卸载/激活子应用。

以 Vue-Router 的 history 模式为例，在切换路由时，通常会做三件重要事情：执行一连串的 hook 函数、更新url、router-view 更新，其中更新 url，就是通过 pushState/replaceState 的形式实现的。因此重写并增强 history.pushState 和 history.replaceState 方法，在执行它们的时候，可以拿到执行前、执行后的 url，对比是否有变化，如果有，根据注册的子应用激活规则，卸载/激活子应用。

以single-spa为例：

```js
  // We will trigger an app change for any routing events.
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  // Monkeypatch addEventListener so that we can ensure correct timing
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      if (
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
        !find(capturedEventListeners[eventName], (listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
        return;
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState"
  );
  window.history.replaceState = patchedUpdateState(
    window.history.replaceState,
    "replaceState"
  );
```
以上主要是增加了hashchange、popstate两个监听，监听url的变化。同时重写pushState以及replaceState方法，在方法中调用原有方法后执行如何处理子应用的逻辑监听hashchange及popstate事件，事件触发后执行如何处理子应用的逻辑。


## 生命周期
single-spa的一个关键点就是生命周期，子应用生命周期包含bootstrap，mount，unmount三个回调函数。主应用在管理子应用的时候，通过子应用暴露的生命周期函数来实现子应用的启动和卸载。

![](/application/runtime/3.webp)

* load：当应用匹配路由时就会加载脚本（非函数，只是一种状态）。
* bootstrap：应用内容首次挂载到页面前调用。
* Mount：当主应用判定需要激活这个子应用时会调用, 实现子应用的挂载、页面渲染等逻辑。
* unmount：当主应用判定需要卸载这个子应用时会调用, 实现组件卸载、清理事件监听等逻辑。
* unload：非必要函数，一般不使用。unload之后会重新启动bootstrap流程。


## 沙箱隔离
子应用和基座的隔离主要有两点：

* 样式隔离
* js 隔离

### 样式隔离
#### shadowDOM
目前相对来说使用最多的样式隔离机制
![](/application/runtime/2.png)

#### BEM、CSS Modules
BEM：Block Element Module命名约束
* B：Block一个独立的模块，一个本身就有意义的独立实体，比如：header、menu、container
* E：Element元素，块的一部分但是自身没有独立的含义，比如：header title、container input
* M：Modifier修饰符，块或者元素的一些状态或者属性标志，比如：small、checked

```css
模块：.Block 
模块多单词： .Header-Block 
模块_状态： .Block_Modifier 
模块__子元素： .Block__Element 
模块__子元素_状态： .Block__Element_Modifier
```
CSS Modules：
代码中的每一个类名都是引入对象的一个属性，通过这种方式，即可在使用时明确指定所引用的 css 样式。并且 CSS Modules 在打包的时候会自动将类名转换成 hash 值，完全杜绝 css 类名冲突的问题；

#### CSS in JS
使用JS写CSS，也是目前比较主流的方案，完全不需要些单独的 css 文件，所有的 css 代码全部放在组件内部，以实现 css 的模块化，但对于历史代码不好处理

#### postcss
使用postcss，在全局对所有class添加统一的前缀，但是在编译时处理，会增加编译时间；

### JS隔离
js 隔离的核心是在基座和子应用中使用不同的上下文 (global env)，从而达成基座和子应用之间 js 运行互不影响。
>简单来说，就是给子应用单独的 window，避免对基座的 window 造成污染。

#### qiankun的沙箱机制
qiankun在js隔离上，同样提供了3种方案，分别是：
1. LegacySandbox - 传统js沙箱，目前已弃用，需要配置sandbox.loose = true开启。此沙箱使用 Proxy 代理子应用对 window 的操作，将子应用对 window 的操作同步到全局 window 上，造成侵入。但同时会将期间对 window 的新增、删除、修改操作记录到沙箱变量中，在子应用关闭时销毁，再根据记录将 window 还原到初始状态。
2. ProxySandbox - 代理js沙箱，非IE浏览器默认使用此沙箱。和 LegacySandbox 同样基于 Proxy 代理子应用对 window 的操作，和 LegacySandbox 不同的是，ProxySandbox 会创建一个虚拟的 window 对象提供给子应用使用，哪怕是在运行时，子应用也不会侵入对 window，实现完全的隔离。
3. SnapshotSandbox - 快照 js 沙箱，IE 浏览器默认使用此沙箱。因为 IE 不支持 Proxy。此沙箱的原理是在子应用启动时，创建基座 window 的快照，存到一个变量中，子应用的 window 操作实质上是对这个变量操作。SnapshotSandbox 同样会将子应用运行期间的修改存储至 modifyPropsMap 中，以便在子应用创建和销毁时还原。


#### 基于iframe的沙箱机制
iframe 标签可以创造一个独立的浏览器级别的运行环境，该环境与主环境隔离，并有自己的 window 上下文；在通信机制上，也可以利用 postMessage 等 API 与宿主环境进行通信。具体来说，在执行 JavaScript 代码上，有以下要求： 
1. 应用间运行时隔离：常见的是使用shadowDOM创建的样式隔离DOM，再使用Proxy拦截JS的执行，代理到shadowDOM所创建的隔离开的DOM上； 
2. 应用间通信：同域：window.parent，不同域：postMessage；或者eventBus等自定义的方式实现；
3. 路由劫持： 
  * a. 让 JavaScript 沙箱内路由变更操作在主应用环境生效：但这种对于相对路径的配置，如接口请求处理太繁琐，一般不建议； 
  * b. 同步沙箱内路由变化至主应用环境：监听iframe路由上下文，同步到主应用路由上，如wujie；


## 应用通信

* 基于URL来进行数据传递，但是传递消息能力弱
* 基于CustomEvent实现通信
* 基于props主子应用间通信
* 使用全局变量、Redus进行通信

## 异常处理
当运行中发生错误时，需要对其进行捕获，这里主要监听了error和unhandledrejection两个错误事件。

```js
window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', errorHandler);
```