import { Request, Response } from 'express'
import { DataSource } from 'typeorm'
import { DebtService } from '@/services'
import { CreateDebtDto, UpdateDebtDto, CreatePaymentDto } from '@/dtos'
import { HttpStatus } from '@/config/constants'
import { logger } from '@/config/logger'

export class DebtController {
  private debtService: DebtService

  constructor(dataSource: DataSource) {
    this.debtService = new DebtService(dataSource)
  }
  async getAllDebts(req: Request, res: Response): Promise<void> {
    try {
      const debts = await this.debtService.getAllDebts()
      res.status(HttpStatus.OK).json({
        success: true,
        data: debts,
        message: 'Debts retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting all debts:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getDebtById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const debt = await this.debtService.getDebtById(id)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: debt,
        message: 'Debt retrieved successfully'
      })
    } catch (error: any) {
      logger.error('Error getting debt by ID:', error)
      
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

  async createDebt(req: Request, res: Response): Promise<void> {
    try {
      const createDebtDto: CreateDebtDto = req.body
      const debt = await this.debtService.createDebt(createDebtDto)
      
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: debt,
        message: 'Debt created successfully'
      })
    } catch (error: any) {
      logger.error('Error creating debt:', error)
      
      if (error.name === 'ConflictException' || error.name === 'BadRequestException') {
        res.status(HttpStatus.BAD_REQUEST).json({
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

  async updateDebt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateDebtDto: UpdateDebtDto = req.body
      const debt = await this.debtService.updateDebt(id, updateDebtDto)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: debt,
        message: 'Debt updated successfully'
      })
    } catch (error: any) {
      logger.error('Error updating debt:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else if (error.name === 'ConflictException' || error.name === 'BadRequestException') {
        res.status(HttpStatus.BAD_REQUEST).json({
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

  async deleteDebt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await this.debtService.deleteDebt(id)
      
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Debt deleted successfully'
      })
    } catch (error: any) {
      logger.error('Error deleting debt:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else if (error.name === 'ConflictException') {
        res.status(HttpStatus.CONFLICT).json({
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

  async addPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const createPaymentDto: CreatePaymentDto = req.body
      const payment = await this.debtService.addPayment(id, createPaymentDto)
      
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: payment,
        message: 'Payment added successfully'
      })
    } catch (error: any) {
      logger.error('Error adding payment:', error)
      
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message
        })
      } else if (error.name === 'BadRequestException') {
        res.status(HttpStatus.BAD_REQUEST).json({
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
      const statistics = await this.debtService.getDebtStatistics()
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: statistics,
        message: 'Statistics retrieved successfully'
      })
    } catch (error) {
      logger.error('Error getting debt statistics:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async searchDebts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query
      
      if (!q || typeof q !== 'string') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Search query is required'
        })
        return
      }

      const debts = await this.debtService.searchDebts(q)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: debts,
        message: 'Search completed successfully'
      })
    } catch (error) {
      logger.error('Error searching debts:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  async getDebtsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params
      
      if (status !== 'paid' && status !== 'active') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Status must be either "paid" or "active"'
        })
        return
      }

      const isPaid = status === 'paid'
      const debts = await this.debtService.getDebtsByStatus(isPaid)
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: debts,
        message: `${status} debts retrieved successfully`
      })
    } catch (error) {
      logger.error('Error getting debts by status:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
