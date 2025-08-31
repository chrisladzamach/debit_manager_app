import React from 'react'
import { Plus } from 'lucide-react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { LoadingScreen } from '@/components/loading-screen'
import { AppHeader } from '@/components/app-header'
import { StatisticsGrid } from '@/components/statistics-grid'
import { DebtCard } from '@/components/debt-card'
import { FloatingAddButton } from '@/components/floating-add-button'
import { FuturisticBackground } from '@/components/futuristic-background'
import { SystemStatusBar } from '@/components/system-status-bar'
import { AddDebtModal } from '@/components/add-debt-modal'
import { PaymentModal } from '@/components/payment-modal'
import { PaymentHistoryModal } from '@/components/payment-history-modal'
import { useAppState } from '@/hooks/use-app-state'
import { useDebtManager } from '@/hooks/use-debt-manager'
import { useModalManager } from '@/hooks/use-modal-manager'

const App = () => {
  // Hooks
  const { isLoading, currentTime } = useAppState()
  const {
    debts,
    selectedDebt,
    addDebt,
    makePayment,
    selectDebt,
    removeDebt,
    totalDebts,
    hasDebts
  } = useDebtManager()
  
  const {
    showAddDebtModal,
    showPaymentModal,
    showHistoryModal,
    showMobileMenu,
    openAddDebtModal,
    closeAddDebtModal,
    openPaymentModal,
    closePaymentModal,
    openHistoryModal,
    closeHistoryModal,
    toggleMobileMenu,
    closeMobileMenu,
    closeAllModals
  } = useModalManager()

  // Event handlers
  const handleAddDebt = (description: string, amount: number) => {
    addDebt(description, amount)
    closeAddDebtModal()
  }

  const handleMakePayment = (debtId: string, amount: number) => {
    makePayment(debtId, amount)
    closePaymentModal()
    // Clear selection after payment
    selectDebt(null)
  }

  const handleDebtCardPayment = (debt: any) => {
    selectDebt(debt)
    openPaymentModal()
  }

  const handleDebtCardHistory = (debt: any) => {
    selectDebt(debt)
    openHistoryModal()
  }

  const handleDebtCardRemove = (debtId: string) => {
    removeDebt(debtId)
  }

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FuturisticBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AppHeader
            currentTime={currentTime}
            totalDebts={totalDebts}
            showMobileMenu={showMobileMenu}
            onToggleMobileMenu={toggleMobileMenu}
            onOpenAddDebtModal={openAddDebtModal}
            onCloseMobileMenu={closeMobileMenu}
          />
          
          <StatisticsGrid 
            debts={debts}
            currentTime={currentTime}
          />

          {/* Debts grid */}
          {hasDebts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {debts.map((debt) => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  onPayment={() => handleDebtCardPayment(debt)}
                  onHistory={() => handleDebtCardHistory(debt)}
                  onRemove={() => handleDebtCardRemove(debt.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-dashed border-cyan-500/50 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 md:w-12 md:h-12 text-cyan-500/50" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">
                No hay deudas registradas
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Comienza agregando una nueva deuda para llevar control de tus finanzas
              </p>
              <button
                onClick={openAddDebtModal}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                AGREGAR PRIMERA DEUDA
              </button>
            </div>
          )}

          <SystemStatusBar currentTime={currentTime} />
        </div>

        {/* Mobile floating add button */}
        <FloatingAddButton
          onClick={openAddDebtModal}
          className="md:hidden"
        />

        {/* Modals */}
        <AddDebtModal
          isOpen={showAddDebtModal}
          onClose={closeAddDebtModal}
          onAddDebt={handleAddDebt}
        />
        
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          debt={selectedDebt}
          onMakePayment={handleMakePayment}
        />
        
        <PaymentHistoryModal
          isOpen={showHistoryModal}
          onClose={closeHistoryModal}
          debt={selectedDebt}
        />

        {/* Toast notifications */}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App
