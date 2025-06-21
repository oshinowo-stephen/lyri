import { Event } from '@hephaestus/eris'
import { client } from '@modules/lyri'
import { LyriLogger as logger } from '@utils/logger'

const ready: Event = {
  name: 'ready',
  handler: () => {
    logger.info(`${client.user.username} is now ready to go!`)
  }
}

export default ready
