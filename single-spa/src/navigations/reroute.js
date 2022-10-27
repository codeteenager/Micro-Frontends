import { getAppChanges } from "../applications/app";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";
import './navigator-events';

export function reroute() {
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
        let unmountPromises = appsToUnmount.map(toUnmountPromise);
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