import { Transaction, User } from "../../models";
import { storage } from "../../utils/storage";
import { BuyTransaction, ITransactionStrategy } from "../strategy";
import { CommissionFacade } from "./tradingService";

//! facade + strategy
export class TransactionFacade {
    public commissionFacade = new CommissionFacade
    private transactionStrat: ITransactionStrategy = new BuyTransaction()

    // Simulación de impacto en el mercado después de una operación
    simulateMarketImpact(
        symbol: string,
        quantity: number,
        action: "buy" | "sell"
    ): void {
        const marketData = storage.market.getBySymbol(symbol);
        if (!marketData) return;

        const impactFactor = quantity / 1000000; // Factor arbitrario
        const priceImpact = marketData.price * impactFactor * 0.001;

        const newPrice =
            action === "buy"
                ? marketData.price + priceImpact
                : marketData.price - priceImpact;

        const change = newPrice - marketData.price;
        const changePercent = (change / marketData.price) * 100;

        marketData.price = newPrice;
        marketData.change = change;
        marketData.changePercent = changePercent;
        marketData.timestamp = new Date();

        const asset = storage.asset.getBySymbol(symbol);
        if (asset) {
            asset.currentPrice = newPrice;
            asset.lastUpdated = new Date();
            storage.asset.update(asset);
        }

        storage.market.update(marketData);
    }

    createTransaction(user: User, type: "buy" | "sell", symbol: string, price: number, quantity: number, fees: number): Transaction {
        return new Transaction(
            this.generateTransactionId(),
            user.id,
            type,
            symbol,
            quantity,
            price,
            fees
        );
    }


    executeOrder = async (userID: string, symbol: string, quantity: number) => await this.transactionStrat.executeOrder(this, userID, symbol, quantity)
    changeStrategy = (t: ITransactionStrategy) => this.transactionStrat = t

    // Generar ID único para transacciones
    private generateTransactionId(): string {
        return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }
}