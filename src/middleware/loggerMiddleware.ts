import { NextFunction, Request, Response } from "express";

// Middleware de logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers["user-agent"] || "Unknown";

  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);

  // Log adicional si hay usuario autenticado
  if (req.user) {
    console.log(`[${timestamp}] Authenticated user: ${req.user.username}`);
  }

  next();
};

