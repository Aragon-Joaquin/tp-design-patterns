// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export * from './authMiddleware'
export * from './loggerMiddleware'
export * from './validateTradeMiddleware'