import { LyriLogger as logger } from '@utils/logger'
import Queue, { QueueError } from './queue'

import {
  Node,
  OPEvent,
  GetPlayer,
  EventType,
  TrackEndReason,
} from '@discordx/lava-player'

export default class Manager {
  public queues: Map<string, Queue> = new Map()

  constructor(public node: Node) {
    node.on('playerUpdate', (event: GetPlayer) => {
      const queue = this.queues.get(event.guildId)
      if (queue) {
        queue.setPlaybackPosition(event.state.position)
      }
    })

    node.on('event', (rawEvent: OPEvent) => {
      if (
        rawEvent.type === EventType.TrackEndEvent &&
        rawEvent.reason === TrackEndReason.FINISHED
      ) {
        const queue = this.queues.get(rawEvent.guildId)
        if (!queue) return

        if (queue.leaveOnEmpty && queue.size === 0) {
          void queue.player.leave()
        }

        void queue.playNextTrack()
          .catch(
            (error: Error) => error instanceof QueueError
              ? error.name === 'NO_TRACKS'
                ? logger.warn(error.message)
                : logger.error(error.message)
              : console.log('An unknown error has occurred:\n', error)
          )
      }
    })
  }

  public queue<T extends Queue = Queue>(guild: string, r?: () => T): T {
    const queue = this.queues.get(guild) as T | undefined

    if (queue) return queue

    const newQueue = r ? r() : (new Queue(this.node, guild) as T)

    this.queues.set(guild, newQueue)

    return newQueue
  }

}