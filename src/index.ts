import { join as __join } from 'path'
import { 
    lyri, 
    LyriLogger as logger
} from './modules'

lyri.commands.forge(__join(__dirname, 'commands'))
lyri.events.forge(__join(__dirname, 'events'))

logger.info('trying to connect to the discord API...')

lyri.connect()
    .catch((error: any) => logger.error(`Failed to connect to the discord API.\n\nReason:\n\n${error}`))
