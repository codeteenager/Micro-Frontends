# 模块联邦
> 地址：https://module-federation.github.io/

Module Federation官方称为模块联邦，模块联邦是 webpack5 引入的特性，多个独立构建的应用，可以组成一个应用，这些独立的应用不存在依赖关系，可以独立部署，官方称为微前端。用过qiankun的小伙伴应该知道,qiankun微前端架构控制的粒度是在应用层面，而Module Federation控制的粒度是在模块层面。

与qiankun等微前端架构不同的另一点是，我们一般都是需要一个中心基座去控制微应用的生命周期，而Module Federation则是去中心化的，没有中心基座的概念，每一个模块或者应用都是可以导入或导出，我们可以称为：host和remote，应用或模块即可以是host也可以是remote，亦或者两者共同体。

概念解释：
* webpack构建。一个独立项目通过webpack打包编译而产生资源包。
* remote。一个暴露模块供其他webpakc构建消费的webpack构建。
* host。一个消费其他remote模块的webpack构建。

## 使用

模块联邦本身是一个普通的Webpack插件：ModuleFederationPlugin，插件有如下重要使用参数：
* name：当前应用名称，需要全局唯一。
* filename: 入口文件名称，用于对外提供模块时候的入口文件名，若没有提供 filename，那么构建生成的文件名与容器名称同名。
* remotes：需要依赖的远程模块，用于引入外部其他模块，作为Host时，去消费哪些Remote。
* exposes：表示导出的模块，用于提供给外部其他项目进行使用，作为Remote时，export哪些属性被消费。
* library：定义了remote应用如何将输出内容暴露给host应用。配置项的值是一个对象，如 { type: 'xxx', name: 'xxx'}。
* shared：配置共享的组件，一般是对第三方库做共享使用。shared要想生效，则host应用和remote应用的shared配置的依赖要一致。
   + Singleton: 是否开启单例模式。默认值为 false，开启后remote 应用组件和 host 应用共享的依赖只加载一次，而且是两者中版本比较高的
   + requiredVersion：指定共享依赖的版本，默认值为当前应用的依赖版本
   + eager：共享依赖在打包过程中是否被分离为 async chunk。设置为 true， 共享依赖会打包到 main、remoteEntry，不会被分离，因此当设置为true时共享依赖是没有意义的

我们首先建两个应用，一个作为host应用，一个作为remote应用。

在remote应用中首先在src/components/下新增UserList.vue组件，然后webpack配置ModuleFederationPlugin插件将组件暴露出去供host调用。

```js
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = {
   plugins: [
        new ModuleFederationPlugin({
            name: 'user',
            filename: 'remoteEntry.js',
            library: { type: "var", name: "user" },
            exposes: {
                './UserList': './src/components/UserList.vue',
            }
        })
   ]
}
```

然后在host应用中同样配置ModuleFederationPlugin插件，配置remotes引用user对外暴露的组件。

```js
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = {
   plugins: [
      new ModuleFederationPlugin({
         name: 'root',
         filename: 'remoteEntry.js',
         remotes:{
               user: 'user@http://localhost:8091/remoteEntry.js'
         }
      }),
   ]
}
```

最后在vue中引入组件，即可使用。
```js
<script>
export default {
  components: { UserList: () => import("user/UserList") }
}
</script>
```







