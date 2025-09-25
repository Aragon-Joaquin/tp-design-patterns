import { config } from "../../config";
import { MarketFacade } from "../facade";

export interface IMarketSimulation {
    simulateMarket(): void
}

abstract class MarketSimulation implements IMarketSimulation {
    protected isRunning: boolean = false;
    protected intervalId: NodeJS.Timeout | null = null;

    abstract simulateMarket(): void;

    getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null } {
        return {
            isRunning: this.isRunning,
            lastUpdate: this.isRunning ? new Date() : null,
        };
    }
}

export class StartMarketSimulation extends MarketSimulation {
    private marketFacade = new MarketFacade()

    simulateMarket(): void {
        if (this.isRunning) {
            console.log("La simulación de mercado ya está ejecutándose");
            return;
        }

        this.isRunning = true;
        console.log("Iniciando simulación de mercado...");

        this.intervalId = setInterval(() => {
            this.marketFacade.updateMarketPrices();
        }, config.market.updateIntervalMs);
    }
}

export class StopMarketSimulation extends MarketSimulation {
    simulateMarket(): void {
        if (!this.isRunning) {
            console.log("La simulación de mercado no está ejecutándose");
            return;
        }

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log("Simulación de mercado detenida");
    }
}


