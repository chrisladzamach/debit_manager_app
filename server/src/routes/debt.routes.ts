import { Router } from 'express'
import { DataSource } from 'typeorm'
import { DebtController } from '@/controllers'
import { validateDto } from '@/middleware/validation.middleware'
import { CreateDebtDto, UpdateDebtDto, CreatePaymentDto } from '@/dtos'

export function createDebtRoutes(dataSource: DataSource): Router {
  const router = Router()
  const debtController = new DebtController(dataSource)

  // Bind methods to preserve 'this' context
  const boundController = {
    getAllDebts: debtController.getAllDebts.bind(debtController),
    getDebtById: debtController.getDebtById.bind(debtController),
    createDebt: debtController.createDebt.bind(debtController),
    updateDebt: debtController.updateDebt.bind(debtController),
    deleteDebt: debtController.deleteDebt.bind(debtController),
    addPayment: debtController.addPayment.bind(debtController),
    getStatistics: debtController.getStatistics.bind(debtController),
    searchDebts: debtController.searchDebts.bind(debtController),
    getDebtsByStatus: debtController.getDebtsByStatus.bind(debtController),
  }

  // GET /api/debts/statistics
  router.get('/statistics', boundController.getStatistics)

  // GET /api/debts/search
  router.get('/search', boundController.searchDebts)

  // GET /api/debts/status/:status
  router.get('/status/:status', boundController.getDebtsByStatus)

  // GET /api/debts
  router.get('/', boundController.getAllDebts)

  // GET /api/debts/:id
  router.get('/:id', boundController.getDebtById)

  // POST /api/debts
  router.post('/', validateDto(CreateDebtDto), boundController.createDebt)

  // PUT /api/debts/:id
  router.put('/:id', validateDto(UpdateDebtDto), boundController.updateDebt)

  // DELETE /api/debts/:id
  router.delete('/:id', boundController.deleteDebt)

  // POST /api/debts/:id/payments
  router.post('/:id/payments', validateDto(CreatePaymentDto), boundController.addPayment)

  return router
}
