import { Router } from "express"
import { HTTPMethod, HTTPMethods, MiddlewareFunc } from "../../types";

interface MiddlewareHandler {
    setNext(handler: MiddlewareHandler): void;
    handle(...args: Parameters<MiddlewareFunc>): void;
}

//! aplicando el patron de responsabilidad de cadenas??? (chain of responsibility)
export class muxRouter implements MiddlewareHandler {
    public nextHandler: MiddlewareHandler | undefined;
    public router = Router()

    //* ruta madre
    private searchRoute(method: HTTPMethod, route: string, controller: MiddlewareFunc): ReturnType<typeof Router> {

        //puedo hacer object.values(HTTPMethods).includes(methods), pero creo que consume mas memoria
        if (!HTTPMethods[method.toUpperCase() as keyof typeof HTTPMethods])
            throw new Error(`
                Bad http method assignment in the client!, 
                only these are allowed: ${Object.keys(HTTPMethods).join(", ")} 
                `)

        return this.router[method](route, (...args) => {
            const handler = this.nextHandler

            if (!handler) return
            handler.handle(...args)
        }, controller)
    }

    //* patron
    public setNext(handler: MiddlewareHandler): MiddlewareHandler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(...args: Parameters<MiddlewareFunc>) {
        if (!this.nextHandler) return null
        return this.nextHandler.handle(...args);
    }

    //* endpoints
    public Get(route: string, controller: MiddlewareFunc) {
        return this.searchRoute(HTTPMethods.GET, route, controller)
    }

    public Post(route: string, controller: MiddlewareFunc) {
        return this.searchRoute(HTTPMethods.POST, route, controller);
    }

    public Put(route: string, controller: MiddlewareFunc) {
        return this.searchRoute(HTTPMethods.PUT, route, controller);
    }

    public Patch(route: string, controller: MiddlewareFunc) {
        return this.searchRoute(HTTPMethods.PATCH, route, controller);
    }

    public Delete(route: string, controller: MiddlewareFunc) {
        return this.searchRoute(HTTPMethods.DELETE, route, controller);
    }
}