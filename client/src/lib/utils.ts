import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Debt, Payment, DebtStatistics, PaymentStatistics } from '../types'
import { CURRENCY_CONFIG } from '../constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency according to application configuration
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits: CURRENCY_CONFIG.minimumFractionDigits,
  }).format(amount)
}

/**
 * Calculate debt statistics from array of debts
 */
export function calculateDebtStatistics(debts: Debt[]): DebtStatistics {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.initialAmount, 0)
  const totalRemaining = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  const totalPaid = totalDebt - totalRemaining
  
  return {
    totalDebt,
    totalRemaining,
    totalPaid,
    totalDebts: debts.length,
  }
}

/**
 * Calculate payment statistics for a specific debt
 */
export function calculatePaymentStatistics(payments: Payment[]): PaymentStatistics {
  if (payments.length === 0) {
    return {
      totalPaid: 0,
      averagePayment: 0,
      largestPayment: 0,
      smallestPayment: 0,
      totalPayments: 0,
    }
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const averagePayment = totalPaid / payments.length
  const largestPayment = Math.max(...payments.map(p => p.amount))
  const smallestPayment = Math.min(...payments.map(p => p.amount))

  return {
    totalPaid,
    averagePayment,
    largestPayment,
    smallestPayment,
    totalPayments: payments.length,
  }
}

/**
 * Calculate progress percentage for a debt
 */
export function calculateProgressPercentage(debt: Debt): number {
  if (debt.initialAmount === 0) return 0
  return ((debt.initialAmount - debt.remainingAmount) / debt.initialAmount) * 100
}

/**
 * Generate unique ID based on timestamp
 */
export function generateId(): string {
  return Date.now().toString()
}

/**
 * Validate debt name
 */
export function validateDebtName(name: string): string | null {
  if (!name.trim()) {
    return 'El nombre de la deuda es requerido'
  }
  if (name.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres'
  }
  return null
}

/**
 * Validate debt amount
 */
export function validateDebtAmount(amount: string, maxAmount = 999999999): string | null {
  const numAmount = Number.parseFloat(amount)
  
  if (!amount || isNaN(numAmount)) {
    return 'El monto es requerido'
  }
  if (numAmount <= 0) {
    return 'El monto debe ser mayor a 0'
  }
  if (numAmount > maxAmount) {
    return 'El monto es demasiado alto'
  }
  return null
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: string, maxAmount: number): string | null {
  const numAmount = Number.parseFloat(amount)
  
  if (!amount || isNaN(numAmount)) {
    return 'El monto es requerido'
  }
  if (numAmount <= 0) {
    return 'El monto debe ser mayor a 0'
  }
  if (numAmount > maxAmount) {
    return 'El monto excede la deuda pendiente'
  }
  return null
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO')
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Sort payments by date or amount
 */
export function sortPayments(
  payments: Payment[],
  sortBy: 'date' | 'amount',
  sortOrder: 'asc' | 'desc'
): Payment[] {
  return [...payments].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount
    }
  })
}

/**
 * Filter payments by search term
 */
export function filterPayments(payments: Payment[], searchTerm: string): Payment[] {
  if (!searchTerm.trim()) return payments
  
  const term = searchTerm.toLowerCase()
  return payments.filter(
    payment =>
      payment.description?.toLowerCase().includes(term) ||
      payment.amount.toString().includes(term)
  )
}
