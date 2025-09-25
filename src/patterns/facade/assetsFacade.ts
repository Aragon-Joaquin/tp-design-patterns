import { Portfolio } from "../../models";
import { ExcludeFirstParam } from "../../types";
import { storage } from "../../utils/storage";
import { IMarketSignal, IPortfolioRisk, MarketHoldSignal, RiskTypes } from "../state";
import { CalculateDiversificationScore, CalculateVolatilityScore } from "../template";

export class AssetsFacade {
    private calcDiversification = new CalculateDiversificationScore()
    private calcVolatility = new CalculateVolatilityScore()
    private marketSignal: IMarketSignal = new MarketHoldSignal()

    setSignal = (signal: IMarketSignal) => this.marketSignal = signal
    getSignal = () => this.marketSignal.getSignal()
    changeSignal = (...args: ExcludeFirstParam<Parameters<IMarketSignal["changeSignal"]>>) =>
        this.marketSignal.changeSignal(this, ...args)

    calculateVolatility = (port: Portfolio) => this.calcVolatility.calculate(port)
    calculateDiversification = (port: Portfolio) => this.calcDiversification.calculate(port)

    // Obtener volatilidad de un activo - Datos simulados
    getAssetVolatility(symbol: string): number {
        const asset = storage.asset.getBySymbol(symbol);
        if (!asset) return 50; // Volatilidad por defecto

        const volatilityBySector: { [key: string]: number } = {
            Technology: 65,
            Healthcare: 45,
            Financial: 55,
            Automotive: 70,
            "E-commerce": 60,
        };

        return volatilityBySector[asset.sector] || 50;
    }

    // Generar recomendaciones
    generateRiskRecommendations(
        diversificationScore: number,
        volatilityScore: number,
        riskLevel: IPortfolioRisk
    ): string[] {
        const recommendations: string[] = [];

        if (diversificationScore < 40) {
            recommendations.push(
                "Considera diversificar tu portafolio invirtiendo en diferentes sectores"
            );
        }

        if (volatilityScore > 70) {
            recommendations.push(
                "Tu portafolio tiene alta volatilidad, considera añadir activos más estables"
            );
        }

        if (riskLevel.getRisk() === RiskTypes.HIGH) {
            recommendations.push(
                "Nivel de riesgo alto detectado, revisa tu estrategia de inversión"
            );
        }

        if (diversificationScore > 80 && volatilityScore < 30) {
            recommendations.push(
                "Excelente diversificación y bajo riesgo, mantén esta estrategia"
            );
        }

        // Recomendaciones genéricas si no hay específicas
        if (recommendations.length === 0) {
            recommendations.push(
                "Tu portafolio se ve balanceado, continúa monitoreando regularmente"
            );
        }

        return recommendations;
    }

    // Calcular SMA - Simulación básica
    calculateSimpleMovingAverage(
        symbol: string,
        periods: number
    ): number {
        const marketData = storage.market.getBySymbol(symbol);
        if (!marketData) return 0;

        // Simulación: SMA = precio actual +/- variación aleatoria
        const randomVariation = (Math.random() - 0.5) * 0.1; // +/- 5%
        return marketData.price * (1 + randomVariation);
    }

    // Calcular RSI - Simulación básica
    calculateRSI(symbol: string): number {
        // Simulación: RSI aleatorio entre 20 y 80
        return 20 + Math.random() * 60;
    }

}