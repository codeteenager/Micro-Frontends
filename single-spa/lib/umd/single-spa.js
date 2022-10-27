(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
})(this, (function (exports) { 'use strict';

   //描述应用的整个状态

   const NOT_LOADED = "NOT_LOADED"; //应用初始状态 
   const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; //加载资源
   const NOT_BOOTSTRAP = "NOT_BOOTSTRAP"; //还没有调用bootstrap方法
   const BOOTSTRAPPING = "BOOTSTRAPPING"; //启动中
   const NOT_MOUNTED = "NOT_MOUNTED"; //没有调用mount方法
   const MOUNTING = "MOUNTING"; //正在挂载中
   const MOUNTED = "MOUNTED"; //挂载完毕
   const UNMOUNTING = "UNMOUNTING"; //卸载中

   //当前这个应用是否要被激活
   function shouldBeActive(app){ //如果返回true，那么应用就应该开始一系列初始化操作
       return app.activeWhen(window.location);
   }

   async function toBootstrapPromise(app) {
       if (app.status !== NOT_BOOTSTRAP) {
           return app;
       }
       app.status = NOT_BOOTSTRAP;
       await app.bootstrap(app.customProps);
       app.status = NOT_MOUNTED;
       return app;
   }

   function flatternFnArray(fns) {
       fns = Array.isArray(fns) ? fns : [fns];
       return props => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
   }

   async function toLoadPromise(app) {
       if(app.loadPromise){
           return app.loadPromise;
       }
       return (app.loadPromise = Promise.resolve().then(async ()=>{
           app.status = LOADING_SOURCE_CODE;
           let { bootstrap, mount, unmount } = await app.loadApp(app.customProps);
           app.status = NOT_BOOTSTRAP;
           app.bootstrap = flatternFnArray(bootstrap);
           app.mount = flatternFnArray(mount);
           app.unmount = flatternFnArray(unmount);
           delete app.loadPromise;
           return app;
       }));
   }

   async function toMountPromise(app) {
       if (app.status !== NOT_MOUNTED) {
           return app;
       }
       app.status = MOUNTING;
       await app.mount(app.customProps);
       app.status = MOUNTED;
       return app;
   }

   async function toUnmountPromise(app) {
       //当前应用如果没有被挂载,直接什么都不做了
       if (app.status != MOUNTED) {
           return app;
       }
       app.status = UNMOUNTING;
       await app.unmount(app.customProps);
       app.status = NOT_MOUNTED;
       return app;
   }

   let started = false;
   function start() {
       //需要挂载应用
       started = true;
       reroute(); //除了加载应用还需要挂载应用
   }

   //hashchange popstate
   const routingEventsListeningTo = ['hashchange', 'popstate'];

   function urlReroute() {
       reroute();
   }

   const capturedEventListeners = {
       hashchange: [],
       popstate: []
   };

   window.addEventListener('hashchange', urlReroute);
   window.addEventListener('popstate', urlReroute);
   const originalAddEventListener = window.addEventListener;
   const originalRemoveEventListener = window.removeEventListener;

   window.addEventListener = function (eventName, fn) {
       if (routingEventsListeningTo.indexOf(eventName) >= 0 && !capturedEventListeners[eventName].some(listener => listener == fn)) {
           capturedEventListeners[eventName].push(fn);
           return;
       }
       return originalAddEventListener.apply(this, arguments);
   };
   window.removeEventListener = function (eventName, fn) {
       if (routingEventsListeningTo.indexOf(eventName) >= 0) {
           capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(l => l != fn);
           return;
       }
       return originalRemoveEventListener.apply(this, arguments);
   };
   //如果是hash路由，hash变化时可以切换
   //浏览器路由，浏览器路由时h5 api的，如果切换时也不会触发popstate
   function patchedUpdateState(updateState,methodName){
       return function(){
           const urlBefore = window.location.href;
           updateState.apply(this,arguments);
           const urlAfter = window.location.href;
           if(urlBefore!==urlAfter){
               //重新加载应用，传入事件源
               urlReroute(new PopStateEvent('popstate'));
           }
       }
   }

   window.history.pushState = patchedUpdateState(window.history.pushState);
   window.history.replaceState = patchedUpdateState(window.history.replaceState);

   //用户可能会自己绑定路由事件

   function reroute() {
       //需要获取要加载的应用
       //需要获取要被挂载的应用
       //哪些应用需要被卸载
       const { appsToUnmount, appsToLoad, appsToMount } = getAppChanges();
       console.log(appsToMount);
       console.log(appsToLoad);
       console.log(appsToUnmount);
       //start方法调用是同步的，但是加载流程是异步的
       if (started) {
           //app装载
           return performAppChanges();
       } else {
           //注册应用时，需要预先加载
           return loadApps(); //预加载应用
       }
       async function loadApps() {//预加载应用
           let apps = await Promise.all(appsToLoad.map(toLoadPromise)); //就是获取到bootstrap,mount,unmount放到app上
           console.log(apps);
       }
       async function performAppChanges() { //根据路径来装载应用
           //先卸载不需要的应用
           appsToUnmount.map(toUnmountPromise);
           //去加载需要的应用
           appsToLoad.map(async (app) => { //将需求加载的应用拿到=》加载=》启动=》挂载
               app = await toLoadPromise(app);
               app = await toBootstrapPromise(app);
               return await toMountPromise(app);
           });
           appsToMount.map(async (app)=>{
               app = await toBootstrapPromise(app);
               return await toMountPromise(app);
           });
       }
   }

   //这个流程是用于初始化操作的，当路径切换时重新加载应用
   //重写路由方法

   /**
    * 
    * @param {*} appName 应用名称
    * @param {*} loadApp 加载的应用
    * @param {*} activeWhen 当激活时调用loadApp
    * @param {*} customProps 自定义属性
    */
   const apps = []; //存放所有的应用

   function registerApplication(appName, loadApp, activeWhen, customProps) {
       apps.push({
           name: appName,
           loadApp,
           activeWhen,
           customProps,
           status: NOT_LOADED
       });
       reroute(); //加载应用
   }

   function getAppChanges() {
       const appsToUnmount = [];//要卸载的app
       const appsToLoad = []; //要加载的app
       const appsToMount = []; //要挂载的app
       apps.forEach(app => {
           //需不需要被加载
           const appShouldBeActive = shouldBeActive(app);
           switch (app.status) {
               case NOT_LOADED:
               case LOADING_SOURCE_CODE:
                   if (appShouldBeActive) {
                       appsToLoad.push(app);
                   }
                   break;
               case NOT_BOOTSTRAP:
               case BOOTSTRAPPING:
               case NOT_MOUNTED:
                   if (appShouldBeActive) {
                       appsToMount.push(app);
                   }
                   break;
               case MOUNTED:
                   if (!appShouldBeActive) {
                       appsToUnmount.push(app);
                   }
           }
       });
       return { appsToUnmount, appsToLoad, appsToMount };
   }

   exports.registerApplication = registerApplication;
   exports.start = start;

}));
//# sourceMappingURL=single-spa.js.map
