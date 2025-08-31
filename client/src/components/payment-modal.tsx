"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, CreditCard, DollarSign, Calendar, CheckCircle, History } from "lucide-react"
import { Debt } from "@/types"
import { PaymentHistoryModal } from "./payment-history-modal"
import { validatePaymentAmount, formatDate } from "@/lib/utils"
import { UI_CONFIG, TIMING, MESSAGES } from "@/constants"

interface PaymentModalProps {
  debt: Debt
  isOpen: boolean
  onClose: () => void
  onPayment: (debtId: string, amount: number) => void
  formatCurrency: (amount: number) => string
}

export function PaymentModal({ debt, isOpen, onClose, onPayment, formatCurrency }: PaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    const validationError = validatePaymentAmount(paymentAmount, debt.remainingAmount)
    if (validationError) return

    setIsProcessing(true)

    // Simulate processing delay for better UX
    setTimeout(() => {
      onPayment(debt.id, Number.parseFloat(paymentAmount))
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        setIsProcessing(false)
        setPaymentAmount("")
        onClose()
      }, TIMING.SUCCESS_DISPLAY_DELAY)
    }, TIMING.PROCESSING_DELAY)
  }

  const maxPayment = debt.remainingAmount
  const paymentValue = Number.parseFloat(paymentAmount) || 0
  const isValidPayment = paymentValue > 0 && paymentValue <= maxPayment

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-500/50 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
          {/* Holographic scanning effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-500" />
            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse delay-200" />
            <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse delay-700" />
          </div>

          {/* Corner indicators */}
          <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-400 animate-pulse" />
          <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-cyan-400 animate-pulse delay-100" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-cyan-400 animate-pulse delay-200" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-cyan-400 animate-pulse delay-300" />

          <div className="relative z-10 p-4 md:p-6">
            {/* Header - mobile optimized */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-cyan-300 font-mono truncate">REALIZAR PAGO</h2>
                  <p className="text-cyan-400/70 text-xs md:text-sm font-mono">SISTEMA DE PROCESAMIENTO</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 p-0 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Debt Information - mobile optimized */}
            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-semibold text-cyan-300 font-mono truncate flex-1">
                  {debt.name.toUpperCase()}
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-xs text-cyan-400 font-mono">ID: {debt.id.padStart(4, "0")}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gray-800/50 border border-cyan-500/20 rounded p-2 md:p-3">
                  <div className="text-xs text-gray-400 font-mono mb-1">VALOR INICIAL</div>
                  <div className="text-sm md:text-lg font-bold text-white font-mono truncate">
                    {formatCurrency(debt.initialAmount)}
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-cyan-500/20 rounded p-2 md:p-3">
                  <div className="text-xs text-gray-400 font-mono mb-1">SALDO PENDIENTE</div>
                  <div className="text-sm md:text-lg font-bold text-cyan-300 font-mono truncate">
                    {formatCurrency(debt.remainingAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Input Section - mobile optimized */}
            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-center space-x-2 mb-3 md:mb-4">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <h4 className="text-base md:text-lg font-semibold text-cyan-300 font-mono">MONTO A PAGAR</h4>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-gray-900 border-cyan-500/50 text-white font-mono text-lg md:text-xl h-12 md:h-14 pl-10 md:pl-12 focus:border-cyan-400 focus:ring-cyan-400/50"
                    max={maxPayment}
                    min="0"
                    step="1000"
                  />
                  <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-lg md:text-xl">
                    $
                  </div>
                </div>

                {/* Quick payment buttons - mobile optimized */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {UI_CONFIG.PAYMENT_PERCENTAGES.map((percentage) => (
                    <Button
                      key={percentage}
                      onClick={() => setPaymentAmount((maxPayment * percentage).toString())}
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-xs py-2 touch-manipulation"
                    >
                      {percentage === 1 ? "TODO" : `${percentage * 100}%`}
                    </Button>
                  ))}
                </div>

                {/* Payment validation */}
                {paymentAmount && (
                  <div className="text-sm font-mono">
                    {isValidPayment ? (
                      <div className="text-green-400 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Monto válido: {formatCurrency(paymentValue)}</span>
                      </div>
                    ) : (
                      <div className="text-red-400">
                        {paymentValue <= 0 ? "El monto debe ser mayor a 0" : "El monto excede la deuda pendiente"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  <h4 className="text-base md:text-lg font-semibold text-cyan-300 font-mono">HISTORIAL</h4>
                </div>
                {debt.payments.length > 0 && (
                  <Button
                    onClick={() => setShowHistoryModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-xs px-3 py-1 touch-manipulation"
                  >
                    <History className="w-3 h-3 mr-1" />
                    VER TODO
                  </Button>
                )}
              </div>

              <div className="max-h-24 md:max-h-32 overflow-y-auto space-y-2">
                {debt.payments.length === 0 ? (
                  <div className="text-gray-500 text-sm font-mono text-center py-2 md:py-4">
                    {MESSAGES.EMPTY_STATES.NO_PAYMENTS}
                  </div>
                ) : (
                  debt.payments
                    .slice(-UI_CONFIG.MAX_RECENT_PAYMENTS)
                    .reverse()
                    .map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center bg-gray-800/50 rounded p-2">
                        <div className="text-xs md:text-sm font-mono text-gray-300 truncate flex-1">
                          {formatDate(payment.date)}
                        </div>
                        <div className="text-xs md:text-sm font-mono text-cyan-300 ml-2 flex-shrink-0">
                          {formatCurrency(payment.amount)}
                        </div>
                      </div>
                    ))
                )}
              </div>

              {debt.payments.length > UI_CONFIG.MAX_RECENT_PAYMENTS && (
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500 font-mono">Y {debt.payments.length - UI_CONFIG.MAX_RECENT_PAYMENTS} pagos más...</span>
                </div>
              )}
            </div>

            {/* Action Buttons - mobile optimized */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 font-mono py-3 touch-manipulation bg-transparent"
                disabled={isProcessing}
              >
                CANCELAR
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!isValidPayment || isProcessing}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed py-3 touch-manipulation"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>PROCESANDO...</span>
                  </div>
                ) : (
                  "CONFIRMAR PAGO"
                )}
              </Button>
            </div>
          </div>

          {/* Success overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">{MESSAGES.SUCCESS.PAYMENT_PROCESSED.TITLE}</h3>
                <p className="text-green-300 font-mono">{MESSAGES.SUCCESS.PAYMENT_PROCESSED.SUBTITLE}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentHistoryModal
        debt={debt}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        formatCurrency={formatCurrency}
      />
    </>
  )
}
