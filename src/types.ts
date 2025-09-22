export const HTTPMethods = {
    POST: "post",
    GET: "get",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
} as const;

export type HTTPMethod = typeof HTTPMethods[keyof typeof HTTPMethods];