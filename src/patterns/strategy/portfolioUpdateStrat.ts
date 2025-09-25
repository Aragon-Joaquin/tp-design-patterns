import { storage } from "../../utils/storage";
import { PortfolioFacade } from "../facade";

export interface IPortfolioActionStrategy {
    updatePortfolioAfterAction(
        portFacade: PortfolioFacade,
        userId: string,
        symbol: string,
        quantity: number,
        price: number
    ): void
}

//! strategies
export class updatePortfolioAfterBuy implements IPortfolioActionStrategy {
    updatePortfolioAfterAction(
        portFacade: PortfolioFacade,
        userId: string,
        symbol: string,
        quantity: number,
        price: number
    ): void {
        const portfolio = storage.portfolio.getByUserId(userId);
        if (!portfolio) return;

        portfolio.addHolding(symbol, quantity, price);

        portFacade.recalculatePortfolioValues(portfolio);

        storage.portfolio.update(portfolio);
    }
}

export class updatePortfolioAfterSell implements IPortfolioActionStrategy {
    // Actualizar portafolio después de venta
    updatePortfolioAfterAction(
        portFacade: PortfolioFacade,
        userId: string,
        symbol: string,
        quantity: number,
        price: number
    ): void {
        const portfolio = storage.portfolio.getByUserId(userId);
        if (!portfolio) return;

        portfolio.removeHolding(symbol, quantity);

        portFacade.recalculatePortfolioValues(portfolio);

        storage.portfolio.update(portfolio);
    }
}