import React from "react"
import { Card } from "../components/ui/card"
import { History, CreditCard, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Debt } from "../types"
import { calculateProgressPercentage, formatDate, formatCurrency } from "../lib/utils"
import { STATUS } from "../constants"

interface DebtCardProps {
  debt: Debt
  onPayment: () => void
  onHistory: () => void
  onRemove: () => void
}

export const DebtCard = ({ debt, onPayment, onHistory, onRemove }: DebtCardProps) => {
  const progressPercentage = calculateProgressPercentage(debt)
  const isFullyPaid = debt.remainingAmount === 0

  const handleHistoryClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onHistory()
  }

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isFullyPaid) {
      onPayment()
    }
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group relative overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />
      </div>

      <div className="p-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-cyan-300 font-mono mb-1">
              {debt.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs text-cyan-400/70 font-mono">
                {isFullyPaid ? "PAGADO" : "ACTIVO"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {debt.payments.length > 0 && (
              <Button
                onClick={handleHistoryClick}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
              >
                <History className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleRemoveClick}
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Financial data */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-mono">Inicial:</span>
            <span className="text-white font-semibold font-mono">
              {formatCurrency(debt.initialAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-mono">Restante:</span>
            <span className="text-cyan-300 font-bold font-mono">
              {formatCurrency(debt.remainingAmount)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>Progreso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-3 border-t border-cyan-500/20">
            {!isFullyPaid && (
              <Button
                onClick={handlePaymentClick}
                className="cursor-pointer flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                PAGAR
              </Button>
            )}
            {debt.payments.length > 0 && (
              <Button
                onClick={handleHistoryClick}
                variant="outline"
                className="cursor-pointer flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 font-mono text-sm"
              >
                <History className="w-4 h-4 mr-2" />
                HISTORIAL
              </Button>
            )}
          </div>

          {/* Info footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 font-mono pt-2">
            <span>{debt.payments.length} pagos realizados</span>
            <span>ID: {debt.id}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
