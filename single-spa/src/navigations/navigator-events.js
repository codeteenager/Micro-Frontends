import { reroute } from "./reroute";

//hashchange popstate
export const routingEventsListeningTo = ['hashchange', 'popstate'];

function urlReroute() {
    reroute([], arguments);
}

const capturedEventListeners = {
    hashchange: [],
    popstate: []
}

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
}
window.removeEventListener = function (eventName, fn) {
    if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(l => l != fn);
        return;
    }
    return originalRemoveEventListener.apply(this, arguments);
}
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

window.history.pushState = patchedUpdateState(window.history.pushState,'pushState');
window.history.replaceState = patchedUpdateState(window.history.replaceState,'replateState');

//用户可能会自己绑定路由事件
