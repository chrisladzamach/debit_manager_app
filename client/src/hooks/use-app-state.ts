import { useState, useEffect } from 'react'
import { TIMING } from '../constants'

export function useAppState() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, TIMING.LOADING_DELAY)

    // Update time every second for futuristic clock
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, TIMING.CLOCK_UPDATE_INTERVAL)

    return () => {
      clearTimeout(loadingTimer)
      clearInterval(timeInterval)
    }
  }, [])

  return {
    isLoading,
    currentTime,
  }
}
