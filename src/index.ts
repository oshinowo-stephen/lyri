import { logger } from '@hephaestus/utils'
import { join as __join } from 'path'
import { lyri } from './modules'
import './modules'

lyri.commands.forge(__join(__dirname, 'commands'))
lyri.events.forge(__join(__dirname, 'events'))

lyri.connect()
    .then(() => logger.info('Lyri is connecting to the discord API'))
    .catch(console.error)

