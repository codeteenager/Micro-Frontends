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

