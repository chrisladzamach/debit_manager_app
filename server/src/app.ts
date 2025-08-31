import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { DataSource } from 'typeorm'
import { createApiRoutes } from '@/routes'
import { errorHandler } from '@/middleware/error.middleware'
import { requestLogger } from '@/middleware/logger.middleware'
import { corsConfig } from '@/config/cors'
import { logger } from '@/config/logger'

export class App {
  private app: express.Application
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.app = express()
    this.dataSource = dataSource
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet())
    
    // CORS configuration
    this.app.use(cors(corsConfig))
    
    // Compression middleware
    this.app.use(compression())
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    
    // Request logging
    this.app.use(requestLogger)

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1)
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', createApiRoutes(this.dataSource))

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Debt Manager API',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          info: '/api/info',
          debts: '/api/debts',
          payments: '/api/payments'
        }
      })
    })

    // Catch all unmatched routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
      })
    })
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler)
  }

  public getApp(): express.Application {
    return this.app
  }

  public async listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        logger.info(`🚀 Server is running on port ${port}`)
        logger.info(`📚 API Documentation available at http://localhost:${port}/api/info`)
        logger.info(`🏥 Health check available at http://localhost:${port}/api/health`)
        resolve()
      })
    })
  }
}
