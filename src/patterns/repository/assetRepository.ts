import { Asset } from "../../models/assetModel";

interface IAssetRepository {
    getAll(): Asset[]
    getBySymbol(symbol: string): Asset | undefined
    update(asset: Asset): void
}

export class AssetRepository implements IAssetRepository {
    constructor(private data: Map<string, Asset> = new Map()) { }

    getAll(): Asset[] {
        return Array.from(this.data.values());
    }

    getBySymbol(symbol: string): Asset | undefined {
        return this.data.get(symbol);
    }

    update(asset: Asset): void {
        this.data.set(asset.symbol, asset);
    }
}





