import { type Application } from 'express';
export default class ExpressServer {
    private routes;
    constructor();
    router(routes: (app: Application) => void): this;
    listen(port: number): Application;
}
