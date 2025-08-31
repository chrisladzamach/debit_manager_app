import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, DollarSign, FileText, CheckCircle } from "lucide-react"
import { FormErrors } from "@/types"
import { validateDebtName, validateDebtAmount, formatCurrency } from "@/lib/utils"
import { UI_CONFIG, TIMING, MESSAGES } from "@/constants"

interface AddDebtModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDebt: (name: string, amount: number) => void
}

export const AddDebtModal = ({ isOpen, onClose, onAddDebt }: AddDebtModalProps) => {
  const [debtName, setDebtName] = useState("")
  const [debtAmount, setDebtAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  if (!isOpen) return null

  const validateForm = () => {
    const nameError = validateDebtName(debtName)
    const amountError = validateDebtAmount(debtAmount, UI_CONFIG.MAX_DEBT_AMOUNT)
    
    const newErrors: FormErrors = {}
    if (nameError) newErrors.name = nameError
    if (amountError) newErrors.amount = amountError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    // Simulate processing delay for better UX
    setTimeout(() => {
      onAddDebt(debtName.trim(), Number.parseFloat(debtAmount))
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        setIsProcessing(false)
        setDebtName("")
        setDebtAmount("")
        setErrors({})
        onClose()
      }, TIMING.SUCCESS_DISPLAY_DELAY)
    }, TIMING.PROCESSING_DELAY)
  }

  const previewAmount = Number.parseFloat(debtAmount) || 0

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-500/50 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
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
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-cyan-300 font-mono">NUEVA DEUDA</h2>
                <p className="text-cyan-400/70 text-xs md:text-sm font-mono">REGISTRO DE OBLIGACIÓN</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 p-0 flex-shrink-0"
              disabled={isProcessing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4 md:space-y-6">
            {/* Debt Name Input */}
            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 md:p-4">
              <div className="flex items-center space-x-2 mb-2 md:mb-3">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <Label htmlFor="debt-name" className="text-base md:text-lg font-semibold text-cyan-300 font-mono">
                  NOMBRE DE LA DEUDA
                </Label>
              </div>
              <Input
                id="debt-name"
                type="text"
                placeholder="Ej: Préstamo Personal..."
                value={debtName}
                onChange={(e) => {
                  setDebtName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: undefined })
                }}
                className="bg-gray-900 border-cyan-500/50 text-white font-mono h-10 md:h-12 focus:border-cyan-400 focus:ring-cyan-400/50"
                disabled={isProcessing}
              />
              {errors.name && <div className="text-red-400 text-sm font-mono mt-2">{errors.name}</div>}
              {debtName && !errors.name && (
                <div className="text-green-400 text-sm font-mono mt-2 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Nombre válido</span>
                </div>
              )}
            </div>

            {/* Debt Amount Input */}
            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 md:p-4">
              <div className="flex items-center space-x-2 mb-2 md:mb-3">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <Label htmlFor="debt-amount" className="text-base md:text-lg font-semibold text-cyan-300 font-mono">
                  MONTO
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="debt-amount"
                  type="number"
                  placeholder="0"
                  value={debtAmount}
                  onChange={(e) => {
                    setDebtAmount(e.target.value)
                    if (errors.amount) setErrors({ ...errors, amount: undefined })
                  }}
                  className="bg-gray-900 border-cyan-500/50 text-white font-mono text-lg md:text-xl h-12 md:h-14 pl-10 md:pl-12 focus:border-cyan-400 focus:ring-cyan-400/50"
                  min="0"
                  step="1000"
                  disabled={isProcessing}
                />
                <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-lg md:text-xl">
                  $
                </div>
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {UI_CONFIG.QUICK_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setDebtAmount(amount.toString())}
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-xs py-2 touch-manipulation"
                    disabled={isProcessing}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>

              {errors.amount && <div className="text-red-400 text-sm font-mono mt-2">{errors.amount}</div>}
              {debtAmount && !errors.amount && previewAmount > 0 && (
                <div className="text-green-400 text-sm font-mono mt-2 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Monto: {formatCurrency(previewAmount)}</span>
                </div>
              )}
            </div>

            {/* Preview Section */}
            {debtName && debtAmount && !errors.name && !errors.amount && previewAmount > 0 && (
              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-cyan-300 font-mono mb-3">VISTA PREVIA</h4>
                <div className="bg-gray-800/50 border border-cyan-500/20 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-300 font-mono font-semibold">{debtName.toUpperCase()}</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-mono">MONTO INICIAL:</span>
                    <span className="text-white font-bold font-mono">{formatCurrency(previewAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-mono">SALDO PENDIENTE:</span>
                    <span className="text-cyan-300 font-bold font-mono">{formatCurrency(previewAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 md:mt-8">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 font-mono py-3 touch-manipulation bg-transparent"
              disabled={isProcessing}
            >
              CANCELAR
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!debtName || !debtAmount || Object.keys(errors).length > 0 || isProcessing}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed py-3 touch-manipulation"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>REGISTRANDO...</span>
                </div>
              ) : (
                "REGISTRAR DEUDA"
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
              <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">{MESSAGES.SUCCESS.DEBT_ADDED.TITLE}</h3>
              <p className="text-green-300 font-mono">{MESSAGES.SUCCESS.DEBT_ADDED.SUBTITLE}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
