import { User } from "../../models"

export const UserToleranceTypes = {
    "LOW": "low",
    "MEDIUM": "medium",
    "HIGH": "high",
} as const

type UserTolerance = typeof UserToleranceTypes[keyof typeof UserToleranceTypes]

export interface IUserToleranceRisk {
    recommendation: string
    priority: number

    changeTolerance(user: User, volatility: number): void
    getTolerance(): UserTolerance
}

//! state user tolerance
export class LowUserTolerance implements IUserToleranceRisk {
    constructor() { }
    recommendation: string = "Activo de bajo riesgo recomendado para tu perfil conservador";
    priority: number = 1;

    changeTolerance(user: User, volatility: number): void {
        if (volatility > 60) user.setRiskTolerance(new HighUserTolerance())
        else user.setRiskTolerance(new MediumUserTolerance())
    }

    getTolerance = () => UserToleranceTypes.LOW
}

export class MediumUserTolerance implements IUserToleranceRisk {
    constructor() { }
    recommendation: string = "Activo balanceado adecuado para tu perfil moderado";
    priority: number = 1

    changeTolerance(user: User, volatility: number): void {
        if (volatility < 50) user.setRiskTolerance(new LowUserTolerance())
        else if (volatility > 60) user.setRiskTolerance(new HighUserTolerance())
    }

    getTolerance = () => UserToleranceTypes.MEDIUM
}

export class HighUserTolerance implements IUserToleranceRisk {
    constructor() { }
    recommendation: string = "Activo de alto crecimiento potencial para tu perfil agresivo"
    priority: number = 2

    changeTolerance(user: User, volatility: number): void {
        if (volatility < 50) user.setRiskTolerance(new LowUserTolerance())
        else user.setRiskTolerance(new MediumUserTolerance())
    }

    getTolerance = () => UserToleranceTypes.HIGH
}