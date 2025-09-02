import { z } from 'zod'

export const CreatePaymentDto = z.object({
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  debtId: z.string()
    .uuid('ID de deuda inválido'),
})

export type CreatePaymentDto = z.infer<typeof CreatePaymentDto>

export const UpdatePaymentDto = z.object({
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales')
    .optional(),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
})

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentDto>

export const PaymentResponseDto = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  debtId: z.string(),
  debt: z.object({
    id: z.string(),
    name: z.string(),
    remainingAmount: z.number(),
  }).optional(),
})

export type PaymentResponseDto = z.infer<typeof PaymentResponseDto>

export const PaymentStatisticsDto = z.object({
  totalPayments: z.number(),
  totalAmount: z.number(),
  averageAmount: z.number(),
  largestPayment: z.number(),
  smallestPayment: z.number(),
  paymentsThisMonth: z.number(),
  amountThisMonth: z.number(),
})

export type PaymentStatisticsDto = z.infer<typeof PaymentStatisticsDto>
