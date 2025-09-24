//! portfolio (maybe put in a different file) 
export class Portfolio {
  userId: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  percentageReturn: number;
  lastUpdated: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.holdings = [];
    this.totalValue = 0;
    this.totalInvested = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
    this.lastUpdated = new Date();
  }

  addHolding(symbol: string, quantity: number, price: number): void {
    const existingHolding = this.holdings.find((h) => h.symbol === symbol);

    if (existingHolding) {
      existingHolding.addShares(quantity, price);
    } else {
      const newHolding = new PortfolioHolding(symbol, quantity, price);
      this.holdings.push(newHolding);
    }

    this.lastUpdated = new Date();
  }

  removeHolding(symbol: string, quantity: number): boolean {
    const holding = this.holdings.find((h) => h.symbol === symbol);

    if (!holding || holding.quantity < quantity) {
      return false;
    }

    holding.removeShares(quantity);

    if (holding.quantity === 0) {
      this.holdings = this.holdings.filter((h) => h.symbol !== symbol);
    }

    this.lastUpdated = new Date();
    return true;
  }

  calculateTotals(): void {
    let totalValue = 0;
    let totalInvested = 0;

    this.holdings.forEach((holding) => {
      const invested = holding.quantity * holding.averagePrice;
      totalValue += holding.currentValue;
      totalInvested += invested;
    });

    this.totalValue = totalValue;
    this.totalInvested = totalInvested;
    this.totalReturn = totalValue - totalInvested;
    this.percentageReturn =
      totalInvested > 0 ? (this.totalReturn / totalInvested) * 100 : 0;
    this.lastUpdated = new Date();
  }
}



//! portfolioHolding (maybe put in a different file) 
class PortfolioHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  totalReturn: number;
  percentageReturn: number;

  constructor(symbol: string, quantity: number, averagePrice: number) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.averagePrice = averagePrice;
    this.currentValue = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
  }

  updateCurrentValue(currentPrice: number): void {
    this.currentValue = this.quantity * currentPrice;
    const invested = this.quantity * this.averagePrice;
    this.totalReturn = this.currentValue - invested;
    this.percentageReturn =
      invested > 0 ? (this.totalReturn / invested) * 100 : 0;
  }

  addShares(quantity: number, price: number): void {
    const totalQuantity = this.quantity + quantity;
    const totalCost = this.quantity * this.averagePrice + quantity * price;
    this.quantity = totalQuantity;
    this.averagePrice = totalCost / totalQuantity;
  }

  removeShares(quantity: number): void {
    this.quantity -= quantity;
  }
}
