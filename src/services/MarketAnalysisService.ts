// Servicio de análisis de mercado
import { RiskAnalysis } from "../models";
import { AssetsFacade, } from "../patterns/facade";
import { CalculateDiversificationScore, CalculateTemplate, CalculateVolatilityScore } from "../patterns/template";
import { storage } from "../utils/storage";

export class MarketAnalysisService {
  private assetsFaca = new AssetsFacade()
  private calcDiversification: CalculateTemplate = new CalculateDiversificationScore()
  private calcVolatility: CalculateTemplate = new CalculateVolatilityScore()

  // Análisis de riesgo del portafolio
  analyzePortfolioRisk(userId: string): RiskAnalysis {
    const portfolio = storage.portfolio.getByUserId(userId);
    if (!portfolio) {
      throw new Error("Portafolio no encontrado");
    }

    const diversificationScore = this.calcDiversification.calculate(portfolio)
    const volatilityScore = this.calcVolatility.calculate(portfolio);

    //! aplicado state pattern
    const riskAnalysis = new RiskAnalysis(userId);
    riskAnalysis.changeRiskPortfolio(volatilityScore, diversificationScore)

    const recommendations = this.assetsFaca.generateRiskRecommendations(
      diversificationScore,
      volatilityScore,
      riskAnalysis.portfolioRisk
    );

    riskAnalysis.updateRisk(
      diversificationScore,
      recommendations
    );

    return riskAnalysis;
  }

  // Análisis técnico básico
  performTechnicalAnalysis(symbol: string): any {
    const marketData = storage.market.getBySymbol(symbol);
    if (!marketData) throw new Error("Datos de mercado no encontrados");

    const sma20 = this.assetsFaca.calculateSimpleMovingAverage(symbol, 20);
    const sma50 = this.assetsFaca.calculateSimpleMovingAverage(symbol, 50);
    const rsi = this.assetsFaca.calculateRSI(symbol);

    //! state pattern
    this.assetsFaca.changeSignal(marketData.price, sma20, sma50, rsi)

    return {
      symbol: symbol,
      currentPrice: marketData.price,
      sma20: sma20,
      sma50: sma50,
      rsi: rsi,
      signal: this.assetsFaca.getSignal(),
      timestamp: new Date(),
    };
  }

  // Generar recomendaciones de inversión - Lógica básica
  generateInvestmentRecommendations(userId: string): any[] {
    const user = storage.user.getByUserId(userId);
    const portfolio = storage.portfolio.getByUserId(userId);

    if (!user || !portfolio) {
      throw new Error("Usuario o portafolio no encontrado");
    }

    const recommendations: any[] = [];

    const allAssets = storage.asset.getAll();

    allAssets.forEach((asset) => {
      const hasHolding = portfolio.holdings.some(
        (h) => h.symbol === asset.symbol
      );

      //!applied state pattern
      if (!hasHolding) {
        user.changeTolerance(this.assetsFaca.getAssetVolatility(asset.symbol))

        if (user.riskTolerance.recommendation) {
          recommendations.push({
            symbol: asset.symbol,
            name: asset.name,
            currentPrice: asset.currentPrice,
            recommendation: user.riskTolerance.recommendation,
            priority: user.riskTolerance.priority,
            riskLevel:
              this.assetsFaca.getAssetVolatility(asset.symbol) > 60 ? "high" : "medium",
          });
        }
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }
}
