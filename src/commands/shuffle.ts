import { TopLevelCommand } from '@hephaestus/eris'
import { player } from '@services/player'

const shuffle: TopLevelCommand = {
  type: 1,
  name: 'shuffle',
  description: 'Shuffle the current queue.',
  action: async (interaction): Promise<void> => {
    await interaction.acknowledge()

    const queueManager = player.queueManager
    if (!queueManager) {
      return interaction.createMessage('❌ There is no current manager available... Please report this to the developers!')
    }

    const queue = queueManager.queue(interaction.guildID ?? '')
    if (!queue) {
      return interaction.createMessage('❌ There is no song in queue to shuffle!')
    }

    queue.shuffleQueue()

    return interaction.createMessage('🔀 The queue has been shuffled!')
  },
}

export default shuffle