import { TopLevelCommand } from '@hephaestus/eris'
import { player as PlayerNode } from '@services/player'
import { logger } from '@hephaestus/utils'

const purge: TopLevelCommand = {
  type: 1,
  name: 'purge',
  description: 'Clear all tracks from the queue, and stop current track.',
  action: async (interaction): Promise<void> => {
    const { queueManager } = PlayerNode

    await interaction.acknowledge()
    const response = await interaction.createFollowup({
      content: '... Purging queue... Please standby...',
      flags: 64,
    })

    if (!queueManager) {
      response.edit('❌ There is no current manager available... Please report this to the developers!')
      return
    }

    const queue = queueManager.queue(interaction.guildID ?? '')

    if (!queue) {
      response.edit('❌ The queue is already gone!')
      return
    }

    try {
      await queue.purge()

      response.edit('QUEUE PURGED!!! Sorry it had to end like this...')
    } catch (error) {
      logger.error(error)

      response.edit('❌ Failed to purge the queue!')
    }
  }
}

export default purge
