import { Event } from '@hephaestus/eris'
import { logger } from '@hephaestus/utils'

const ready: Event = {
    name: 'ready',
    handler: () => { 
      logger.info('Lyri is now connected to the discord\'s API') 
    }
}

export default ready
