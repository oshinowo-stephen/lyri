import { TopLevelCommand } from '@hephaestus/eris'

import { useQueue } from 'discord-player'

import { state } from '../modules'

const tracks: TopLevelCommand = {
    type: 1,
    name: 'tracks',
    description: 'Display all current tracks in queue',
    action: async (interaction): Promise<void> => {
      const queue = useQueue(interaction.guildID || '')
      if (!queue) return interaction.createMessage({
        content: 'There is no queue.',
        flags: 64,
      })
    
      if (!queue.tracks) return interaction.createMessage({
        content: 'There\'s nothing in queue.',
        flags: 64,
      })

      const tracks = queue.tracks
      const currentTrack = queue.currentTrack
      if (!currentTrack) {
        console.log('No current track on now playing...')

        return interaction.createMessage({
          content: 'This shouldn\'t happen...',
          flags: 64,
        })
      }

      const memberQueue = state.memberQueue

      let displayMessage = `CURRENTLY PLAYING: ${currentTrack.title}, Requested by: ${memberQueue.get(currentTrack.id)?.globalName}\n`
      let upcomingTracks = tracks
        .map((track) => { 
          // console.log(memberQueue.get(track.title))
    
          return `> ${track.title}, Requested by: ${memberQueue.get(track.id)?.globalName}`
        })
        .slice(0, 6)
        .join('\n')

      tracks.size > 0
        ? displayMessage += `\nUPCOMING TRACKS:\n${upcomingTracks}`
        : undefined

      interaction.createMessage({
        content: displayMessage ?? 'N/A',
        flags: 64,
      })   
    }
}

export default tracks
