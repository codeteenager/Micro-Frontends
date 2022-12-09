# single-spa使用
> 官方文档：https://zh-hans.single-spa.js.org/

single-spa是一个很好的微前端基础框架，而qiankun框架就是基于single-spa来实现的，在single-spa的基础上做了一层封装，也解决了single-spa的一些缺陷。

single-spa是一个小于5kb（gzip）npm包，用于协调微前端的挂载和卸载。只做两件事： 1. 提供生命周期，并负责调度子应用的生命周期。2. 挟持 url 变化，url 变化时匹配对应子应用，并执行生命周期流程。

在single-spa框架中有三种类型的微前端应用：
* single-spa-application/parcel：微前端架构中的微应用，可以使用vue、react、angular等框架，这种微应用与路由相关联，parcel与application不同点是它不与路由相关联，它用于跨应用共享UI组件。
* single-spa root config：创建微前端容器应用，用于加载、管理普通的微应用。
* utility modules：公共模块应用，非渲染组件，用于跨应用共享javascript逻辑的微应用。

这三种微应用都是单独的微应用，都是单独开发，单独发布。


架构图
![](/application/single-spa/2.png)

## 创建容器应用
1. 安装 single-spa 脚手架工具： npm install create-single-spa -g
2. 创建微前端应用目录： mkdir workspace && cd workspace
3. 创建微前端容器应用： create-single-spa
    1. 应用文件夹填写 container
    2. 应用选择 single-spa root config
    3. 组织名称填写，应用名称的命名规则为 @组织名称/应用名称 ，比如 @study/todos
4. 启动应用： npm start
5. 访问应用： localhost:9000

在container/src下，自动生成了两个文件root-config.js和index.ejs。
1. root-config，容器应用入口文件
```js
//workspace/container/src/xxx-root-config.js
import { registerApplication, start } from "single-spa"
/*
 注册微前端应用
 1. name: 字符串类型, 微前端应用名称 "@组织名称/应用名称"
   2. app: 函数类型, 返回 Promise, 通过 systemjs 引用打包好的微前端应用模块代码
(umd)
 3. activeWhen: 路由匹配时激活应用
*/
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
  System.import(
    "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
 ),
  activeWhen: ["/"]
})

// start 方法必须在 single spa 的配置文件中调用
// 在调用 start 之前, 应用会被加载, 但不会初始化, 挂载或卸载.
start({
  // 是否可以通过 history.pushState() 和 history.replaceState() 更改触发single-spa 路由
  // true 不允许 false 允许
  urlRerouteOnly: true
})
```
2. index.ejs，模板文件
```html
<!-- JavaScript 模块下载地址 此处可放置微前端项目中的公共模块 -->
<script type="systemjs-importmap">
 {
 "imports": {
 "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.8.3/lib/system/single-spa.min.js"
     }
 }
</script>
<!-- single-spa 预加载 -->
<link
 rel="preload"
  href="https://cdn.jsdelivr.net/npm/single-spa@5.8.3/lib/system/single-spa.min.js"
  as="script"
/>
<!-- 模块加载器 -->
<script
src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/system.min.js">
</script>
<!-- systemjs 用来解析 AMD 模块的插件 -->
<script
src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/extras/amd.min.js"
></script>
<!-- 用于覆盖通过 import-map 设置的 JavaScript 模块下载地址 -->
<script src="https://cdn.jsdelivr.net/npm/import-map-overrides@2.2.0/dist/import-map-overrides.js"></script>
<!-- 导入微前端容器应用 -->
<script>
  System.import("@study/root-config")
</script>
<!-- 
 import-map-overrides 可以覆盖导入映射
 当前项目中用于配合 single-spa Inspector 调试工具使用.
 可以手动覆盖项目中的 JavaScript 模块加载地址, 用于调试.
-->
<import-map-overrides-full show-when-local-storage="devtools" dev-libs></import-map-overrides-full>
```

## 创建不基于框架的微应用
在workspace下创建child应用，然后执行`npm init`初始化项目，然后安装依赖，`npm install webpack webpack-cli webpack-config-single-spa webpack-dev-server webpack-merge single-spa --save`，然后配置`webpack.config.js`文件，配置webpack。
```js
const { merge } = require("webpack-merge")
const singleSpaDefaults = require("webpack-config-single-spa")

module.exports = () => {
    const defaultConfig = singleSpaDefaults({
        // 组织名称
        orgName: "codeteenager",
        // 项目名称
        projectName: "child"
    })
    return merge(defaultConfig, {
        devServer: {
            port: 9001
        }
    })
}
```
在 package.json 文件中添加应用启动命令
```js
"scripts": {
  "start": "webpack serve"
}
```
然后创建src/codeteenager-child.js入口文件，在应用入口文件中导出微前端应用所需的生命周期函数，生命周期函数必须返回 Promise。

```js
let childContainer = null
export const bootstrap = async function () {
    console.log("应用正在启动")
}
export const mount = async function () {
    console.log("应用正在挂载")
    childContainer = document.createElement("div")
    childContainer.innerHTML = "Hello child"
    childContainer.id = "childContainer"
    document.body.appendChild(childContainer)
}
export const unmount = async function () {
    console.log("应用正在卸载")
    document.body.removeChild(childContainer)
}
```

然后在微前端容器应用中注册微前端应用
```js
registerApplication({
  name: "@codeteenager/child",
  app: () => System.import("@codeteenager/child"),
  activeWhen: ["/child"]
})
```
在模板文件中指定模块访问地址
```html
<script type="systemjs-importmap">
{
    "imports": {
    "@codeteenager/root-config": "//localhost:9000/codeteenager-root-config.js",
    "@codeteenager/child": "//localhost:9001/codeteenager-child.js"
    }
}
</script>
```
修改默认应用的代码
```js
// 注意: 参数的传递方式发生了变化, 原来是传递了一个对象, 对象中有三项配置, 现在是传递了三个参数
registerApplication(
  "@single-spa/welcome",
 () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
   ),
  location => location.pathname === "/"
)
```

## 创建基于React的微应用
在workspace下执行命令`creat-single-spa`，应用目录输入`child-react`，框架选择react，生成项目工程后配置webpack.config.js端口为9002.

注册应用，将 React 项目的入口文件注册到基座应用中
```js
registerApplication({
   name: "@codeteenager/child-react",
   app: () => System.import("@codeteenager/child-react"),
   activeWhen: ["/child-react"]
 })
```

指定微前端应用模块的引用地址
```html
<script type="systemjs-importmap">
    {
      "imports": {
        "@codeteenager/root-config": "//localhost:9000/codeteenager-root-config.js",
        "@codeteenager/child": "//localhost:9001/codeteenager-child.js",
        "@codeteenager/child-react": "//localhost:9002/codeteenager-child-react.js"
      }
    }
</script>
```

指定公共库的访问地址，默认情况下，应用中的 react 和 react-dom 没有被 webpack 打包， single-spa 认为它是公共库，
不应该单独打包。
```html
<script type="systemjs-importmap">
{
    "imports": {
    "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
    "react": "https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js",
    "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js",
    "react-router-dom": "https://cdn.jsdelivr.net/npm/react-router-dom@5.2.0/umd/react-router-dom.min.js"
    }
}
</script>
```
编写微前端 React 应用入口文件代码
```js
// react、react-dom 的引用是 index.ejs 文件中 import-map 中指定的版本
import React from "react";
import ReactDOM from "react-dom";
// single-spa-react 用于创建使用 React 框架实现的微前端应用
import singleSpaReact from "single-spa-react";
// 用于渲染在页面中的根组件
import Root from "./root.component";

// 指定根组件的渲染位置
const domElementGetter = () => document.getElementById("childReactContainer")
// 错误边界函数
const errorBoundary = () => <div>发生错误时此处内容将会被渲染</div>

// 创建基于 React 框架的微前端应用, 返回生命周期函数对象
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter,
  errorBoundary
});

// 暴露必要的生命周期函数
export const { bootstrap, mount, unmount } = lifecycles;
```
修改webpack配置
```js
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "codeteenager",
    projectName: "child-react",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    externals: ["react-router-dom"],
    // modify the webpack config however you'd like to by adding to this object
    devServer: {
      port: 9002
    }
  });
};
```
在容器应用模板中指定渲染位置，该节点对应入口文件的domElementGetter渲染位置。
```html
<div id="childReactContainer"></div>
```

##  创建基于 Vue 的微应用
同样使用create-single-spa命令来创建应用，输入名称，框架选择vue，生成vue2项目即可。

配置webpack.config.js，配置externals，设置启动端口，同时将应用打包成system规范。
```js
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9003
  },
  
  chainWebpack: config => {
    config.externals(["vue", "vue-router"])
    config.output.libraryTarget('system');
  }
})
```

填写公共库
```html
<script type="systemjs-importmap">
{
 "imports": {
     "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
     "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vue-router.min.js"
 }
}
</script>
```

在容器中配置微应用引入地址
```html
<script type="systemjs-importmap">
    {
      "imports": {
        "@codeteenager/child-vue": "//localhost:9003/js/app.js"
      }
    }
  </script>
```

注册应用，将Vue项目的入口文件注册到基座应用中即可。
```js
 registerApplication({
   name: "@codeteenager/child-vue",
   app: () => System.import("@codeteenager/child-vue"),
   activeWhen: ["/child-vue"]
 })
```

如果遇到以下错误，将index.ejs中Content-Security-Policy meta注释掉即可。
![](/application/foundation/3.png)


## 创建 Parcel 应用
Parcel 用来创建公共 UI，涉及到跨框架共享 UI 时需要使用 Parcel。Parcel 的定义可以使用任何 single-spa 支持的框架，它也是单独的应用，需要单独启动，但是它不关联路由。Parcel 应用的模块访问地址也需要被添加到 import-map 中，其他微应用通过 System.import 方法进行引用。

我们借助上述创建的react应用来测试创建的parcel应用。还是通过create-single-spa创建react应用。

配置webpack.config.js
```js
externals: ["react-router-dom"],
devServer: {
    port: 9004
}
```
在容器container模板文件中指定应用模块地址。

```html
<script type="systemjs-importmap">
    {
      "imports": {
        "@codeteenager/test-parcel": "//localhost:9004/codeteenager-test-parcel.js"
      }
    }
  </script>
```

然后在react子应用中引用该组件
```js
import Parcel from "single-spa-react/parcel"
<Parcel config={System.import("@codeteenager/test-parcel")} />
```

## 创建 utility modules
用于放置跨应用共享的 JavaScript 逻辑，它也是独立的应用，需要单独构建单独启动。

使用create-single-spa命令来创建，然后选择`in-browser utility module (styleguide, api cache, etc)`，工程创建完成后，在入口文件导出方法。
```js
export function sayHello() {
     console.log("Hello World!!!!")
}
```

在模板文件中声明应用模块访问地址
```js
<script type="systemjs-importmap">
{
 "imports": {
      "@codeteenager/tools": "//localhost:9005/codeteenager-tools.js"
   }
}
</script>
```

在React微应用中使用该方法
```js
// import Parcel from "single-spa-react/parcel"
import React, { useEffect, useState } from "react"

function useToolsModule() {
  const [toolsModule, setToolsModule] = useState()
  useEffect(() => {
    System.import("@codeteenager/tools").then(setToolsModule)
  }, [])
  return toolsModule
}

export default function Root(props) {
  const toolsModule = useToolsModule()
  if (toolsModule) toolsModule.sayHello("todos")
  return <section>{props.name} is mounted!
  {/* <Parcel config={System.import("@codeteenager/test-parcel")} /> */}
  </section>;
}

```

在Vue中引用该方法
```js
<h1 @click="handleClick">{{ name }}</h1>
async handleClick() {
  let toolsModule = await window.System.import("@codeteenager/tools")
  toolsModule.sayHello("realworld")
}
```

## 布局引擎的使用
布局引擎允许使用组件的方式声明顶层路由，访问什么样的地址，显示什么样的应用，这种方式类似react配置路由的方式，并且提供了更加便捷的路由API用来注册应用。

首先安装布局引擎，`npm install single-spa-layout --save`，然后再index.ejs模板文件中配置路由。
```html
<template id="single-spa-layout">
     <single-spa-router>
      <!--    <application name="@study/navbar"></application> -->
         <route default>
             <application name="@single-spa/welcome"></application>
           </route>
         <route path="child">
             <application name="@codeteenager/child"></application>
           </route>
         <route path="child-react">
             <application name="@codeteenager/child-react"></application>
           </route>
         <route path="child-vue">
             <application name="@codeteenager/child-vue"></application>
           </route>
       </single-spa-router>
  </template>
```

以上就是将路由配置成组件的形式，他就是一种语法糖，最终还是需要通过registerApplication来注册应用。将原本registerApplication注册应用的方式更改为以下方式。
```js
import { constructApplications, constructRoutes } from "single-spa-layout"
// 获取路由配置对象
const routes = constructRoutes(document.querySelector("#single-spa-layout"))
// 获取路由信息数组
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name)
  }
})

// 遍历路由信息注册应用
applications.forEach(registerApplication)
```









