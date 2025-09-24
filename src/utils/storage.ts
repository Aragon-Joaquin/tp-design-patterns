// Almacenamiento en memoria
import {
  User,
  Asset,
  Portfolio,
  MarketData,
} from "../models";
import { config } from "../config";
import { AssetRepository, HighUserTolerance, LowUserTolerance, MarketRepository, MediumUserTolerance, OrderRepository, PortfolioRepository, TransactionRepository, UserRepository } from "../patterns";


// Base de datos simulada en memoria (se pierde al reiniciar)
//! repository + singleton
class InMemoryStorage {
  //! repository
  public user: UserRepository;
  public asset: AssetRepository;
  public transaction: TransactionRepository;
  public order: OrderRepository;
  public portfolio: PortfolioRepository;
  public market: MarketRepository;

  //! singleton pattern
  private static memoryStorage: InMemoryStorage | null;

  public static getMemoryStorage(): InMemoryStorage {
    if (this.memoryStorage) return this.memoryStorage
    this.memoryStorage = new InMemoryStorage()
    return this.memoryStorage;
  };

  constructor() {
    const usersMap = new Map();
    const assetsMap = new Map();
    const marketMap = new Map();
    const portfolioMap = new Map();

    // Usuarios por defecto
    const defaultUsers = [
      new User(
        "demo_user",
        "demo_user",
        "demo@example.com",
        "demo-key-123",
        10000.0,
        new MediumUserTolerance()
      ),
      new User(
        "admin_user",
        "admin_user",
        "admin@example.com",
        "admin-key-456",
        50000.0,
        new HighUserTolerance()
      ),
      new User(
        "trader_user",
        "trader_user",
        "trader@example.com",
        "trader-key-789",
        25000.0,
        new LowUserTolerance()
      ),
    ]

    defaultUsers.forEach((user) => usersMap.set(user.id, user));

    // Activos por defecto
    config.market.baseAssets.forEach((baseAsset) => {
      const asset = new Asset(
        baseAsset.symbol,
        baseAsset.name,
        baseAsset.basePrice,
        baseAsset.sector
      );
      assetsMap.set(baseAsset.symbol, asset);

      // Datos de mercado iniciales
      const marketData = new MarketData(baseAsset.symbol, baseAsset.basePrice);
      marketMap.set(baseAsset.symbol, marketData);
    });

    // Portafolios iniciales vacíos
    defaultUsers.forEach((user) => {
      const portfolio = new Portfolio(user.id);
      portfolioMap.set(user.id, portfolio);
    });

    // Inicializar repositorios
    this.user = new UserRepository(usersMap)
    this.asset = new AssetRepository(assetsMap)
    this.transaction = new TransactionRepository()
    this.order = new OrderRepository();
    this.portfolio = new PortfolioRepository();
    this.market = new MarketRepository();
  }

}

// Instancia global de almacenamiento
export const storage = InMemoryStorage.getMemoryStorage();
