/**
 * Statistics grid component
 * Displays debt statistics in a responsive grid layout
 */

import React from 'react'
import { Debt } from '@/types'
import { formatCurrency, calculateDebtStatistics } from '@/lib/utils'

interface StatisticsGridProps {
  debts: Debt[]
  currentTime: Date
}

export const StatisticsGrid = ({ debts, currentTime }: StatisticsGridProps) => {
  const statistics = calculateDebtStatistics(debts)
  const stats = [
    {
      label: 'DEUDAS',
      value: statistics.totalDebts.toString(),
      bgColor: 'from-cyan-500/10',
      textColor: 'text-white',
    },
    {
      label: 'INICIAL',
      value: formatCurrency(statistics.totalDebt),
      bgColor: 'from-blue-500/10',
      textColor: 'text-white',
    },
    {
      label: 'PAGADO',
      value: formatCurrency(statistics.totalPaid),
      bgColor: 'from-green-500/10',
      textColor: 'text-green-400',
    },
    {
      label: 'PENDIENTE',
      value: formatCurrency(statistics.totalRemaining),
      bgColor: 'from-red-500/10',
      textColor: 'text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-gradient-to-r from-gray-900/80 to-black/80 border border-cyan-500/30 rounded-lg p-3 md:p-4 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${stat.bgColor} rounded-full -mr-6 md:-mr-8 -mt-6 md:-mt-8`} />
          <div className="relative">
            <div className="text-xs text-cyan-400 font-mono mb-1">{stat.label}</div>
            <div className={`text-xl md:text-2xl font-bold ${stat.textColor} font-mono ${stat.label !== 'DEUDAS' ? 'truncate' : ''}`}>
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
