import { TopLevelCommand } from '@hephaestus/eris'

import { useQueue } from 'discord-player'

import duration from 'format-duration'

import { 
  state,
  requestSongInput,
  randomBotMessages
} from '../modules'

const nowPlaying: TopLevelCommand = {
    type: 1,
    name: 'np',
    description: 'Display current track',
    action: async (interaction): Promise<void> => {
      const queue = useQueue(interaction.guildID || '') 

      if (!queue) return interaction.createMessage({
        content: 'There is no queue',
        flags: 64,
      })

      const track = queue.currentTrack

      if (!track) return interaction.createMessage({
        content: 'There is no songs in queue.',
        flags: 64,
      })

      const trackTimer = state.trackTimers.get(track.id) ?? 0
      const requestedBy = state.memberQueue.get(track.id)

      interaction.createMessage({
        embeds: [
          {
            title: `Currently playing: ${track.title} by ${track.author} - Inserted by: ${requestedBy?.globalName}`,
            thumbnail: {
              url: requestedBy?.avatarURL
            },
            image: {
              url: track.thumbnail
            },
            description: `${randomBotMessages}\n${requestSongInput(track.title, track.author) === 'no summary available.' ? `${requestSongInput(track.title, track.author)}` : 'I\'m not too sure about this song.'}`,
            footer: {
              text: `Song Progress: [${duration(Date.now() - trackTimer)}/${duration(track.durationMS)}]`,
            }
          }
        ],
      })
    }
}

export default nowPlaying
