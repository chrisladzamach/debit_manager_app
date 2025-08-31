import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Payment } from './Payment'

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  name: string

  @Column('decimal', { precision: 15, scale: 2 })
  initialAmount: number

  @Column('decimal', { precision: 15, scale: 2 })
  remainingAmount: number

  @Column('boolean', { default: false })
  isPaid: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Payment, payment => payment.debt, { cascade: true })
  payments: Payment[]

  // Computed property to check if debt is fully paid
  get isFullyPaid(): boolean {
    return this.remainingAmount <= 0
  }

  // Computed property to get total paid amount
  get totalPaid(): number {
    return this.initialAmount - this.remainingAmount
  }

  // Computed property to get progress percentage
  get progressPercentage(): number {
    if (this.initialAmount === 0) return 0
    return ((this.initialAmount - this.remainingAmount) / this.initialAmount) * 100
  }
}
