import { Repository } from 'typeorm'
import { Debt } from '@/entities'
import { BaseRepository } from './base.repository'

export class DebtRepository extends BaseRepository<Debt> {
  constructor(repository: Repository<Debt>) {
    super(repository)
  }

  /**
   * Find all debts with their payments
   */
  async findAllWithPayments(): Promise<Debt[]> {
    return this.repository.find({
      relations: ['payments'],
      order: {
        createdAt: 'DESC',
        payments: {
          createdAt: 'DESC'
        }
      }
    })
  }

  /**
   * Find debt by ID with payments
   */
  async findByIdWithPayments(id: string): Promise<Debt | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['payments'],
      order: {
        payments: {
          createdAt: 'DESC'
        }
      }
    })
  }

  /**
   * Find debts by status (paid/unpaid)
   */
  async findByPaidStatus(isPaid: boolean): Promise<Debt[]> {
    return this.repository.find({
      where: { isPaid },
      relations: ['payments'],
      order: { createdAt: 'DESC' }
    })
  }

  /**
   * Search debts by name
   */
  async searchByName(searchTerm: string): Promise<Debt[]> {
    return this.repository
      .createQueryBuilder('debt')
      .leftJoinAndSelect('debt.payments', 'payment')
      .where('debt.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('debt.createdAt', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany()
  }

  /**
   * Get debt statistics
   */
  async getStatistics() {
    const result = await this.repository
      .createQueryBuilder('debt')
      .select([
        'COUNT(debt.id) as totalDebts',
        'SUM(debt.initialAmount) as totalDebt',
        'SUM(debt.remainingAmount) as totalRemaining',
        'SUM(debt.initialAmount - debt.remainingAmount) as totalPaid',
        'AVG(debt.initialAmount) as averageDebtAmount',
        'SUM(CASE WHEN debt.isPaid = true THEN 1 ELSE 0 END) as paidDebtsCount',
        'SUM(CASE WHEN debt.isPaid = false THEN 1 ELSE 0 END) as pendingDebtsCount'
      ])
      .getRawOne()

    return {
      totalDebts: parseInt(result.totalDebts) || 0,
      totalDebt: parseFloat(result.totalDebt) || 0,
      totalRemaining: parseFloat(result.totalRemaining) || 0,
      totalPaid: parseFloat(result.totalPaid) || 0,
      averageDebtAmount: parseFloat(result.averageDebtAmount) || 0,
      paidDebtsCount: parseInt(result.paidDebtsCount) || 0,
      pendingDebtsCount: parseInt(result.pendingDebtsCount) || 0,
    }
  }

  /**
   * Update debt status based on remaining amount
   */
  async updateDebtStatus(id: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Debt)
      .set({
        isPaid: () => 'CASE WHEN remainingAmount <= 0 THEN true ELSE false END'
      })
      .where('id = :id', { id })
      .execute()
  }
}
