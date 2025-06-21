import { logger } from '@hephaestus/utils'
import config from 'config'

export const LyriLogger = {
  info: (message: string): void => logger.success(`🎶 [Lyri] | ${message}`),
  error: (message: string): void => logger.error(`🛑 [Lyri] | ${message}`),
  debug: (message: string): void => Number(config.get('LOG_LEVEL') ?? 0) >= 1
    ? logger.info(`🔍 [Lyri] | ${message}`)
    : undefined,
  trace: (message: string): void => Number(config.get('LOG_LEVEL') ?? 0) >= 2
    ? console.log(`🔎 [Lyri] | ${message}`)
    : undefined,
  warn: (message: string): void => logger.warn(`⚠️ [Lyri] | ${message}`)
}