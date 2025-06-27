import { Event } from '@hephaestus/eris'
import { client, lyri } from '@modules/lyri'
import { LyriLogger as logger } from '@utils/logger'
import config from 'config'

const NODE_ENV: string = config.get('NODE_ENV') ?? 'dev'

const ready: Event = {
  name: 'ready',
  handler: async (): Promise<void> => {
    logger.info(`${client.user.username} is now ready to go!`)

    lyri.uptime = Date.now()
  }
}

export default ready