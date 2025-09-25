import { Transaction, User } from "../../models";
import { storage } from "../../utils/storage";
import { CommissionFacade, TransactionFacade } from "../facade";

export interface ITransactionStrategy {
    executeOrder(
        transFacade: TransactionFacade,
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction>
}

abstract class transactionStrategy implements ITransactionStrategy {
    protected commissionFacade = new CommissionFacade

    abstract executeOrder(
        transFacade: TransactionFacade,
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction>
}

//! strategies below

export class BuyTransaction extends transactionStrategy {
    private TYPE = "buy" as const

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
        const [fees, totalCost] = this.commissionFacade.calculateFees(quantity, executionPrice, this.TYPE);

        if (!user.canAfford(totalCost)) throw new Error("Fondos insuficientes");

        //facade methods
        const transaction = transFacade.createTransaction(user, this.TYPE, symbol, executionPrice, quantity, fees)
        transFacade.completeTransaction(this.TYPE, transaction, user, totalCost, symbol, quantity, executionPrice)

        return transaction;
    }
}

export class SellTransaction extends transactionStrategy {
    private TYPE = "sell" as const

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
        const [fees, totalCost] = this.commissionFacade.calculateFees(quantity, executionPrice, this.TYPE);

        //facade methods
        const transaction = transFacade.createTransaction(user, this.TYPE, symbol, executionPrice, quantity, fees)
        transFacade.completeTransaction(this.TYPE, transaction, user, totalCost, symbol, quantity, executionPrice)

        return transaction;
    }
}