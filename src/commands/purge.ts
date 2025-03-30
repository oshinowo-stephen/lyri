import { TopLevelCommand } from '@hephaestus/eris'

import { QueueRepeatMode, useQueue } from 'discord-player'

const purge: TopLevelCommand = {
    type: 1,
    name: 'purge',
    description: 'Purge the queue, and remove all current tracks!',
    action: async (interaction): Promise<void> => {
        const queue = useQueue(interaction.guildID || '')
        if (!queue) return interaction.createMessage({
          content: 'There is no queue',
          flags: 64,
        })

        if (queue.repeatMode !== QueueRepeatMode.OFF) {
          queue.setRepeatMode(QueueRepeatMode.OFF)
        }

        queue.clear()

        interaction.createMessage({ 
          content:`Successfully purged the queue! Now skipping current song...`,
          flags: 64,
        })
    }
}

export default purge
