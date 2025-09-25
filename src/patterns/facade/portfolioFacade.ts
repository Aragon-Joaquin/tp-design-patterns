import { Portfolio } from "../../models";
import { ExcludeFirstParam } from "../../types";
import { storage } from "../../utils/storage";
import { IPortfolioActionStrategy, updatePortfolioAfterBuy } from "../strategy";

//! facade + strategy
export class PortfolioFacade {
    constructor(private strategy: IPortfolioActionStrategy = new updatePortfolioAfterBuy) { }

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

    // Actualizar todos los portafolios
    updateAllPortfolioValues(): void {
        const allUsers = [
            storage.user.getByUserId("demo_user"),
            storage.user.getByUserId("admin_user"),
            storage.user.getByUserId("trader_user"),
        ].filter((user) => user !== undefined);

        allUsers.forEach((user) => {
            if (user) {
                const portfolio = storage.portfolio.getByUserId(user.id);
                if (portfolio && portfolio.holdings.length > 0) {
                    this.recalculatePortfolioValues(portfolio);
                    storage.portfolio.update(portfolio);
                }
            }
        });
    }

    execStrategy = (
        ...args: ExcludeFirstParam<Parameters<IPortfolioActionStrategy["updatePortfolioAfterAction"]>>
    ): void =>
        this.strategy.updatePortfolioAfterAction(this, ...args)

    changeStrategy = (strat: IPortfolioActionStrategy) => this.strategy = strat

}

