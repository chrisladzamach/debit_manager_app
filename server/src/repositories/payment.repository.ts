import { Repository, Between } from 'typeorm'
import { Payment } from '@/entities'
import { BaseRepository } from './base.repository'

export class PaymentRepository extends BaseRepository<Payment> {
  constructor(repository: Repository<Payment>) {
    super(repository)
  }

  async findAllWithDebt(): Promise<Payment[]> {
    return this.repository.find({
      relations: ['debt'],
      order: { createdAt: 'DESC' }
    })
  }

  async findByDebtId(debtId: string): Promise<Payment[]> {
    return this.repository.find({
      where: { debtId },
      order: { createdAt: 'DESC' }
    })
  }

  async findByIdWithDebt(id: string): Promise<Payment | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['debt']
    })
  }

  /**
   * Find payments within date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.repository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      relations: ['debt'],
      order: { createdAt: 'DESC' }
    })
  }

  /**
   * Find payments by amount range
   */
  async findByAmountRange(minAmount: number, maxAmount: number): Promise<Payment[]> {
    return this.repository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.debt', 'debt')
      .where('payment.amount >= :minAmount AND payment.amount <= :maxAmount', {
        minAmount,
        maxAmount
      })
      .orderBy('payment.createdAt', 'DESC')
      .getMany()
  }

  /**
   * Get payment statistics
   */
  async getStatistics() {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select([
        'COUNT(payment.id) as totalPayments',
        'SUM(payment.amount) as totalAmount',
        'AVG(payment.amount) as averageAmount',
        'MAX(payment.amount) as largestPayment',
        'MIN(payment.amount) as smallestPayment'
      ])
      .getRawOne()

    // Get payments for current month
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const monthlyResult = await this.repository
      .createQueryBuilder('payment')
      .select([
        'COUNT(payment.id) as paymentsThisMonth',
        'SUM(payment.amount) as amountThisMonth'
      ])
      .where('payment.createdAt >= :startOfMonth AND payment.createdAt <= :endOfMonth', {
        startOfMonth,
        endOfMonth
      })
      .getRawOne()

    return {
      totalPayments: parseInt(result.totalPayments) || 0,
      totalAmount: parseFloat(result.totalAmount) || 0,
      averageAmount: parseFloat(result.averageAmount) || 0,
      largestPayment: parseFloat(result.largestPayment) || 0,
      smallestPayment: parseFloat(result.smallestPayment) || 0,
      paymentsThisMonth: parseInt(monthlyResult.paymentsThisMonth) || 0,
      amountThisMonth: parseFloat(monthlyResult.amountThisMonth) || 0,
    }
  }

  /**
   * Get recent payments across all debts
   */
  async findRecent(limit: number = 10): Promise<Payment[]> {
    return this.repository.find({
      relations: ['debt'],
      order: { createdAt: 'DESC' },
      take: limit
    })
  }
}
