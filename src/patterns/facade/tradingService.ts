import { config } from "../../config";

export class CommissionFacade {
    // Cálculo de comisiones
    calculateFees(quantity: number, execPrice: number, type: "buy" | "sell"): [number, number] {
        const amount = quantity * execPrice

        const feePercentage =
            type === "buy"
                ? config.tradingFees.buyFeePercentage
                : config.tradingFees.sellFeePercentage;
        const calculatedFee = amount * feePercentage;

        const fees = Math.max(calculatedFee, config.tradingFees.minimumFee);
        const totalCost =
            type === "buy"
                ? amount + fees
                : amount - fees

        return [fees, totalCost]
    }
}