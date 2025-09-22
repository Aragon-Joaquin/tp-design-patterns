import { authenticateApiKey, validateTradeData } from "../../middleware";
import { MiddlewareFunc } from "../../types";
import { muxRouter } from "./middlewareDecorator";

//! auth handlers
export class AuthHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        authenticateApiKey(...args)
        super.handle(...args);
    }
}

export class ValidateTradeHandler extends muxRouter {
    public handle(...args: Parameters<MiddlewareFunc>) {
        validateTradeData(...args)
        super.handle(...args)
    }
}