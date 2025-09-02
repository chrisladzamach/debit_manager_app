export interface Payment {
  id: string
  amount: number
  date: Date
  description?: string
}

export interface Debt {
  id: string
  name: string
  initialAmount: number
  remainingAmount: number
  payments: Payment[]
  createdAt: Date
}

export interface DebtStatistics {
  totalDebt: number
  totalRemaining: number
  totalPaid: number
  totalDebts: number
}

export interface PaymentStatistics {
  totalPaid: number
  averagePayment: number
  largestPayment: number
  smallestPayment: number
  totalPayments: number
}

export interface AppState {
  debts: Debt[]
  selectedDebt: Debt | null
  isLoading: boolean
  currentTime: Date
}

export interface ModalState {
  showAddDebtModal: boolean
  showPaymentModal: boolean
  showHistoryModal: boolean
  showMobileMenu: boolean
}

export interface FormErrors {
  name?: string
  amount?: string
}

export interface CurrencyFormatOptions {
  locale: string
  currency: string
  minimumFractionDigits: number
}

export type SortBy = 'date' | 'amount'
export type SortOrder = 'asc' | 'desc'
