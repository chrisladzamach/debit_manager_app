/**
 * Custom hook for debt management
 * Manages all debt-related state and operations
 */

import { useState, useCallback } from 'react'
import { Debt } from '@/types'
import { DebtService } from '@/services/debt-service'
import { SampleDataService } from '@/services/sample-data-service'

export function useDebtManager() {
  const [debts, setDebts] = useState<Debt[]>(SampleDataService.getSampleDebts())
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)

  const addDebt = useCallback((name: string, amount: number) => {
    setDebts(prevDebts => DebtService.addDebt(prevDebts, name, amount))
  }, [])

  const makePayment = useCallback((debtId: string, amount: number) => {
    setDebts(prevDebts => DebtService.processPayment(prevDebts, debtId, amount))
  }, [])

  const selectDebt = useCallback((debt: Debt | null) => {
    setSelectedDebt(debt)
  }, [])

  const getDebtById = useCallback((debtId: string) => {
    return DebtService.getDebtById(debts, debtId)
  }, [debts])

  const removeDebt = useCallback((debtId: string) => {
    setDebts(prevDebts => DebtService.removeDebt(prevDebts, debtId))
    // Clear selection if removed debt was selected
    if (selectedDebt?.id === debtId) {
      setSelectedDebt(null)
    }
  }, [selectedDebt])

  return {
    // State
    debts,
    selectedDebt,
    
    // Actions
    addDebt,
    makePayment,
    selectDebt,
    getDebtById,
    removeDebt,
    
    // Computed values
    totalDebts: debts.length,
    hasDebts: debts.length > 0,
  }
}
