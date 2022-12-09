import { registerApplication, start } from "single-spa";
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

// registerApplication("@single-spa/welcome",
//   () =>
//     System.import(
//       "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
//     ),
//   location => location.pathname === "/")

// registerApplication({
//   name: "@codeteenager/navbar",
//   app: () => System.import("@codeteenager/navbar"),
//   activeWhen: ["/"]
// });

// registerApplication({
//   name: "@codeteenager/child",
//   app: () => System.import("@codeteenager/child"),
//   activeWhen: ["/child"]
// })

// registerApplication({
//    name: "@codeteenager/child-react",
//    app: () => System.import("@codeteenager/child-react"),
//    activeWhen: ["/child-react"]
//  })

//  registerApplication({
//    name: "@codeteenager/child-vue",
//    app: () => System.import("@codeteenager/child-vue"),
//    activeWhen: ["/child-vue"]
//  })

start({
  urlRerouteOnly: true,
});
