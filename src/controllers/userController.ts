import { Request, Response } from "express";
import { storage } from "../utils/storage";

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const user = req.user;

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          riskTolerance: user.riskTolerance,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener perfil",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const user = req.user;
      const { email, riskTolerance } = req.body;

      // Validaciones básicas
      if (email && typeof email !== "string") {
        return res.status(400).json({
          error: "Email inválido",
          message: "El email debe ser una cadena válida",
        });
      }

      if (riskTolerance && !["low", "medium", "high"].includes(riskTolerance)) {
        return res.status(400).json({
          error: "Tolerancia al riesgo inválida",
          message: "La tolerancia al riesgo debe ser: low, medium o high",
        });
      }

      // Actualizar campos
      if (email) user.email = email;
      if (riskTolerance) user.riskTolerance = riskTolerance;

      storage.updateUser(user);

      res.json({
        message: "Perfil actualizado exitosamente",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          riskTolerance: user.riskTolerance,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar perfil",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
