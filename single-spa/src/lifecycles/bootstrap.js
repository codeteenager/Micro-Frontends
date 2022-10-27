import { NOT_BOOTSTRAP, NOT_MOUNTED } from "../applications/app.helpers";

export async function toBootstrapPromise(app) {
    if (app.status !== NOT_BOOTSTRAP) {
        return app;
    }
    app.status = NOT_BOOTSTRAP;
    await app.bootstrap(app.customProps);
    app.status = NOT_MOUNTED;
    return app;
}