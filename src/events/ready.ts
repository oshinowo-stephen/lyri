import { Event } from '@hephaestus/eris'
import { LyriLogger as logger } from '../modules'

const ready: Event = {
    name: 'ready',
    handler: () => { 
      logger.info('Now connected to the discord\'s API') 
    }
}

export default ready
