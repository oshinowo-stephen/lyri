import { DefaultExtractors } from '@discord-player/extractor'
import { Player, createErisCompat } from 'discord-player'
import { YoutubeiExtractor } from 'discord-player-youtubei'
import { logger } from '@hephaestus/utils'
import { Member } from 'eris'
import { client } from './lyri'

export const player = new Player(createErisCompat(client))

export const state = {
  memberQueue: new Map<string, Member | undefined>(),
  trackTimers: new Map<string, number>()
}

player.events.on('playerStart', (_queue, track) => {
    logger.info(`Playing track: ${track.title}`)

    state.trackTimers.set(track.id, Date.now())
})

player.events.on('playerSkip', (_queue, _track) => {
  logger.warn(`Skipping track: ${_track.title}`)
})

player.events.on('audioTracksAdd', (_queue, tracks) => {
  for (const track of tracks) {
    state.memberQueue.set(track.id, _queue.metadata.member)
  }
})

player.events.on('audioTrackAdd', (_queue, track) => {
    logger.info(`Adding track: ${track.title} to current queue.`)

    state.memberQueue.set(track.id, _queue.metadata.member)
})

player.events.on('debug', (_queue, message) => {
  console.log(`[DEBUG ${_queue.guild.id}] ${message}`)
})

player.events.on('error', async (_queue, error) => {
    logger.error('the discord-player fell into an error:\n\n')
 
    console.error(error)

    await _queue.metadata.createMessage({
      content: 'I fell into a stump, error logs was sent to my father... Hopefully this will be resolved soon...',
      flags: 64
    })
})

player.events.on('playerError', async (_queue, error, track) => {
    logger.error(`display-player had an player error playing this: ${track.cleanTitle}\n\n`)
    
    console.error(error)

    await _queue.metadata.createMessage({
      content: `I've ran into an error trying to play: ${track.title} by ${track.author}, removing it from queue.
      \`\`\`${error}\`\`\`
      Check with <@229651386223034368>
      `,
      flags: 64
    })
})

player.extractors.loadMulti(DefaultExtractors)
  .catch((error) => console.log(error))
player.extractors.register(YoutubeiExtractor, {})
  .catch((error) => console.log(error))
