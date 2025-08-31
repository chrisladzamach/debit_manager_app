/**
 * Custom hook for modal state management
 * Manages all modal-related state and operations
 */

import { useState, useCallback } from 'react'
import { ModalState } from '@/types'

export function useModalManager() {
  const [modalState, setModalState] = useState<ModalState>({
    showAddDebtModal: false,
    showPaymentModal: false,
    showHistoryModal: false,
    showMobileMenu: false,
  })

  const openAddDebtModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showAddDebtModal: true }))
  }, [])

  const closeAddDebtModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showAddDebtModal: false }))
  }, [])

  const openPaymentModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showPaymentModal: true }))
  }, [])

  const closePaymentModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showPaymentModal: false }))
  }, [])

  const openHistoryModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showHistoryModal: true }))
  }, [])

  const closeHistoryModal = useCallback(() => {
    setModalState(prev => ({ ...prev, showHistoryModal: false }))
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setModalState(prev => ({ ...prev, showMobileMenu: !prev.showMobileMenu }))
  }, [])

  const closeMobileMenu = useCallback(() => {
    setModalState(prev => ({ ...prev, showMobileMenu: false }))
  }, [])

  const closeAllModals = useCallback(() => {
    setModalState({
      showAddDebtModal: false,
      showPaymentModal: false,
      showHistoryModal: false,
      showMobileMenu: false,
    })
  }, [])

  return {
    // State
    ...modalState,
    
    // Actions
    openAddDebtModal,
    closeAddDebtModal,
    openPaymentModal,
    closePaymentModal,
    openHistoryModal,
    closeHistoryModal,
    toggleMobileMenu,
    closeMobileMenu,
    closeAllModals,
  }
}
