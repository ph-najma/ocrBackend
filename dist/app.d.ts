import express, { Application } from "express";
export declare class App {
    private readonly app;
    constructor();
    /**
     * Configure global middlewares for security, parsing, compression, rate limiting, and logging.
     */
    private initializeMiddleware;
    /**
     * Configure all application routes.
     */
    private initializeRoutes;
    /**
     * Configure error handling for 404 and global exceptions.
     */
    private initializeErrorHandling;
    /**
     * Return the Express application instance.
     */
    getApp(): Application;
}
declare const _default: express.Application;
export default _default;
//# sourceMappingURL=app.d.ts.map