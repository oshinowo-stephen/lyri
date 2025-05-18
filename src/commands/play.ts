import { logger } from '@hephaestus/utils'
import { TopLevelCommand } from '@hephaestus/eris'

import { 
  useMainPlayer, 
  useTimeline
} from 'discord-player'

const player = useMainPlayer()

const play: TopLevelCommand = {
    type: 1,
    name: 'play',
    description: 'Play a track !',
    options: [
        {
            type: 3,
            name: 'query',
            required: true,
            description: 'Insert track link or title.',
        }
    ] as const,
    action: async (interaction, args, { client }): Promise<void> => {
        await interaction.acknowledge()

        const query = args['query']?.value as string
        const response = await interaction.createFollowup({
          content: `Searching for ${query}...`,
          flags: 64,
        })


        const guild = client.guilds.get(interaction.guildID || '')
        if (!guild) logger.error('This shouldn\'t happen...')

        const voiceChannel = interaction.member?.voiceState.channelID
        const channel = guild?.channels.get(voiceChannel || '') as any | undefined
    
        const timeline = useTimeline({
          node: interaction.guildID || ''
        }) || undefined

        if (!channel) {
            await response.edit({
              content: 'Wait a minute... you must be in a voice channel silly!',
              flags: 64,
            })

            return
        }

        if (timeline && timeline.paused) timeline.resume()

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    leaveOnEnd: false,
                    leaveOnEmpty: false,
                    leaveOnStop: true,
                    leaveOnStopCooldown: (30 * 1000),
                    leaveOnEmptyCooldown: (5 * 60 * 1000),
                    metadata: interaction,
                }
            })
          
            await response.edit({
              content: `TRACK FOUND! I've placed [${track.title}](${track.url}) into the queue for you!`,
              flags: 64,
            })
        } catch(error) {
            logger.error(`An error occurred searching for song:\n\n`)
            console.log(error)

            await response.edit({
              content: `I had issues resolving query: ${query}, reason: \`\`\`${error}\`\`\`Report this to the developer.`,
              flags: 64,
            })
        }
    }
}

export default play
