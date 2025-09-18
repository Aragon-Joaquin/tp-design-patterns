import { NextFunction, Request, Response } from "express";
import { config } from "../config";

// Middleware de validación de datos de trading
export const validateTradeData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { symbol, quantity, price } = req.body;

  // Validaciones básicas
  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({
      error: "Símbolo requerido",
      message: "El símbolo del activo es requerido y debe ser una cadena",
    });
  }

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({
      error: "Cantidad inválida",
      message: "La cantidad debe ser un número mayor a 0",
    });
  }

  if (price && (typeof price !== "number" || price <= 0)) {
    return res.status(400).json({
      error: "Precio inválido",
      message: "El precio debe ser un número mayor a 0",
    });
  }

  // Validar límites de configuración
  if (quantity > config.limits.maxOrderSize) {
    return res.status(400).json({
      error: "Cantidad excede el límite",
      message: `La cantidad máxima por orden es ${config.limits.maxOrderSize}`,
    });
  }

  if (quantity < config.limits.minOrderSize) {
    return res.status(400).json({
      error: "Cantidad por debajo del mínimo",
      message: `La cantidad mínima por orden es ${config.limits.minOrderSize}`,
    });
  }

  next();
};
