import { Request, Response } from 'express'
import { DataSource } from 'typeorm'
import { PaymentService } from '@/services'
import { HttpStatus } from '@/config/constants'
import { logger } from '@/config/logger'

export class PaymentController {
  private paymentService: PaymentService

  constructor(dataSource: DataSource) {
    this.paymentService = new PaymentService(dataSource)
  }

  async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getAllPayments()
      res.status(HttpStatus.OK).json({
        success: true,
        data: payments,
        message: 'Payments retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting all payments:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const payment = await this.paymentService.getPaymentById(id)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: payment,
        message: 'Payment retrieved successfully'
      })
    } catch (error: any) {
      logger.error('Error getting payment by ID:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error'
        })
      }
    }
  }

  async getPaymentsByDebtId(req: Request, res: Response): Promise<void> {
    try {
      const { debtId } = req.params
      const payments = await this.paymentService.getPaymentsByDebtId(debtId)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: payments,
        message: 'Payments retrieved successfully'
      })
    } catch (error: any) {
      logger.error('Error getting payments by debt ID:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error'
        })
      }
    }
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await this.paymentService.deletePayment(id)
      
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Payment deleted successfully'
      })
    } catch (error: any) {
      logger.error('Error deleting payment:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error'
        })
      }
    }
  }

  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await this.paymentService.getPaymentStatistics()
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: statistics,
        message: 'Payment statistics retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting payment statistics:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getRecentPayments(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10
      
      if (limit <= 0 || limit > 100) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Limit must be between 1 and 100'
        })
        return
      }

      const payments = await this.paymentService.getRecentPayments(limit)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: payments,
        message: 'Recent payments retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting recent payments:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getPaymentsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { start, end } = req.query
      
      if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Start and end dates are required (YYYY-MM-DD format)'
        })
        return
      }

      const startDate = new Date(start)
      const endDate = new Date(end)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD format'
        })
        return
      }

      if (startDate > endDate) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Start date cannot be after end date'
        })
        return
      }

      const payments = await this.paymentService.getPaymentsByDateRange(startDate, endDate)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: payments,
        message: 'Payments in date range retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting payments by date range:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getPaymentsByAmountRange(req: Request, res: Response): Promise<void> {
    try {
      const { min, max } = req.query
      
      if (!min || !max || typeof min !== 'string' || typeof max !== 'string') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Min and max amounts are required'
        })
        return
      }

      const minAmount = parseFloat(min)
      const maxAmount = parseFloat(max)

      if (isNaN(minAmount) || isNaN(maxAmount)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid amount values'
        })
        return
      }

      if (minAmount < 0 || maxAmount < 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Amounts must be non-negative'
        })
        return
      }

      if (minAmount > maxAmount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Min amount cannot be greater than max amount'
        })
        return
      }

      const payments = await this.paymentService.getPaymentsByAmountRange(minAmount, maxAmount)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: payments,
        message: 'Payments in amount range retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting payments by amount range:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
