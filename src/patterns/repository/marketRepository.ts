import { MarketData } from "../../models";

interface IMarketRepository {
    getAll(): MarketData[]
    getBySymbol(symbol: string): MarketData | undefined
    update(data: MarketData): void
}

export class MarketRepository implements IMarketRepository {
    constructor(private data: Map<string, MarketData> = new Map()) { }

    getAll(): MarketData[] {
        return Array.from(this.data.values());
    }

    getBySymbol(symbol: string): MarketData | undefined {
        return this.data.get(symbol);
    }

    update(data: MarketData): void {
        this.data.set(data.symbol, data);
    }
}

