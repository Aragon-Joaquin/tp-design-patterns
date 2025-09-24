import { IPortfolioRisk, MediumPortfolioRisk } from "../patterns";

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
        volability: number,
        diversificationScore: number,
        recommendations: string[]
    ): void {
        this.portfolioRisk.changeRisk(this, volability, diversificationScore)
        this.diversificationScore = diversificationScore;
        this.recommendations = recommendations;
        this.calculatedAt = new Date();
    }

    setRiskState = (newP: IPortfolioRisk) => this.portfolioRisk = newP
}
