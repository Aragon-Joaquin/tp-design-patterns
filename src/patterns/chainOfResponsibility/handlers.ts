import { authenticateApiKey, validateTradeData } from "../../middleware";
import { MiddlewareFunc } from "../../types";
import { muxRouter } from "./middlewareDecorator";

//! handlers. 

// el callback pasado a los authHandlers es para evitar que el siguiente el error lo crashee:
// "Cannot set headers after they are sent to the client".
export class AuthHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        const [req, res, next] = args

        try {
            authenticateApiKey(req, res, () => {
                if (this.nextHandler) next()
                else return
            })
            super.handle(...args);
        } catch (error) {}

    }
}

export class ValidateTradeHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        const [req, res, next] = args
        
        try {
            validateTradeData(req, res, () => {
                if (this.nextHandler) next()
                else return
            })
            super.handle(...args);
        } catch (error) {}
    }
}