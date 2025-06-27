import lyri from '@modules/lyri'
import { join as __join } from 'path'
import { LyriLogger as logger } from '@utils/logger'

lyri.events.forge(__join(__dirname, 'events'))
lyri.commands.forge(__join(__dirname, 'commands'))

lyri.connect()
  .then(() => logger.debug('connecting to the discord\'s API...'))
  .catch((error: any) => logger.error(`Failed to connect to the discord API.\n\nReason:\n\n${error}`))
