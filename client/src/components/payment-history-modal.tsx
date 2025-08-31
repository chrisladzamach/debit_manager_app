"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, History, Calendar, DollarSign, Search, Filter, TrendingDown, TrendingUp } from "lucide-react"
import { Debt, SortBy, SortOrder } from "@/types"
import { calculatePaymentStatistics, sortPayments, filterPayments, formatDate, formatTime } from "@/lib/utils"
import { MESSAGES, ANIMATION } from "@/constants"

interface PaymentHistoryModalProps {
  debt: Debt
  isOpen: boolean
  onClose: () => void
  formatCurrency: (amount: number) => string
}

export function PaymentHistoryModal({ debt, isOpen, onClose, formatCurrency }: PaymentHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  if (!isOpen) return null

  // Use modular functions for filtering and sorting
  const filteredPayments = sortPayments(
    filterPayments(debt.payments, searchTerm),
    sortBy,
    sortOrder
  )

  // Use modular function for statistics calculation
  const statistics = calculatePaymentStatistics(debt.payments)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-500/50 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
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

        <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-cyan-500/30">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <History className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-cyan-300 font-mono truncate">HISTORIAL DE PAGOS</h2>
                <p className="text-cyan-400/70 text-xs md:text-sm font-mono truncate">{debt.name.toUpperCase()}</p>
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

          {/* Statistics Overview */}
          <div className="p-4 md:p-6 border-b border-cyan-500/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 rounded-full -mr-6 -mt-6" />
                <div className="relative">
                  <div className="text-xs text-cyan-400 font-mono mb-1">TOTAL PAGADO</div>
                  <div className="text-sm md:text-base font-bold text-green-400 font-mono truncate">
                    {formatCurrency(statistics.totalPaid)}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full -mr-6 -mt-6" />
                <div className="relative">
                  <div className="text-xs text-cyan-400 font-mono mb-1">PROMEDIO</div>
                  <div className="text-sm md:text-base font-bold text-white font-mono truncate">
                    {formatCurrency(statistics.averagePayment)}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/10 rounded-full -mr-6 -mt-6" />
                <div className="relative">
                  <div className="text-xs text-cyan-400 font-mono mb-1">MAYOR PAGO</div>
                  <div className="text-sm md:text-base font-bold text-cyan-300 font-mono truncate">
                    {formatCurrency(statistics.largestPayment)}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-full -mr-6 -mt-6" />
                <div className="relative">
                  <div className="text-xs text-cyan-400 font-mono mb-1">TOTAL PAGOS</div>
                  <div className="text-sm md:text-base font-bold text-white font-mono">{statistics.totalPayments}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="p-4 md:p-6 border-b border-cyan-500/30">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <Input
                  type="text"
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-900 border-cyan-500/50 text-white font-mono pl-10 h-10 focus:border-cyan-400 focus:ring-cyan-400/50"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-xs px-3 touch-manipulation"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {sortBy === "date" ? "FECHA" : "MONTO"}
                </Button>

                <Button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-xs px-3 touch-manipulation"
                >
                  {sortOrder === "desc" ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Payment History List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 font-mono mb-2">
                  {searchTerm ? MESSAGES.EMPTY_STATES.NO_PAYMENTS_FOUND : MESSAGES.EMPTY_STATES.NO_PAYMENTS}
                </h3>
                <p className="text-gray-500 font-mono text-sm">
                  {searchTerm
                    ? MESSAGES.EMPTY_STATES.NO_PAYMENTS_SEARCH_SUBTITLE
                    : MESSAGES.EMPTY_STATES.NO_PAYMENTS_SUBTITLE}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-400/60 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * ANIMATION.PAYMENT_DELAY_MULTIPLIER}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg font-bold text-green-400 font-mono">
                              {formatCurrency(payment.amount)}
                            </span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                          <div className="text-sm text-gray-400 font-mono truncate">
                            {payment.description || "Pago registrado"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-cyan-300 font-mono text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{payment.date.toLocaleDateString("es-CO")}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {payment.date.toLocaleTimeString("es-CO", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        <div className="bg-cyan-500/20 border border-cyan-500/50 rounded px-2 py-1">
                          <span className="text-xs font-mono text-cyan-300">#{payment.id.slice(-4).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with summary */}
          {filteredPayments.length > 0 && (
            <div className="p-4 md:p-6 border-t border-cyan-500/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm font-mono text-gray-400">
                  Mostrando {filteredPayments.length} de {debt.payments.length} pagos
                </div>
                <div className="flex items-center space-x-4 text-sm font-mono">
                  <div className="text-gray-400">
                    Total mostrado:{" "}
                    <span className="text-green-400">
                      {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
