import { Transaction, User } from "../../models";
import { storage } from "../../utils/storage";
import { PortfolioFacade, TransactionFacade } from "../facade";
import { updatePortfolioAfterBuy, updatePortfolioAfterSell } from "./portfolioUpdateStrat";

export interface ITransactionStrategy {
    executeOrder(
        transFacade: TransactionFacade,
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction>
}

export class BuyTransaction implements ITransactionStrategy {
    private portFacade = new PortfolioFacade(new updatePortfolioAfterBuy)

    private completeTransaction(transFacade: TransactionFacade, transaction: Transaction, user: User, totalCost: number, symbol: string, quantity: number, executionPrice: number): void {
        transaction.complete();

        user.deductBalance(totalCost);
        storage.user.update(user);

        //! we exec strategy
        this.portFacade.execStrategy(user.id, symbol, quantity, executionPrice);

        storage.transaction.add(transaction);

        transFacade.simulateMarketImpact(symbol, quantity, "buy");
    }

    async executeOrder(
        transFacade: TransactionFacade,
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction> {
        const user = storage.user.getByUserId(userId);
        if (!user) throw new Error("Usuario no encontrado");

        const asset = storage.asset.getBySymbol(symbol);
        if (!asset) throw new Error("Activo no encontrado");

        const executionPrice = asset.currentPrice
        const grossAmount = quantity * executionPrice;
        const fees = transFacade.commissionFacade.calculateFees(grossAmount, "buy");
        const totalCost = grossAmount + fees;

        if (!user.canAfford(totalCost)) throw new Error("Fondos insuficientes");

        const transaction = transFacade.createTransaction(user, "buy", symbol, executionPrice, quantity, fees)

        this.completeTransaction(transFacade, transaction, user, totalCost, symbol, quantity, executionPrice)

        return transaction;
    }
}

export class SellTransaction implements ITransactionStrategy {
    private portFacade = new PortfolioFacade(new updatePortfolioAfterSell)

    private completeTransaction(transFacade: TransactionFacade, transaction: Transaction, user: User, totalCost: number, symbol: string, quantity: number, executionPrice: number): void {
        transaction.complete();

        user.deductBalance(totalCost);
        storage.user.update(user);

        //! we exec strategy
        this.portFacade.execStrategy(user.id, symbol, quantity, executionPrice);

        storage.transaction.add(transaction);

        transFacade.simulateMarketImpact(symbol, quantity, "sell");
    }


    async executeOrder(
        transFacade: TransactionFacade,
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction> {
        const user = storage.user.getByUserId(userId);
        if (!user) throw new Error("Usuario no encontrado");

        const asset = storage.asset.getBySymbol(symbol);
        if (!asset) throw new Error("Activo no encontrado");

        const portfolio = storage.portfolio.getByUserId(userId);
        if (!portfolio) throw new Error("Portafolio no encontrado");

        const holding = portfolio.holdings.find((h) => h.symbol === symbol);
        if (!holding || holding.quantity < quantity) throw new Error("No tienes suficientes activos para vender");

        const executionPrice = asset.currentPrice;

        const grossAmount = quantity * executionPrice;
        const fees = transFacade.commissionFacade.calculateFees(grossAmount, "sell");
        const totalCost = grossAmount - fees;

        const transaction = transFacade.createTransaction(user, "sell", symbol, executionPrice, quantity, fees)

        this.completeTransaction(transFacade, transaction, user, totalCost, symbol, quantity, executionPrice)
        return transaction;
    }
}