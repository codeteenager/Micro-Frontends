# single-spa源码解析
> 官方文档：https://zh-hans.single-spa.js.org/

single-spa是一个很好的微前端基础框架，而qiankun框架就是基于single-spa来实现的，在single-spa的基础上做了一层封装，也解决了single-spa的一些缺陷。

single-spa是一个小于5kb（gzip）npm包，用于协调微前端的挂载和卸载。只做两件事： 1. 提供生命周期，并负责调度子应用的生命周期。2. 挟持 url 变化，url 变化时匹配对应子应用，并执行生命周期流程。

主要用于前端微服务化的JavaScript前端解决方案  (本身没有处理样式隔离、js执行隔离)  ，实现了路由劫持和应用加载流程。

架构图
![](/application/single-spa/2.png)

我们先从Github上下载single-spa的源码：https://github.com/single-spa/single-spa

![](/application/single-spa/1.jpg)

整个源码采用rollup来构建的，可以从rollup.config.js中找到入口文件，在src/single-spa.js中，对外提供了一系列的方法，像start、registerApplication等。

single-spa最主要的实现了应用的注册、路由的修改和监听。其中路由的监听在src/navigation/navigation-events.js中，应用的注册主要包括了应用的生命周期相关内容在src/lifecycles/xxx.js中。

## 应用注册
应用注册提供了registerApplication方法，源码如下：

```js
export function registerApplication(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps
  );

  if (getAppNames().indexOf(registration.name) !== -1)
    throw Error(
      formatErrorMessage(
        21,
        __DEV__ &&
          `There is already an app registered with name ${registration.name}`,
        registration.name
      )
    );

  apps.push(
    assign(
      {
        loadErrorTime: null,
        status: NOT_LOADED,
        parcels: {},
        devtools: {
          overlays: {
            options: {},
            selectors: [],
          },
        },
      },
      registration
    )
  );

  if (isInBrowser) {
    ensureJQuerySupport();
    reroute();
  }
}
```
首先对调用了sanitizeArguments对registerApplication的参数进行整合，然后判断子应用是否注册过，注册过则抛出异常，然后将子应用添加到apps这个数组中，等到调用start方法时来进行对应的渲染。

## 路由监听
在navigation-events.js中定义了许多的方法，

其中路由监听部分代码如下：
```js
if (isInBrowser) {
  // We will trigger an app change for any routing events.
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  // Monkeypatch addEventListener so that we can ensure correct timing
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      if (
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
        !find(capturedEventListeners[eventName], (listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
        return;
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState"
  );
  window.history.replaceState = patchedUpdateState(
    window.history.replaceState,
    "replaceState"
  );

  if (window.singleSpaNavigate) {
    console.warn(
      formatErrorMessage(
        41,
        __DEV__ &&
          "single-spa has been loaded twice on the page. This can result in unexpected behavior."
      )
    );
  } else {
    /* For convenience in `onclick` attributes, we expose a global function for navigating to
     * whatever an <a> tag's href is.
     */
    window.singleSpaNavigate = navigateToUrl;
  }
}
```
对hashchange和popstate进行监听，如果有路由切换的操作就会执行urlReroute函数，然后对history的pushState和replaceState进行了一层封装，通过patchedUpdateState方法来提供。

```js
function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;

    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      if (isStarted()) {
        // fire an artificial popstate event once single-spa is started,
        // so that single-spa applications know about routing that
        // occurs in a different application
        window.dispatchEvent(
          createPopStateEvent(window.history.state, methodName)
        );
      } else {
        // do not fire an artificial popstate event before single-spa is started,
        // since no single-spa applications need to know about routing events
        // outside of their own router.
        reroute([]);
      }
    }

    return result;
  };
}
```

patchedUpdateState这个方法对旧路由和新路由进行一个对照，如果旧路由不等于新路由，表示子应用进行切换了，则执行微前端自定义的操作代码。

## 生命周期
在src/navigation/reroute.js中，将子应用分为四类：appsToUnload(需要被移除),appsToUnmount(需要被卸载),appsToLoad(需要被加载),appsToMount(需要被挂载),single-spa通过修改app.status来作为参照。