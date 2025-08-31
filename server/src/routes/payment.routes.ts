import { Router } from 'express'
import { DataSource } from 'typeorm'
import { PaymentController } from '@/controllers'

export function createPaymentRoutes(dataSource: DataSource): Router {
  const router = Router()
  const paymentController = new PaymentController(dataSource)

  // Bind methods to preserve 'this' context
  const boundController = {
    getAllPayments: paymentController.getAllPayments.bind(paymentController),
    getPaymentById: paymentController.getPaymentById.bind(paymentController),
    getPaymentsByDebtId: paymentController.getPaymentsByDebtId.bind(paymentController),
    deletePayment: paymentController.deletePayment.bind(paymentController),
    getStatistics: paymentController.getStatistics.bind(paymentController),
    getRecentPayments: paymentController.getRecentPayments.bind(paymentController),
    getPaymentsByDateRange: paymentController.getPaymentsByDateRange.bind(paymentController),
    getPaymentsByAmountRange: paymentController.getPaymentsByAmountRange.bind(paymentController),
  }

  // GET /api/payments/statistics
  router.get('/statistics', boundController.getStatistics)

  // GET /api/payments/recent
  router.get('/recent', boundController.getRecentPayments)

  // GET /api/payments/date-range
  router.get('/date-range', boundController.getPaymentsByDateRange)

  // GET /api/payments/amount-range
  router.get('/amount-range', boundController.getPaymentsByAmountRange)

  // GET /api/payments/debt/:debtId
  router.get('/debt/:debtId', boundController.getPaymentsByDebtId)

  // GET /api/payments
  router.get('/', boundController.getAllPayments)

  // GET /api/payments/:id
  router.get('/:id', boundController.getPaymentById)

  // DELETE /api/payments/:id
  router.delete('/:id', boundController.deletePayment)

  return router
}
