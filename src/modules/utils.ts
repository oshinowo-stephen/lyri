import { logger } from '@hephaestus/utils'

export const LyriLogger = {
    info: (message: string): void => {
        logger.info(`🎶 [Lyri] | ${message}`)
    },
    error: (message: string): void => {
        logger.error(`🛑 [Lyri] ${message}`)
    },
    warn: (message: string): void => {
        logger.warn(`⚠️ [Lyri] ${message}`)
    }
}