import { RiskAnalysis } from "../../models";

export const RiskTypes = {
    "LOW": "low",
    "MEDIUM": "medium",
    "HIGH": "high",
} as const

type RiskKeyTypes = typeof RiskTypes[keyof typeof RiskTypes]

export interface IPortfolioRisk {
    changeRisk(risk: RiskAnalysis, v: number, d: number): void //v = volatility, d = 
    getRisk(): RiskKeyTypes
}

//! portfolio risks
export class LowPortfolioRisk implements IPortfolioRisk {
    changeRisk(risk: RiskAnalysis, v: number, d: number): void {
        if (v < 60 && d > 40) risk.setRiskState(new MediumPortfolioRisk());
        else risk.setRiskState(new HighPortfolioRisk());
    }

    getRisk = (): RiskKeyTypes => RiskTypes.LOW
}

export class MediumPortfolioRisk implements IPortfolioRisk {
    changeRisk(risk: RiskAnalysis, v: number, d: number): void {
        if (v < 30 && d > 70) risk.setRiskState(new LowPortfolioRisk());
        else risk.setRiskState(new HighPortfolioRisk());
    }

    getRisk = (): RiskKeyTypes => RiskTypes.MEDIUM
}

export class HighPortfolioRisk implements IPortfolioRisk {
    changeRisk(risk: RiskAnalysis, v: number, d: number) {
        if (v < 30 && d > 70) return risk.setRiskState(new LowPortfolioRisk());
        if (v < 60 && d > 40) return risk.setRiskState(new MediumPortfolioRisk());
    }

    getRisk = (): RiskKeyTypes => RiskTypes.HIGH
}