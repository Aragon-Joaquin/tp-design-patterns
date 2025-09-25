// Servicios de trading
import { Transaction } from "../models";
import { storage } from "../utils/storage";
import { TransactionFacade } from "../patterns/facade";
import { BuyTransaction, SellTransaction } from "../patterns/strategy";

export class TradingService {
  private transactionFacade = new TransactionFacade()

  // Ejecutar orden de compra al precio de mercado
  async executeBuyOrder(userID: string, symbol: string, quantity: number) {
    this.transactionFacade.changeStrategy(new BuyTransaction())
    return await this.transactionFacade.executeOrder(userID, symbol, quantity)
  }

  // Ejecutar orden de venta al precio de mercado
  async executeSellOrder(userID: string, symbol: string, quantity: number) {
    this.transactionFacade.changeStrategy(new SellTransaction())
    return await this.transactionFacade.executeOrder(userID, symbol, quantity)
  }

  // Obtener historial de transacciones
  getTransactionHistory(userId: string): Transaction[] {
    return storage.transaction.getByUserId(userId);
  }
}
