import { TopLevelCommand } from '@hephaestus/eris'
import { QueueRepeatMode, useQueue } from 'discord-player'

const loop: TopLevelCommand = {
    type: 1,
    name: 'loop',
    description: 'Loop the current track or queue.',
    options: [
      {
        type: 3,
        name: 'mode',
        description: 'Turn loop off, loop track or queue',
        required: true
      }
    ],
    action: async (interaction, args) => {
      const mode = args['mode']?.value || 'off'
      const queue = useQueue(interaction.guildID || '')
      if (!queue) return interaction.createMessage({
        content: 'There is nothing in queue',
        flags: 64,
      })
      
      let message: string = `No such mode...`

      switch (mode) {
        case 'off':
        case 'stop':
          queue.setRepeatMode(QueueRepeatMode.OFF)

          message = 'Looping off!'
          break
        case 'song':
        case 'track':
          queue.setRepeatMode(QueueRepeatMode.TRACK)

          message = 'Looping track!'
          break
        case 'queue':
        case 'playlist':
          queue.setRepeatMode(QueueRepeatMode.QUEUE)

          message = 'Looping queue!'
          break
      }

      interaction.createMessage({
        content: message,
        flags: 64
      })
    }
}

export default loop
