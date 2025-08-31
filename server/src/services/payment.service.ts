import { DataSource } from 'typeorm'
import { Payment, Debt } from '@/entities'
import { PaymentRepository, DebtRepository } from '@/repositories'
import { NotFoundException } from '@/exceptions'

export class PaymentService {
  private paymentRepository: PaymentRepository
  private debtRepository: DebtRepository

  constructor(dataSource: DataSource) {
    this.paymentRepository = new PaymentRepository(dataSource.getRepository(Payment))
    this.debtRepository = new DebtRepository(dataSource.getRepository(Debt))
  }

  /**
   * Get all payments
   */
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.findAllWithDebt()
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByIdWithDebt(id)
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`)
    }
    return payment
  }

  /**
   * Get payments by debt ID
   */
  async getPaymentsByDebtId(debtId: string): Promise<Payment[]> {
    // Verify debt exists
    const debt = await this.debtRepository.findById(debtId)
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${debtId} not found`)
    }

    return this.paymentRepository.findByDebtId(debtId)
  }

  /**
   * Delete a payment
   */
  async deletePayment(id: string): Promise<void> {
    const payment = await this.paymentRepository.findById(id)
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`)
    }

    // Get the associated debt to update remaining amount
    const debt = await this.debtRepository.findById(payment.debtId)
    if (debt) {
      // Restore the payment amount to the debt's remaining amount
      debt.remainingAmount += payment.amount
      debt.updatedAt = new Date()
      await this.debtRepository.save(debt)
    }

    await this.paymentRepository.delete(id)
  }

  /**
   * Get payments within date range
   */
  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.paymentRepository.findByDateRange(startDate, endDate)
  }

  /**
   * Get payments by amount range
   */
  async getPaymentsByAmountRange(minAmount: number, maxAmount: number): Promise<Payment[]> {
    return this.paymentRepository.findByAmountRange(minAmount, maxAmount)
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics() {
    return this.paymentRepository.getStatistics()
  }

  /**
   * Get recent payments
   */
  async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    return this.paymentRepository.findRecent(limit)
  }
}
