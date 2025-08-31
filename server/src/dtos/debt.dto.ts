import { z } from 'zod'

// Create Debt DTO
export const CreateDebtDto = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .trim(),
  initialAmount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales'),
})

export type CreateDebtDto = z.infer<typeof CreateDebtDto>

// Update Debt DTO
export const UpdateDebtDto = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .trim()
    .optional(),
  initialAmount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales')
    .optional(),
})

export type UpdateDebtDto = z.infer<typeof UpdateDebtDto>

// Debt Response DTO
export const DebtResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  initialAmount: z.number(),
  remainingAmount: z.number(),
  isPaid: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payments: z.array(z.object({
    id: z.string(),
    amount: z.number(),
    description: z.string().optional(),
    createdAt: z.date(),
  })).optional(),
  totalPaid: z.number().optional(),
  progressPercentage: z.number().optional(),
})

export type DebtResponseDto = z.infer<typeof DebtResponseDto>

// Debts Statistics DTO
export const DebtStatisticsDto = z.object({
  totalDebts: z.number(),
  totalDebt: z.number(),
  totalRemaining: z.number(),
  totalPaid: z.number(),
  averageDebtAmount: z.number(),
  paidDebtsCount: z.number(),
  pendingDebtsCount: z.number(),
})

export type DebtStatisticsDto = z.infer<typeof DebtStatisticsDto>
