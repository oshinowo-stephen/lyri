import { TopLevelCommand } from '@hephaestus/eris'
import { player as PlayerNode } from '@services/player'
import {
  isDev,
  isAdmin,
  isDJ
} from '@utils/perms'
import { Member } from 'eris'

const skip: TopLevelCommand = {
  type: 1,
  name: 'skip',
  permission: {
    level: 5,
    name: 'able-to-skip',
    action: async (interaction, data, _client) => {
      console.log(data)
      // Implement your permission logic here if needed
      return (
        isAdmin(interaction.member as Member)
        || isDev(interaction.member as Member)
        || isDJ(interaction.member as Member)
      )
    }
  },
  description: 'Skip the current track.',
  action: async (interaction): Promise<void> => {
    const { queueManager } = PlayerNode

    await interaction.acknowledge()
    const response = await interaction.createFollowup({
      content: '... Skipping the current track... Please standby...',
      flags: 64,
    })

    if (!queueManager) {
      response.edit('❌ There is no current manager available... Please report this to the developers!')
      return
    }

    const queue = queueManager.queue(interaction.guildID ?? '')

    if (!queue) {
      response.edit('❌ There is no song in queue to skip!')
      return
    }

    try {
      await queue.playNextTrack()

      response.edit('⏭️ Skipped the current track!')
    } catch (error) {
      console.error(error)
      response.edit('❌ Failed to skip the current track!')
    }
  }
}

export default skip