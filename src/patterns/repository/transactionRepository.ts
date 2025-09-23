import { Transaction } from "../../models/transactionModel"


interface ITransactionRepository {
    add(transaction: Transaction): void
    getAll(): Transaction[]
    getByUserId(userId: string): Transaction[]
}


export class TransactionRepository implements ITransactionRepository {
    constructor(private data: Transaction[] = []) { }

    add(transaction: Transaction): void {
        this.data.push(transaction);
    }

    getByUserId(userId: string): Transaction[] {
        return this.data.filter((t) => t.userId === userId);
    }

    getAll(): Transaction[] {
        return [...this.data];
    }
}

