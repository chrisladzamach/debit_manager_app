/**
 * System status bar component
 * Displays system status and current time
 */

import React from 'react'
import { STATUS } from '@/constants'
import { formatTime } from '@/lib/utils'

interface SystemStatusBarProps {
  currentTime: Date
}

export const SystemStatusBar = ({ currentTime }: SystemStatusBarProps) => {
  return (
    <div className="flex items-center justify-between text-xs font-mono text-cyan-400/70 border-t border-cyan-500/20 pt-3 md:pt-4">
      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="hidden sm:inline">SISTEMA {STATUS.ACTIVE}</span>
        <span className="sm:hidden">{STATUS.ACTIVE}</span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="hidden sm:inline">CONEXIÓN {STATUS.STABLE}</span>
          <span className="sm:hidden">{STATUS.STABLE}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="hidden sm:inline">HORA DEL SISTEMA:</span>
        <span className="sm:hidden">HORA:</span>
        <span className="text-cyan-300">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  )
}
