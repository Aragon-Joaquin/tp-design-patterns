import { NextFunction, Request, Response } from "express";
import { storage } from "../utils/storage";
import { config } from "../config";

// Middleware de autenticación por API key
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: "API key requerida",
      message: "Incluye el header x-api-key en tu request",
    });
  }

  // Validar API key hardcodeada
  const username = config.apiKeys[apiKey as keyof typeof config.apiKeys];
  if (!username) {
    return res.status(401).json({
      error: "API key inválida",
      message: "La API key proporcionada no es válida",
    });
  }

  // Buscar usuario en storage
  const user = storage.user.getByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({
      error: "Usuario no encontrado",
      message: "No se encontró un usuario asociado a esta API key",
    });
  }

  // Agregar usuario al request
  req.user = user;
  next();
};
