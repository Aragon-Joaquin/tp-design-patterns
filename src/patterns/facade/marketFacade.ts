import { config } from "../../config";
import { storage } from "../../utils/storage";
import { IMarketSimulation, StartMarketSimulation, StopMarketSimulation } from "../strategy";
import { marketTypeStrategy } from "../strategy/marketTypeStrat";
import { PortfolioFacade } from "./portfolioFacade";

export class MarketFacade {
    private portFacade = new PortfolioFacade()
    constructor(private marketSimStrat: IMarketSimulation = new StartMarketSimulation) { }

    updateMarketPrices(): void {
        const allMarketData = storage.market.getAll();

        allMarketData.forEach((marketData) => {
            // Generar cambio aleatorio de precio
            const randomChange = (Math.random() - 0.5) * 2; // -1 a +1
            const volatilityFactor = config.market.volatilityFactor;
            const priceChange = marketData.price * randomChange * volatilityFactor;

            const newPrice = Math.max(marketData.price + priceChange, 0.01); // Evitar precios negativos
            const change = newPrice - marketData.price;
            const changePercent = (change / marketData.price) * 100;

            // Actualizar datos de mercado
            marketData.price = newPrice;
            marketData.change = change;
            marketData.changePercent = changePercent;
            marketData.volume += Math.floor(Math.random() * 10000); // Simular volumen
            marketData.timestamp = new Date();

            storage.market.update(marketData);

            // Actualizar asset correspondiente
            const asset = storage.asset.getBySymbol(marketData.symbol);
            if (asset) {
                asset.currentPrice = newPrice;
                asset.lastUpdated = new Date();
                storage.asset.update(asset);
            }
        });

        // Actualizar valores de portafolios
        this.portFacade.updateAllPortfolioValues();
    }
    simulateMarketEvent(eventType: "bull" | "bear" | "crash" | "recovery"): void {
        console.log(`Simulando evento de mercado: ${eventType}`);

        const allMarketData = storage.market.getAll();

        allMarketData.forEach((marketData) => {
            //!strategy
            const marketType = new marketTypeStrategy()
            marketType.changeStrategy(eventType)
            let impactFactor = marketType.execImpactFactor()

            const priceChange = marketData.price * impactFactor;
            const newPrice = Math.max(marketData.price + priceChange, 0.01);
            const change = newPrice - marketData.price;
            const changePercent = (change / marketData.price) * 100;

            marketData.price = newPrice;
            marketData.change = change;
            marketData.changePercent = changePercent;
            marketData.timestamp = new Date();

            storage.market.update(marketData);

            // Actualizar asset
            const asset = storage.asset.getBySymbol(marketData.symbol);
            if (asset) {
                asset.currentPrice = newPrice;
                asset.lastUpdated = new Date();
                storage.asset.update(asset);
            }
        });

        // Actualizar portafolios
        this.portFacade.updateAllPortfolioValues();
    }

    changeStrategy = (strat: IMarketSimulation) => this.marketSimStrat = strat
    simulateMarket = () => this.marketSimStrat.simulateMarket()
}