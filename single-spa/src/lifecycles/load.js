import { LOADING_SOURCE_CODE, NOT_BOOTSTRAP } from "../applications/app.helpers";

function flatternFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];
    return props => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
}

export async function toLoadPromise(app) {
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