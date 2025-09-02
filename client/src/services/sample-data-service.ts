import { Debt } from '../types'

export class SampleDataService {
  static getSampleDebts(): Debt[] {
    return [
      {
        id: "1",
        name: "Préstamo Personal",
        initialAmount: 50000,
        remainingAmount: 35000,
        payments: [
          {
            id: "1",
            amount: 15000,
            date: new Date("2024-01-15"),
            description: "Pago inicial",
          },
        ],
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        name: "Tarjeta de Crédito",
        initialAmount: 25000,
        remainingAmount: 18500,
        payments: [
          {
            id: "2",
            amount: 6500,
            date: new Date("2024-02-01"),
            description: "Pago mensual",
          },
        ],
        createdAt: new Date("2024-01-10"),
      },
    ]
  }
}
