/**
 * Application header component
 * Contains logo, title, system status, and navigation
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Activity, Shield, Database, Menu, X } from 'lucide-react'
import { APP_METADATA, STATUS } from '@/constants'
import { formatTime } from '@/lib/utils'

interface AppHeaderProps {
  currentTime: Date
  totalDebts: number
  showMobileMenu: boolean
  onToggleMobileMenu: () => void
  onOpenAddDebtModal: () => void
  onCloseMobileMenu: () => void
}

export const AppHeader = ({ 
  currentTime, 
  totalDebts, 
  showMobileMenu, 
  onToggleMobileMenu, 
  onOpenAddDebtModal,
  onCloseMobileMenu 
}: AppHeaderProps) => {
  const handleAddDebtClick = () => {
    onOpenAddDebtModal()
    onCloseMobileMenu()
  }

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center relative">
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white rounded-sm" />
            <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {APP_METADATA.TITLE}
            </h1>
            <p className="text-cyan-300/70 text-xs md:text-sm font-mono">
              {APP_METADATA.SUBTITLE}
            </p>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            onClick={onToggleMobileMenu}
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 p-2"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Desktop system status */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400">{STATUS.ONLINE}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">{STATUS.SECURE}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-blue-400">{totalDebts} REGISTROS</span>
          </div>
        </div>

        {/* Desktop Add Button */}
        <div className="hidden md:block">
          <Button
            onClick={onOpenAddDebtModal}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="hidden lg:inline">NUEVA DEUDA</span>
            <span className="lg:hidden">NUEVA</span>
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gradient-to-r from-gray-900/95 to-black/95 border border-cyan-500/50 rounded-lg p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400">{STATUS.ONLINE}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">{STATUS.SECURE}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-blue-400">{totalDebts} REGISTROS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400">HORA:</span>
              <span className="text-xs font-mono text-cyan-300">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
          <Button
            onClick={handleAddDebtClick}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold py-3 rounded-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            NUEVA DEUDA
          </Button>
        </div>
      )}
    </div>
  )
}
