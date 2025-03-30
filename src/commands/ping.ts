import { TopLevelCommand } from '@hephaestus/eris'

const ping: TopLevelCommand = {
    type: 1,
    name: 'ping',
    description: 'Poke Lyri to see if they\'re awake!',
    action: async (interaction): Promise<void> => {
        await interaction.acknowledge()
        const message = await interaction.createFollowup('Poking...')
        message.edit(`🏓Poked! Latency: ${Date.now() - message.timestamp}ms!`)
    }
}

export default ping
