import { Event } from '@hephaestus/eris'
import { LyriLogger as logger } from '@utils/logger'

const error: Event = {
  name: 'error',
  handler: (error, id) => {
    logger.error(`An error has occurred, shard: ${id}`)

    console.log(error)
  }
}

export default error
