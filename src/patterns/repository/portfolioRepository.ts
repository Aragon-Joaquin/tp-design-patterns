import { Portfolio } from "../../models/portfolioModel";

interface IPortfolioRepository {
    getByUserId(userId: string): Portfolio | undefined
    update(portfolio: Portfolio): void
}

export class PortfolioRepository implements IPortfolioRepository {
    constructor(private data: Map<string, Portfolio> = new Map()) { }

    getByUserId(userId: string): Portfolio | undefined {
        return this.data.get(userId);
    }

    update(portfolio: Portfolio): void {
        this.data.set(portfolio.userId, portfolio);
    }
}

