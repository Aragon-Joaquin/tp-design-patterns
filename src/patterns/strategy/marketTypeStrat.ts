export interface IMarketTypeStrategy {
    impactFactor(): number
}

export class marketTypeStrategy {
    constructor(private marketStrat: IMarketTypeStrategy = new BullTypeMarket) { }

    changeStrategy(eventType: "bull" | "bear" | "crash" | "recovery") {
        switch (eventType) {
            case "bull":
                this.marketStrat = new BullTypeMarket
                break;
            case "bear":
                this.marketStrat = new BearTypeMarket
                break;
            case "crash":
                this.marketStrat = new CrashTypeMarket
                break;
            case "recovery":
                this.marketStrat = new RecoveryMarket
                break;
        }
    }

    execImpactFactor = () => this.marketStrat.impactFactor()
}

export class BullTypeMarket implements IMarketTypeStrategy {
    impactFactor = () => 0.05 + Math.random() * 0.1; // +5% a +15%
}

export class BearTypeMarket implements IMarketTypeStrategy {
    impactFactor = () => -(0.05 + Math.random() * 0.1); // -5% a -15%
}

export class CrashTypeMarket implements IMarketTypeStrategy {
    impactFactor = () => -(0.15 + Math.random() * 0.2); // -15% a -35%
}

export class RecoveryMarket implements IMarketTypeStrategy {
    impactFactor = () => 0.1 + Math.random() * 0.15; // +10% a +25%
}