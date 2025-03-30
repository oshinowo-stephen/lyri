import { TopLevelCommand } from '@hephaestus/eris'

import { useQueue } from 'discord-player'

const skip: TopLevelCommand = {
    type: 1,
    name: 'skip',
    description: 'Skip the current track.',
    action: async (interaction): Promise<void> => {
        const queue = useQueue(interaction.guildID || '')
        if (!queue) return interaction.createMessage({
          content: `Nothing is in the queue to be skipped.`,
          flags: 64,
        })

        queue.node.skip()

        interaction.createMessage({
          content: `<@${interaction.member?.id}> okay! Skipping track...`,
          flags: 64,
        })
    }
}

export default skip
