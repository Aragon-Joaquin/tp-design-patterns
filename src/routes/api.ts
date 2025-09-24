// Rutas de la API
import {
  AuthController,
  UserController,
  MarketController,
  TradingController,
  PortfolioController,
  AnalysisController,
} from "../controllers";
import { AuthHandler, muxRouter, ValidateTradeHandler } from "../patterns/chainOfResponsibility";

//* este va a ser nuestro nuevo Router. el nombre muxRouter fue inspirado en el lenguaje "golang"
const router = new muxRouter()

//* nuestros handlers
const authHandler = new AuthHandler()
const tradeDataHandler = new ValidateTradeHandler()

router.setNext(authHandler)

//! TODAS ESTAS RUTAS REQUIREN AUTENTICACION!
// Rutas de autenticación
router.Get("/auth/validate", AuthController.validateApiKey);

// Rutas de usuarios
router.Get("/users/profile", UserController.getProfile);
router.Put("/users/profile", UserController.updateProfile);

// Rutas de mercado
router.Get("/market/prices", MarketController.getPrices);
router.Get("/market/prices/:symbol", MarketController.getPriceBySymbol);

router.Get("/trading/history", TradingController.getTransactionHistory);

// Rutas de portafolio
router.Get("/portfolio", PortfolioController.getPortfolio);
router.Get("/portfolio/performance", PortfolioController.getPerformance);

// Rutas de análisis
router.Get("/analysis/risk", AnalysisController.getRiskAnalysis);
router.Get("/analysis/recommendations", AnalysisController.getRecommendations);


//! TODAS ESTAS RUTAS REQUIREN AUTENTICACION + VALIDACION DE DATOS!
// Rutas de trading
authHandler.setNext(tradeDataHandler);

router.Post("/trading/buy", TradingController.buyAsset);
router.Post("/trading/sell", TradingController.sellAsset);


export default router;
