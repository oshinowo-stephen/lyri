import { TopLevelCommand } from '@hephaestus/eris'
import { lyri } from '@modules/lyri'
import config from 'config'

const help: TopLevelCommand = {
  type: 1,
  name: 'help',
  description: 'List useful commands/interactions you can make with me!',
  action: async (interaction, _, { client }): Promise<void> => {
    await interaction.acknowledge()

    const commandListToFields: Array<{
      name: string,
      value: string
      inline: boolean
    }> = []

    lyri.commands.forEach((cmd) => {
      cmd.name !== 'help'
        ? commandListToFields.push({
          name: cmd.name,
          value: cmd.description,
          inline: true
        })
        : undefined
    })

    interaction.createMessage({
      embeds: [
        {
          title: 'A list of my current available commands!',
          thumbnail: {
            url: client.user.avatarURL
          },
          fields: [
            ...commandListToFields
          ],
          footer: {
            text: `If you can support pops! Find more info here: ${config.get('DEVELOPER_PAGE')}`,
            icon_url: client.users.get(config.get('DEVELOPER_ID'))?.avatarURL
          }
        }
      ]
    })
  }
}

export default help

