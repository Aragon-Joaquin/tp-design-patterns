import { Order } from "../../models/portfolio";

interface IOrderRepository {
    add(order: Order): void
    getByUserId(userId: string): Order[]
    update(order: Order): void

}

export class OrderRepository implements IOrderRepository {
    constructor(private data: Order[] = []) { }

    add(order: Order): void {
        this.data.push(order);
    }

    getByUserId(userId: string): Order[] {
        return this.data.filter((o) => o.userId === userId);
    }

    update(order: Order): void {
        const index = this.data.findIndex((o) => o.id === order.id);
        if (index !== -1) {
            this.data[index] = order;
        }
    }

}

