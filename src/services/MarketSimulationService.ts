// Servicio de simulación de mercado
import { MarketFacade } from "../patterns/facade";
import { StartMarketSimulation, StopMarketSimulation } from "../patterns/strategy";

export class MarketSimulationService {
  // Simular evento de mercado específico
  private marketFac = new MarketFacade()

  startMarketSimulation() {
    this.marketFac.changeStrategy(new StartMarketSimulation)
    return this.marketFac.simulateMarket()
  }

  stopMarketSimulation() {
    this.marketFac.changeStrategy(new StopMarketSimulation)
    return this.marketFac.simulateMarket()
  }
}
