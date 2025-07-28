import { TopLevelCommand } from '@hephaestus/eris'
import { player } from '@services/player'
import { localizeDuration, randomCheckUpMessage, randomInstrument } from '@utils/qol'
import { MessageContent } from 'eris'

const ping: TopLevelCommand = {
  type: 1,
  name: 'check-up',
  description: 'If you\'re wondering how i\'m doing...',
  action: async (interaction, _, { client }): Promise<void> => {
    await interaction.acknowledge()
    const message = await interaction.createFollowup('Uhm...')
    const botResponse = (Date.now() - message.timestamp)
    const avgLatency = [...client.shards.values()]
      .reduce((a, s) => a + s.latency, 0) / client.shards.size
    const clientUptime = localizeDuration(client.uptime)
    const playerUptime = localizeDuration(player.uptime)

    const content: MessageContent = {
      content: `Took me ${botResponse}ms to respond! ${
        botResponse <= 100
          ? 'Pretty fast reaction time, huh?'
          : botResponse <= 1200
            ? 'Alright, but not my best...'
            : 'I\'M LAG-- GIN!!!'
      }`,
      embeds: [
        {
          color: 0xB01E28,
          title: `💓 Status Checkup | LATENCY BETWEEN SHARDS: ${avgLatency}ms`.toLocaleUpperCase(),
          description: `How am I doing? ${randomCheckUpMessage()}`,
          fields: [
            {
              name: 'My uptime?',
              value: client.uptime !== 0
                ? `I've been up for ${clientUptime}`
                : 'I\'m currently sleeping...',
              inline: true,
            },
            {
              name: 'My longest running instrument?',
              value: player.uptime !== 0 && player.node !== undefined
                ? `I've been playing the ***${randomInstrument()}***, for ${playerUptime}`
                : 'No instruments at the moment...',
              inline: true
            }
          ]
        }
      ]
    }

    message.edit(content)
  }
}

export default ping
