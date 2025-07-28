import { LyriLogger as logger } from '@utils/logger'
import Queue, { QueueError } from './queue'
import * as db from '@services/storage'

import {
  Node,
  OPEvent,
  GetPlayer,
  EventType,
  TrackEndReason,
} from '@discordx/lava-player'
import { GuildPlayer } from '.prisma/client'

export default class Manager {
  public queues: Map<string, Queue> = new Map()

  constructor(public node: Node) {
    node.on('playerUpdate', (event: GetPlayer) => {
      const queue = this.queues.get(event.guildId)
      if (queue) {
        queue.setPlaybackPosition(event.state.position)
      }
    })

    node.on('event', async (rawEvent: OPEvent) => {
      if (
        rawEvent.type === EventType.TrackEndEvent &&
        rawEvent.reason === TrackEndReason.FINISHED
      ) {
        const queue = this.queues.get(rawEvent.guildId)

        let guildSettings

        try {
          guildSettings = await db.fetch('guildPlayer', {
            where: {
              guildId: rawEvent.guildId
            }
          })
        } catch(_error) {
          console.error(_error)
          // db.initialize('guildPlayer', {
          //   djRole
          //   guildId: rawEvent.guildId,

          // })
        }

        if (!queue) return

        const guildLeaveOnEmpty = (guildSettings as GuildPlayer).leaveOnEmpty
        const guildOnEmptyTimeout = (guildSettings as GuildPlayer).leaveOnEmptyDuration

        if (guildLeaveOnEmpty) {
          logger.warn('Leaving channel now this guild has to set it to true')

          if (!queue.playing && queue.size === 0) {
            void queue.player.leave()
          }
        } else {
          logger.warn('Staying in channel, this guild has set it to false')
        }

        void queue.playNextTrack()
          .catch(
            (error: Error) => {
              if (error instanceof QueueError) {
                if (error.name === 'NO_TRACKS') {
                  // if neither of these two cases happens, we'll just sit in the VC.
                  console.log('no tracks trying to see')
                  if (!guildLeaveOnEmpty && guildOnEmptyTimeout > 0) {
                    setTimeout(() => {
                      if (!queue.playing && queue.size === 0) {
                        logger.warn(`The queue is empty after: ${guildOnEmptyTimeout / 1000} seconds. Leaving current channel.`)

                        void queue.player.leave()
                      }
                    }, guildOnEmptyTimeout)
                  }
                } else {
                  console.log('An unknown error has occurred:\n', error)

                  void queue.player.leave()
                }
              }
            }
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