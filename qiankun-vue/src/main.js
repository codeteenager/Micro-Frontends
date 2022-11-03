import Vue from 'vue'
console.log(Vue);
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// Vue.config.productionTip = false
let instance = null;

function render(props) {
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')  //这里是挂载到自己的html中，然后基座会拿这个挂载的html将其插入进去
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

//子组件的协议
export async function bootstrap() {

}

export async function mount(props) {
  render(props);
}

export async function unmount(props) {
  instance.$destroy();
}