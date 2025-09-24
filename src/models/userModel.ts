import { IUserToleranceRisk } from "../patterns";

export class User {
  id: string;
  username: string;
  email: string;
  apiKey: string;
  balance: number;
  riskTolerance: IUserToleranceRisk;
  createdAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    apiKey: string,
    balance: number,
    riskTolerance: IUserToleranceRisk
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.apiKey = apiKey;
    this.balance = balance;
    this.riskTolerance = riskTolerance;
    this.createdAt = new Date();
  }

  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }

  deductBalance(amount: number): void {
    this.balance -= amount;
  }

  addBalance(amount: number): void {
    this.balance += amount;
  }

  changeTolerance = (volatility: number) => this.riskTolerance.changeTolerance(this, volatility)

  setRiskTolerance = (risk: IUserToleranceRisk) => this.riskTolerance = risk
}