// Rutas de la API
import { Router } from "express";
import {
  AuthController,
  UserController,
  MarketController,
  TradingController,
  PortfolioController,
  AnalysisController,
} from "../controllers";
import { authenticateApiKey, validateTradeData } from "../middleware";

//* este va a ser nuestro nuevo Router. el nombre muxRouter fue inspirado en el lenguaje "golang"
const router = Router()

//! TODAS ESTAS RUTAS REQUIREN AUTENTICACION!
// Rutas de autenticación
router.get("/auth/validate", authenticateApiKey, AuthController.validateApiKey);

// Rutas de usuarios
router.get("/users/profile", authenticateApiKey, UserController.getProfile);
router.put("/users/profile", authenticateApiKey, UserController.updateProfile);

// Rutas de mercado
router.get("/market/prices", authenticateApiKey, MarketController.getPrices);
router.get("/market/prices/:symbol", authenticateApiKey, MarketController.getPriceBySymbol);

router.get("/trading/history", authenticateApiKey, TradingController.getTransactionHistory);

// Rutas de portafolio
router.get("/portfolio", authenticateApiKey, PortfolioController.getPortfolio);
router.get("/portfolio/performance", authenticateApiKey, PortfolioController.getPerformance);

// Rutas de análisis
router.get("/analysis/risk", authenticateApiKey, AnalysisController.getRiskAnalysis);
router.get("/analysis/recommendations", authenticateApiKey, AnalysisController.getRecommendations);


//! TODAS ESTAS RUTAS REQUIREN AUTENTICACION + VALIDACION DE DATOS!
// Rutas de trading
router.post("/trading/buy", authenticateApiKey, validateTradeData, TradingController.buyAsset);
router.post("/trading/sell", authenticateApiKey, validateTradeData, TradingController.sellAsset);


export default router;
