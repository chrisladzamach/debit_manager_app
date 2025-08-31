/**
 * Loading screen component
 * Displays animated loading state during app initialization
 */

import React from 'react'
import { MESSAGES } from '@/constants'

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background during loading */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-transparent to-blue-500/30 animate-pulse" />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px),
              linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-cyan-300 font-mono mb-2">
          {MESSAGES.LOADING.TITLE}
        </h2>
        <p className="text-cyan-400/70 font-mono">
          {MESSAGES.LOADING.SUBTITLE}
        </p>
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
