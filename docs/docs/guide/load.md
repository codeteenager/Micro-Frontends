# 应用加载

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

## JS Entry
JS Entry 的方式通常是子应用将资源打成一个 entry script，要求子应用的所有资源打包到一个 js bundle 里，包括 css、图片等资源。像single-spa通常是结合SystemJS来实现，在single-spa框架中，基座会检测浏览器url的变化，在变化时往往通过SystemJS的import映射，来加载不同的子应用js。

### Import maps
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

### SystemJS
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

## Html Entry

HTML Entry 是由 [import-html-entry](https://github.com/kuitos/import-html-entry) 库实现的，通过 http 请求加载指定地址的首屏内容即 html 页面，然后解析这个 html 模版得到 template, scripts , entry, styles。

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

![](/application/import-entry-html.webp)







