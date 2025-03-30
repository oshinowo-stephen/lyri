import { Event } from '@hephaestus/eris'

import { logger } from '@hephaestus/utils'

const error: Event = {
    name: 'error',
    handler: (error, id) => {
      logger.error(`An error has occurred on shard: ${id}`)

      console.log(error)
    }
}

export default error
