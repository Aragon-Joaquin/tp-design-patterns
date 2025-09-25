import { Portfolio } from "../../models";
import { storage } from "../../utils/storage";
import { AssetsFacade } from "../facade";

abstract class CalculateTemplate {
    constructor(protected assetsFac: AssetsFacade) { }

    calculate(portfolio: Portfolio): number {
        if (portfolio.holdings.length === 0) return 0;

        const sectorScore = this.iterateSectors(portfolio) ?? 0

        let totalCount = 0

        portfolio.holdings.forEach(holdings => {
            totalCount += this.manipulateHolding(portfolio, holdings, sectorScore)
        })

        return Math.min(this.controlFinalScore(totalCount, sectorScore), 100)
    }

    abstract iterateSectors(portfolio: Portfolio): number
    abstract manipulateHolding(portfolio: Portfolio, holding: Portfolio['holdings'][number], totalSectors: number): number
    abstract controlFinalScore(totalCount: number, sectorScore: number): number
}

export class CalculateDiversificationScore extends CalculateTemplate {
    iterateSectors(portfolio: Portfolio): number {
        const sectors = new Set<string>();
        portfolio.holdings.forEach((holding) => {
            const asset = storage.asset.getBySymbol(holding.symbol);
            if (asset) {
                sectors.add(asset.sector);
            }
        });
        const maxSectors = 5; // Número máximo de sectores considerados
        return Math.min(sectors.size / maxSectors, 1) * 50;

    }

    manipulateHolding(portfolio: Portfolio, holding: Portfolio["holdings"][number], _: number): number {
        const weight = holding.currentValue / portfolio.totalValue;
        if (weight > 0.3) return (weight - 0.3) * 100;
        return 0
    }

    controlFinalScore(totalCount: number, sectorScore: number): number {
        const distributionScore = Math.max(50 - totalCount, 0);
        return Math.min(sectorScore + distributionScore, 100);
    }
}

export class CalculateVolatilityScore extends CalculateTemplate {
    iterateSectors = (_: Portfolio): number => 0

    manipulateHolding(portfolio: Portfolio, holding: Portfolio["holdings"][number], _: number): number {
        const weight = holding.currentValue / portfolio.totalValue;
        const assetVolatility = this.assetsFac.getAssetVolatility(holding.symbol);
        return weight * assetVolatility;
    }

    controlFinalScore(totalCount: number, _: number): number {
        return totalCount
    }
}