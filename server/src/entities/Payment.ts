import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Debt } from './Debt'

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column('text', { nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('uuid')
  debtId: string

  @ManyToOne(() => Debt, debt => debt.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debtId' })
  debt: Debt
}
