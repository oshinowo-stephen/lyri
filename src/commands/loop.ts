import { TopLevelCommand } from '@hephaestus/eris'
import { LoopMode } from '@modules/queue-manager'
import { player } from '@services/player'

const loop: TopLevelCommand = {
  type: 1,
  name: 'loop',
  description: 'Loop the current track or queue.',
  options: [
    {
      type: 3,
      name: 'mode',
      description: 'The loop mode to set.',
      required: true,
      choices: [
        {
          name: 'Track',
          value: 'track',
        },
        {
          name: 'Queue',
          value: 'queue',
        },
        {
          name: 'Off',
          value: 'off',
        },
      ],
    },
  ],
  action: async (interaction, args): Promise<void> => {
    const queueManager = player.queueManager
    if (!queueManager) {
      return interaction.createMessage('❌ There is no current manager available... Please report this to the developers!')
    }

    const queue = queueManager.queue(interaction.guildID ?? '')
    if (!queue) {
      return interaction.createMessage('❌ There is no song in queue to loop!')
    }

    const mode = args['mode'] ? args['mode'].value as LoopMode : 'off'
    queue.setLoopMode(mode)

    return interaction.createMessage(`Now looping: **${queue.loopMode.toUpperCase()}**`)
  }
}

export default loop