import { AssetsFacade } from "../facade";

export const MarketSignalTypes = {
    "BUY": "buy",
    "SELL": "sell",
    "HOLD": "hold",
} as const

type SignalKeyTypes = typeof MarketSignalTypes[keyof typeof MarketSignalTypes]

export interface IMarketSignal {
    changeSignal(assFac: AssetsFacade, price: number, sma20: number, sma50: number, rsi: number): void
    getSignal(): SignalKeyTypes
}

//! signals state
export class MarketBuySignal implements IMarketSignal {
    changeSignal(assFac: AssetsFacade, price: number, sma20: number, sma50: number, rsi: number): void {
        if (price < sma20 && sma20 < sma50 && rsi > 30) assFac.setSignal(new MarketSellSignal);
        else assFac.setSignal(new MarketHoldSignal)
    }

    getSignal = () => MarketSignalTypes.BUY
}

export class MarketHoldSignal implements IMarketSignal {
    changeSignal(assFac: AssetsFacade, price: number, sma20: number, sma50: number, rsi: number): void {
        if (price > sma20 && sma20 > sma50 && rsi < 70) assFac.setSignal(new MarketBuySignal);
        else if (price < sma20 && sma20 < sma50 && rsi > 30) assFac.setSignal(new MarketSellSignal);
    }

    getSignal = () => MarketSignalTypes.HOLD
}

export class MarketSellSignal implements IMarketSignal {
    changeSignal(assFac: AssetsFacade, price: number, sma20: number, sma50: number, rsi: number): void {
        if (price > sma20 && sma20 > sma50 && rsi < 70) assFac.setSignal(new MarketBuySignal);
        else assFac.setSignal(new MarketHoldSignal)
    }

    getSignal = () => MarketSignalTypes.SELL
}
