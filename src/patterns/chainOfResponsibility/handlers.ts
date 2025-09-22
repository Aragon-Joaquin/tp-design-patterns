import { authenticateApiKey, validateTradeData } from "../../middleware";
import { MiddlewareFunc } from "../../types";
import { muxRouter } from "./middlewareDecorator";

//! handlers. 
//TODO: Cannot set headers after they are sent to the client
export class AuthHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        try {
            authenticateApiKey(...args)
            super.handle(...args);
        } catch (e) {
            console.log("Error en AuthHandler: ", e)
        }

    }
}

export class ValidateTradeHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        try {
            validateTradeData(...args)
            super.handle(...args)
        } catch (e) {
            console.log("Error en TradeHanlder: ", e)
        }

    }
}