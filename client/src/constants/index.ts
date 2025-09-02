import { CurrencyFormatOptions } from '../types'

// Currency configuration
export const CURRENCY_CONFIG: CurrencyFormatOptions = {
  locale: 'es-CO',
  currency: 'COP',
  minimumFractionDigits: 0,
}

// Application timing
export const TIMING = {
  LOADING_DELAY: 2000,
  PROCESSING_DELAY: 1500,
  SUCCESS_DISPLAY_DELAY: 2000,
  CLOCK_UPDATE_INTERVAL: 1000,
} as const

// UI Configuration
export const UI_CONFIG = {
  QUICK_AMOUNTS: [100000, 500000, 1000000],
  PAYMENT_PERCENTAGES: [0.25, 0.5, 0.75, 1],
  MAX_RECENT_PAYMENTS: 3,
  MAX_DEBT_AMOUNT: 999999999,
  MIN_DEBT_NAME_LENGTH: 3,
} as const

// Animation delays
export const ANIMATION = {
  CARD_DELAY_MULTIPLIER: 0.1,
  PAYMENT_DELAY_MULTIPLIER: 0.05,
  CORNER_DELAYS: [0, 100, 200, 300],
  SCANNING_DELAYS: [0, 150, 200, 500, 700],
} as const

// Status indicators
export const STATUS = {
  ONLINE: 'ONLINE',
  SECURE: 'SECURE',
  ACTIVE: 'ACTIVO',
  STABLE: 'ESTABLE',
  PAID: 'PAGADO',
  PENDING: 'PENDIENTE',
} as const

// System messages
export const MESSAGES = {
  LOADING: {
    TITLE: 'INICIALIZANDO SISTEMA',
    SUBTITLE: 'Cargando módulos financieros...',
  },
  SUCCESS: {
    DEBT_ADDED: {
      TITLE: 'DEUDA REGISTRADA',
      SUBTITLE: 'Nueva obligación financiera creada',
    },
    PAYMENT_PROCESSED: {
      TITLE: 'PAGO PROCESADO',
      SUBTITLE: 'Transacción completada exitosamente',
    },
  },
  EMPTY_STATES: {
    NO_PAYMENTS: 'NO HAY PAGOS REGISTRADOS',
    NO_PAYMENTS_FOUND: 'NO SE ENCONTRARON PAGOS',
    NO_PAYMENTS_SUBTITLE: 'Los pagos aparecerán aquí cuando se registren',
    NO_PAYMENTS_SEARCH_SUBTITLE: 'Intenta con otros términos de búsqueda',
  },
  VALIDATION: {
    DEBT_NAME_REQUIRED: 'El nombre de la deuda es requerido',
    DEBT_NAME_MIN_LENGTH: 'El nombre debe tener al menos 3 caracteres',
    AMOUNT_REQUIRED: 'El monto es requerido',
    AMOUNT_INVALID: 'El monto debe ser mayor a 0',
    AMOUNT_TOO_HIGH: 'El monto es demasiado alto',
    PAYMENT_INVALID: 'El monto debe ser mayor a 0',
    PAYMENT_EXCEEDS: 'El monto excede la deuda pendiente',
  },
} as const

// App metadata
export const APP_METADATA = {
  TITLE: 'DEBT MANAGER',
  SUBTITLE: 'SISTEMA DE GESTIÓN FINANCIERA',
  DESCRIPTION: 'Sistema avanzado de gestión de deudas',
  VERSION: '1.0.0',
} as const
