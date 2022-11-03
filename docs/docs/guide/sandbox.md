# 沙箱隔离

## 样式隔离
### shadowDOM
目前相对来说使用最多的样式隔离机制
![](/application/shadowDOM.png)

### BEM、CSS Modules
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

### CSS in JS
使用JS写CSS，也是目前比较主流的方案，完全不需要些单独的 css 文件，所有的 css 代码全部放在组件内部，以实现 css 的模块化，但对于历史代码不好处理

### postcss
使用postcss，在全局对所有class添加统一的前缀，但是在编译时处理，会增加编译时间；

## JS隔离
### 基于proxy的沙箱机制
像qiankun一样，用其代理 window——Web 应用运行中最重要的上下文环境。每个 Web 应用都会与 window 交互，无数的 API 也同样挂靠在 window 上，要达到允许独立运行的微前端环境，首先需要 window 隔开。 

在采用 Proxy 作为沙箱机制方案时，主要还是基于 get、set、has、getOwnPropertyDescriptor 等关键拦截器对 window 进行代理拦截；至于Proxy颗粒度的区别，可以见qiankun中JS隔离的实现。

### 基于iframe的沙箱机制
iframe 标签可以创造一个独立的浏览器级别的运行环境，该环境与主环境隔离，并有自己的 window 上下文；在通信机制上，也可以利用 postMessage 等 API 与宿主环境进行通信。具体来说，在执行 JavaScript 代码上，有以下要求： 
1. 应用间运行时隔离：常见的是使用shadowDOM创建的样式隔离DOM，再使用Proxy拦截JS的执行，代理到shadowDOM所创建的隔离开的DOM上； 
2. 应用间通信：同域：window.parent，不同域：postMessage；或者eventBus等自定义的方式实现；
3. 路由劫持： 
  * a. 让 JavaScript 沙箱内路由变更操作在主应用环境生效：但这种对于相对路径的配置，如接口请求处理太繁琐，一般不建议； 
  * b. 同步沙箱内路由变化至主应用环境：监听iframe路由上下文，同步到主应用路由上，如wujie；




