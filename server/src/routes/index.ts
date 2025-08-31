import { Router } from 'express'
import { DataSource } from 'typeorm'
import { createDebtRoutes } from './debt.routes'
import { createPaymentRoutes } from './payment.routes'
import { HttpStatus } from '@/config/constants'

export function createApiRoutes(dataSource: DataSource): Router {
  const router = Router()

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString()
    })
  })

  // API version info
  router.get('/info', (req, res) => {
    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        name: 'Debt Manager API',
        version: '1.0.0',
        description: 'API for managing debts and payments'
      },
      message: 'API info retrieved successfully'
    })
  })

  // Mount route modules
  router.use('/debts', createDebtRoutes(dataSource))
  router.use('/payments', createPaymentRoutes(dataSource))

  // 404 handler for unknown routes
  router.use('*', (req, res) => {
    res.status(HttpStatus.NOT_FOUND).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    })
  })

  return router
}
