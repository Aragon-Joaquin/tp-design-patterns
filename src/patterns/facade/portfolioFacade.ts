import { Portfolio } from "../../models";
import { ExcludeFirstParam } from "../../types";
import { storage } from "../../utils/storage";
import { IPortfolioActionStrategy } from "../strategy";

//! facade + strategy
export class PortfolioFacade {
    constructor(private strategy: IPortfolioActionStrategy) { }

    // Recalcular valores del portafolio
    recalculatePortfolioValues(portfolio: Portfolio): void {
        portfolio.holdings.forEach((holding) => {
            const asset = storage.asset.getBySymbol(holding.symbol);
            if (asset) {
                holding.updateCurrentValue(asset.currentPrice);
            }
        });

        // Calcular totales del portafolio
        portfolio.calculateTotals();
    }

    execStrategy = (
        ...args: ExcludeFirstParam<Parameters<IPortfolioActionStrategy["updatePortfolioAfterAction"]>>
    ): void =>
        this.strategy.updatePortfolioAfterAction(this, ...args)

    changeStrategy = (strat: IPortfolioActionStrategy) => this.strategy = strat

}

