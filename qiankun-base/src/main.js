import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { registerMicroApps, start } from 'qiankun';

Vue.use(ElementUI);

Vue.config.productionTip = false
const apps = [
  {
    name: "vueApp",
    entry: "http://localhost:10520", //默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）
    fetch,
    container: '#vue',
    activeRule: '/vue'
  }
];

registerMicroApps(apps);
start();


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
