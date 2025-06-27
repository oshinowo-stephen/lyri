import {
  TopLevelCommand,
} from '@hephaestus/eris'
import {
  player
} from '@services/player'

const leaveOnEmpty: TopLevelCommand = {
  type: 1,
  name: 'leave-on-empty',
  description: "Leaves the VC if turned on otherwise you can set a timer or leave this off",
  options: [
    {
      type: 3,
      name: 'timer',
      description: "Set the timer duration!",
      required: false,
    }
  ],
  action: async (interaction, args): Promise<void> => {
    const manager = player.queueManager
    if (!manager) {
      return interaction.createMessage('No manager was created for this guild yet, try playing a song first and try again!')
    }

    const queue = manager.queue(interaction.guildID ?? '')
    if (!queue) {
      return interaction.createMessage('No queue was found for this guild.')
    }

    const timer = args['timer']
      ? args['timer'].value as number
      : undefined

    if (!timer) {
      queue.leaveOnEmptySet(!queue.leaveOnEmpty)

      return interaction.createMessage(`I've set \`leaveOnEmpty\` to: \`${queue.leaveOnEmpty}\``)
    } else {
      const isValidTimer = Number(timer)

      if (!isNaN(isValidTimer) && isValidTimer <= 60) {
        queue.leaveOnEmptySet(false)

        queue.setLeaveOnEmptyTimer(isValidTimer * 1000)
      } else {
        queue.setLeaveOnEmptyTimer(0)
      }
    }
  }
}

export default leaveOnEmpty