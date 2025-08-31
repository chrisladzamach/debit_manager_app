/**
 * Floating add button component for mobile
 * Provides easy access to add debt functionality on mobile devices
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FloatingAddButtonProps {
  onClick: () => void
  className?: string
}

export const FloatingAddButton = ({ onClick, className }: FloatingAddButtonProps) => {
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping" />
        <Button
          onClick={onClick}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50 transition-all duration-300 active:scale-95 touch-manipulation"
        >
          <Plus className="w-6 h-6 text-black" />
        </Button>
      </div>
    </div>
  )
}
