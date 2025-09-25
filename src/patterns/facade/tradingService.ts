import { config } from "../../config";

export class CommissionFacade {
    // Cálculo de comisiones
    calculateFees(amount: number, type: "buy" | "sell"): number {
        const feePercentage =
            type === "buy"
                ? config.tradingFees.buyFeePercentage
                : config.tradingFees.sellFeePercentage;
        const calculatedFee = amount * feePercentage;
        return Math.max(calculatedFee, config.tradingFees.minimumFee);
    }
}