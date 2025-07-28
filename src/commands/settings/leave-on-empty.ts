import {
  TopLevelCommand,
} from '@hephaestus/eris'
import {
  player
} from '@services/player'
import * as db from '@services/storage'
import { GuildPlayer } from '.prisma/client'

const leaveOnEmpty: TopLevelCommand = {
  type: 1,
  name: 'leave-on-empty',
  description: "Leaves channel when turned on, stays if off. Toggle between turning it off or on.",
  options: [
    {
      type: 3,
      name: 'timer',
      description: "Set a duration. I'll leave after the duration is over!",
      required: false,
    }
  ],
  action: async (interaction, args): Promise<void> => {
    if (!interaction.guildID) return

    const timer = args['timer']
      ? args['timer'].value as number
      : undefined

    try {
      const currentSettings = await db.fetch('guildPlayer', {
        where: {
          guildId: interaction.guildID
        }
      })

      if (!timer) {
        await toggleLeaveOnEmpty(interaction.guildID, (currentSettings as GuildPlayer).leaveOnEmpty)
      } else {
        const isValidTimer = Number(timer)

        if (!isNaN(isValidTimer) && isValidTimer <= 60) {
          await updateLeaveTimer(interaction.guildID, isValidTimer * 1000)
        } else {
          return interaction.createMessage('Invalid duration, resorting back to original.')
        }
      }

      const settings = await db.fetch('guildPlayer', {
        where: {
          guildId: interaction.guildID
        }
      })

      const leaveOnEmpty = (settings as GuildPlayer).leaveOnEmpty
      const leaveOnEmptyDuration = (settings as GuildPlayer).leaveOnEmptyDuration

      interaction.createMessage(`I've set the guild's \`leaveOnEmpty\` to: ${
        !leaveOnEmpty
          ? leaveOnEmptyDuration > 0
            ? `**${leaveOnEmptyDuration / 1000}s**`
            : '**OFF**'
          : '**ON**'
      }`)
    } catch(error) {
      const primsaError = error as db.PrismaError
      console.error(primsaError)

      if (primsaError.type === 'FETCH') {
        db.initialize('guildPlayer', {
          djRole: null,
          adminRole: null,
          leaveOnEmpty: false,
          leaveOnEmptyDuration: 0,
          guildId: interaction.guildID
        })
      } else {
        console.log(error)

        return interaction.createMessage('An unhandled error occurred resolving this command. Please report this to a developer.')
      }

      interaction.createMessage('An error occurred resolving this command, please try again...')
    }
  }
}

const toggleLeaveOnEmpty = async (guildId: string, leaveOnEmpty: boolean): Promise<void> =>
  await db.update('guildPlayer', {
    where: {
      guildId
    },
    data: {
      leaveOnEmptyDuration: 0,
      leaveOnEmpty: !leaveOnEmpty,
    }
  })

const updateLeaveTimer = async (guildId: string, leaveOnEmptyDuration: number): Promise<void> =>
  await db.update('guildPlayer', {
    where: {
      guildId
    },
    data: {
      leaveOnEmpty: false,
      leaveOnEmptyDuration
    }
  })

export default leaveOnEmpty