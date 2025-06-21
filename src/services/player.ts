import config from 'config'
import { LyriLogger as logger } from '@utils/logger'
import { client } from '@modules/lyri'
import {
  Node,
  OpResponse,
  Track,
  TrackStartEvent,
  TrackEndEvent,
  OPEvent,
  OPPlayerUpdate,
} from '@discordx/lava-player'
import { Manager } from '@modules/queue-manager'
import {
  Guild,
  Client as ErisClient,
  Member,
} from 'eris'

export interface Player {
  node?: Node,
  client?: ErisClient,
  currentTrackPosition: number,
  queueManager?: Manager
}

export interface MemberQueue {
  guildId: string,
  lastPlayedAt?: number
  lastPlayedTrack?: Track
  tracksPlayed: Track[]
  member?: Member
}

export const player: Player = {
  node: undefined,
  client: undefined,
  currentTrackPosition: 0,
  queueManager: undefined,
}

player.client = client
player.node = new Node({
  host: {
    port: config.get('LAVALINK_PORT')
      ? Number(config.get('LAVALINK_PORT'))
      : 2333,
    address: config.get('LAVALINK_HOST'),
    connectionOptions: {
      sessionId: config.get('LAVALINK_SESSION_ID') ?? 'discordx',
    }
  },
  password: config.get('LAVALINK_PASSWORD') ?? 'y0u_$h@ll_N0t_p@$$',
  send(guildId, packet) {
    const guild = client.guilds.get(guildId) as Guild

    if (!guild) {
      logger.error(`Lavalink [WS]: No guild found for ${guildId}`)
    } else {
      guild.shard.sendWS(packet.op, packet.d)
    }

  },
  userId: config.get('CLIENT_USER_ID')
})
player.queueManager = new Manager(player.node)

player.node?.on('ready', () => {
  logger.info(`Lavalink [WS]: Client connected to Lavalink server, WE'RE READY!!!`)
})

player.node?.on('error', (error: any) => {
  logger.error(`Lavalink [WS]: ${error}`)
})

player.node?.connection.ws.on('message', (packet: any) => {
  const d = JSON.parse(packet) as OpResponse
  const opType: 'ready' | 'event' | 'playerUpdate' | 'stats' | undefined = d.op !== undefined
    ? d.op.toString() as unknown as 'ready' | 'event' | 'playerUpdate' | 'stats'
    : undefined

  if (opType) opHandlers[opType](d)
})

player.client?.on('rawWS', (packet: {
  t: string
  s: number
  op: number
  d: any
  shardId: number
}, _shardId) => {
  if (packet.op !== 0) return
  if (packet.t !== 'VOICE_SERVER_UPDATE' && packet.t !== 'VOICE_STATE_UPDATE') return

  if (packet.t === 'VOICE_SERVER_UPDATE') {
    logger.debug(`Lavalink [WS]: ${packet.t} - ${packet.d?.guild_id}`)

    const p = player.node?.guildPlayerStore.get(packet.d.guild_id)
    if (!p) {
      logger.warn(`Lavalink [WS]: ${packet.t} - ${packet.d?.guild_id} | No player found`)
      return
    }

    p.node.voiceServerUpdate(packet.d)
  } else if (packet.t === 'VOICE_STATE_UPDATE') {
    logger.debug(`Lavalink [WS]: ${packet.t} - ${packet.d?.guild_id}`)

    const p = player.node?.guildPlayerStore.get(packet.d.guild_id)
    if (!p) {
      logger.warn(`Lavalink [WS]: ${packet.t} - ${packet.d?.guild_id} | No player found`)
      return
    }

    p.node.voiceStateUpdate(packet.d)
  } else {
    logger.warn(`Lavalink [WS]: ${packet.t} - ${packet.d?.guild_id} | No guild found`)
    return
  }
})

const opHandlers = {
  playerUpdate: (packet: OpResponse) => {
    const guildPlayer = player.node?.guildPlayerStore.get((<OPPlayerUpdate>packet).guildId ?? '')
    const playerState = (<OPPlayerUpdate>packet).state

    if (guildPlayer) {
      logger.debug(`Lavalink [WS]: (PLAYER): STATUS - ${guildPlayer.status}`)

      player.currentTrackPosition = playerState.position
    }
  },
  event: (packet: OpResponse) => {
    const eventType: string = (<OPEvent>packet).type
    const guildPlayer = player.node?.guildPlayerStore.get((<OPEvent>packet).guildId ?? '')
    const queue = player.queueManager?.queue((<OPEvent>packet).guildId ?? '')
    const track = (<TrackStartEvent | TrackEndEvent>packet).track as Track

    if (eventType === 'TrackStartEvent') {
      if (guildPlayer) {
        logger.debug(`Lavalink [WS]: (EVENT): Track started - ${track.info.title} in guild ${guildPlayer.guildId}`)

        logger.info(`Lavalink [WS]: (EVENT): Track started - ${track.info.title} played by ${track.userData?.playedBy?.username ?? 'Unknown'} in guild ${guildPlayer.guildId}`)
      }
    } else if (eventType === 'TrackEndEvent') {
      if (guildPlayer && (queue && queue.leaveOnEmptyTimeout > 0)) {
        setTimeout(() => {
          if (!queue.playing && queue.size === 0) {
            logger.warn(`The queue is empty after: ${queue.leaveOnEmptyTimeout / 1000}. I am leaving this channel.`)

            queue.player.leave()
          }
        }, queue.leaveOnEmptyTimeout)
      }
    }
  },
  stats: (packet: OpResponse) => {
    logger.debug(`Lavalink [WS]: (STATS): ${JSON.stringify(packet, null, 2)}`)
  },
  ready: (_: OpResponse) => {} // No need for this...,

}
