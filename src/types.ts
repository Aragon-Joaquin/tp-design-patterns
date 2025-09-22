import { NextFunction, Request, Response } from "express";

export const HTTPMethods = {
    POST: "post",
    GET: "get",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
} as const;

export type HTTPMethod = typeof HTTPMethods[keyof typeof HTTPMethods];

export type MiddlewareFunc = (req: Request, res: Response, next: NextFunction) => void