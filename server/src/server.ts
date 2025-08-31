import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { App } from './app'
import { databaseConfig } from '@/config/database'
import { serverConfig } from '@/config/server'
import { logger } from '@/config/logger'

async function bootstrap() {
  try {
    // Initialize database connection
    logger.info('🔗 Connecting to database...')
    const dataSource = new DataSource(databaseConfig)
    await dataSource.initialize()
    logger.info('✅ Database connected successfully')

    // Run migrations
    logger.info('🔄 Running database migrations...')
    await dataSource.runMigrations()
    logger.info('✅ Database migrations completed')

    // Create and start the application
    logger.info('🚀 Starting application...')
    const app = new App(dataSource)
    await app.listen(serverConfig.port)
    
    logger.info('✅ Application started successfully')
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Received SIGINT signal, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('🛑 Received SIGTERM signal, shutting down gracefully...')
  process.exit(0)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Start the application
bootstrap()
