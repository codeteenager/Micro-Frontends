# 模块联邦
> 地址：https://module-federation.github.io/

Module Federation官方称为模块联邦，模块联邦是 webpack5 引入的特性，多个独立构建的应用，可以组成一个应用，这些独立的应用不存在依赖关系，可以独立部署，官方称为微前端。用过qiankun的小伙伴应该知道,qiankun微前端架构控制的粒度是在应用层面，而Module Federation控制的粒度是在模块层面。

与qiankun等微前端架构不同的另一点是，我们一般都是需要一个中心基座去控制微应用的生命周期，而Module Federation则是去中心化的，没有中心基座的概念，每一个模块或者应用都是可以导入或导出，我们可以称为：host和remote，应用或模块即可以是host也可以是remote，亦或者两者共同体。

概念解释：
* webpack构建。一个独立项目通过webpack打包编译而产生资源包。
* remote。一个暴露模块供其他webpakc构建消费的webpack构建。
* host。一个消费其他remote模块的webpack构建。

核心在于 ModuleFederationPlugin中的几个属性：
* remote : 示作为 Host 时，去消费哪些 Remote；
* exposes :表示作为 Remote 时，export 哪些属性提供给 Host 消费
* shared: 可以让远程加载的模块对应依赖改为使用本地项目的 vue，换句话说优先用 Host 的依赖，如果 Host 没有，最后再使用自己的





