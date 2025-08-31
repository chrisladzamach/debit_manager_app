/**
 * Futuristic background component
 * Provides animated background effects for the application
 */

import React from 'react'

export const FuturisticBackground = () => {
  return (
    <>
      {/* Enhanced futuristic background with moving elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated border lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </>
  )
}
