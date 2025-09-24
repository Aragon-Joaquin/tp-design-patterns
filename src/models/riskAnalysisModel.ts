import { IPortfolioRisk, MediumPortfolioRisk } from "../patterns/state";

export class RiskAnalysis {
    userId: string;
    portfolioRisk: IPortfolioRisk;
    diversificationScore: number;
    recommendations: string[];
    calculatedAt: Date;

    constructor(userId: string) {
        this.userId = userId;
        this.portfolioRisk = new MediumPortfolioRisk();
        this.diversificationScore = 0;
        this.recommendations = [];
        this.calculatedAt = new Date();
    }

    updateRisk(
        diversificationScore: number,
        recommendations: string[]
    ): void {
        this.diversificationScore = diversificationScore;
        this.recommendations = recommendations;
        this.calculatedAt = new Date();
    }

    setRiskState = (newP: IPortfolioRisk) => this.portfolioRisk = newP

    changeRiskPortfolio = (v: number, d: number) => this.portfolioRisk.changeRisk(this, v, d)
}
