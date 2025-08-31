/**
 * Debt management service
 * Contains all business logic related to debt operations
 */

import { Debt, Payment } from '@/types'
import { generateId } from '@/lib/utils'

export class DebtService {
  /**
   * Create a new debt
   */
  static createDebt(name: string, amount: number): Debt {
    return {
      id: generateId(),
      name: name.trim(),
      initialAmount: amount,
      remainingAmount: amount,
      payments: [],
      createdAt: new Date(),
    }
  }

  /**
   * Add a new debt to the debts array
   */
  static addDebt(debts: Debt[], name: string, amount: number): Debt[] {
    const newDebt = this.createDebt(name, amount)
    return [...debts, newDebt]
  }

  /**
   * Create a new payment
   */
  static createPayment(amount: number, description?: string): Payment {
    return {
      id: generateId(),
      amount,
      date: new Date(),
      description: description || `Abono de $${amount.toLocaleString()}`,
    }
  }

  /**
   * Process a payment for a specific debt
   */
  static processPayment(debts: Debt[], debtId: string, amount: number): Debt[] {
    return debts.map(debt => {
      if (debt.id === debtId) {
        const newPayment = this.createPayment(amount)
        
        return {
          ...debt,
          remainingAmount: Math.max(0, debt.remainingAmount - amount),
          payments: [...debt.payments, newPayment],
        }
      }
      return debt
    })
  }

  /**
   * Get debt by ID
   */
  static getDebtById(debts: Debt[], debtId: string): Debt | null {
    return debts.find(debt => debt.id === debtId) || null
  }

  /**
   * Update debt information
   */
  static updateDebt(debts: Debt[], debtId: string, updates: Partial<Debt>): Debt[] {
    return debts.map(debt => {
      if (debt.id === debtId) {
        return { ...debt, ...updates }
      }
      return debt
    })
  }

  /**
   * Remove a debt
   */
  static removeDebt(debts: Debt[], debtId: string): Debt[] {
    return debts.filter(debt => debt.id !== debtId)
  }

  /**
   * Check if debt is fully paid
   */
  static isDebtPaid(debt: Debt): boolean {
    return debt.remainingAmount === 0
  }

  /**
   * Get recent payments across all debts
   */
  static getRecentPayments(debts: Debt[], limit = 5): Payment[] {
    const allPayments = debts.flatMap(debt => debt.payments)
    return allPayments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  /**
   * Get payment history for a specific debt
   */
  static getPaymentHistory(debt: Debt): Payment[] {
    return [...debt.payments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
}
