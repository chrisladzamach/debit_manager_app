import { DataSource } from 'typeorm'
import { Debt, Payment } from '@/entities'
import { DebtRepository, PaymentRepository } from '@/repositories'
import { CreateDebtDto, UpdateDebtDto, CreatePaymentDto } from '@/dtos'
import { NotFoundException, ConflictException, BadRequestException } from '@/exceptions'

export class DebtService {
  private debtRepository: DebtRepository
  private paymentRepository: PaymentRepository

  constructor(dataSource: DataSource) {
    this.debtRepository = new DebtRepository(dataSource.getRepository(Debt))
    this.paymentRepository = new PaymentRepository(dataSource.getRepository(Payment))
  }

  /**
   * Get all debts
   */
  async getAllDebts(): Promise<Debt[]> {
    return this.debtRepository.findAllWithPayments()
  }

  /**
   * Get debt by ID
   */
  async getDebtById(id: string): Promise<Debt> {
    const debt = await this.debtRepository.findByIdWithPayments(id)
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${id} not found`)
    }
    return debt
  }

  /**
   * Create a new debt
   */
  async createDebt(createDebtDto: CreateDebtDto): Promise<Debt> {
    // Validate amount
    if (createDebtDto.amount <= 0) {
      throw new BadRequestException('Debt amount must be greater than 0')
    }

    // Check if debt with same description already exists for this user
    const existingDebt = await this.debtRepository.findByDescription(createDebtDto.description)
    if (existingDebt) {
      throw new ConflictException(`Debt with description "${createDebtDto.description}" already exists`)
    }

    const debt = new Debt()
    debt.description = createDebtDto.description
    debt.amount = createDebtDto.amount
    debt.remainingAmount = createDebtDto.amount
    debt.createdAt = new Date()
    debt.updatedAt = new Date()

    return this.debtRepository.save(debt)
  }

  /**
   * Update an existing debt
   */
  async updateDebt(id: string, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    const debt = await this.debtRepository.findById(id)
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${id} not found`)
    }

    // Validate amount if provided
    if (updateDebtDto.amount !== undefined && updateDebtDto.amount <= 0) {
      throw new BadRequestException('Debt amount must be greater than 0')
    }

    // Check if description already exists for another debt
    if (updateDebtDto.description && updateDebtDto.description !== debt.description) {
      const existingDebt = await this.debtRepository.findByDescription(updateDebtDto.description)
      if (existingDebt && existingDebt.id !== id) {
        throw new ConflictException(`Debt with description "${updateDebtDto.description}" already exists`)
      }
    }

    // Update fields
    if (updateDebtDto.description) {
      debt.description = updateDebtDto.description
    }
    
    if (updateDebtDto.amount !== undefined) {
      const totalPaid = debt.amount - debt.remainingAmount
      debt.amount = updateDebtDto.amount
      debt.remainingAmount = Math.max(0, updateDebtDto.amount - totalPaid)
    }

    debt.updatedAt = new Date()

    return this.debtRepository.save(debt)
  }

  /**
   * Delete a debt
   */
  async deleteDebt(id: string): Promise<void> {
    const debt = await this.debtRepository.findById(id)
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${id} not found`)
    }

    // Check if debt has payments
    const payments = await this.paymentRepository.findByDebtId(id)
    if (payments.length > 0) {
      throw new ConflictException('Cannot delete debt with existing payments')
    }

    await this.debtRepository.delete(id)
  }

  /**
   * Add payment to debt
   */
  async addPayment(debtId: string, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const debt = await this.debtRepository.findById(debtId)
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${debtId} not found`)
    }

    // Validate payment amount
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0')
    }

    if (createPaymentDto.amount > debt.remainingAmount) {
      throw new BadRequestException('Payment amount cannot exceed remaining debt amount')
    }

    const payment = new Payment()
    payment.debtId = debtId
    payment.amount = createPaymentDto.amount
    payment.description = createPaymentDto.description || 'Payment'
    payment.createdAt = new Date()

    // Update debt remaining amount
    debt.remainingAmount -= createPaymentDto.amount
    debt.updatedAt = new Date()

    // Save both payment and updated debt
    const savedPayment = await this.paymentRepository.save(payment)
    await this.debtRepository.save(debt)

    return savedPayment
  }

  /**
   * Get debt statistics
   */
  async getDebtStatistics() {
    const debts = await this.debtRepository.findAll()
    const payments = await this.paymentRepository.findAll()

    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0)
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const remainingDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
    const paidDebts = debts.filter(debt => debt.remainingAmount === 0).length
    const activeDebts = debts.filter(debt => debt.remainingAmount > 0).length

    return {
      totalDebts: debts.length,
      activeDebts,
      paidDebts,
      totalDebtAmount: totalDebt,
      totalPaidAmount: totalPaid,
      totalRemainingAmount: remainingDebt,
      averageDebtAmount: debts.length > 0 ? totalDebt / debts.length : 0,
      averagePaymentAmount: payments.length > 0 ? totalPaid / payments.length : 0,
      paymentCompletionRate: totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0
    }
  }

  /**
   * Search debts by description
   */
  async searchDebts(query: string): Promise<Debt[]> {
    return this.debtRepository.findByDescriptionPattern(query)
  }

  /**
   * Get debts by status
   */
  async getDebtsByStatus(isPaid: boolean): Promise<Debt[]> {
    if (isPaid) {
      return this.debtRepository.findPaidDebts()
    } else {
      return this.debtRepository.findActiveDebts()
    }
  }
}
