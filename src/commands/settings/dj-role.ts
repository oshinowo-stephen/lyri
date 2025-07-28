import {
  TopLevelCommand
} from '@hephaestus/eris'
import {
  player
} from '@services/player'
import {
  Client,
  Guild
} from 'eris'
import * as db from '@services/storage'
import { GuildPlayer } from '.prisma/client'

const djRole: TopLevelCommand = {
  type: 1,
  name: 'dj-role',
  description: 'Set the DJ role',
  options: [
    {
      type: 3,
      name: 'role',
      description: 'The role that\'ll be in charge of the queue.',
      required: false
    }
  ],
  action: async (interaction, args, client): Promise<void> => {
    if (!interaction.guildID) return

    const desiredRole = args['role']
      ? args['role'].value as string
      : undefined



    if (desiredRole) {
      if (!isValidRole(client.client, desiredRole, interaction.guildID))
        return interaction.createMessage('Invalid Role')

      const roleUpdated = await setOrUpdateDJ(interaction.guildID, desiredRole)

      if (roleUpdated === 'updated') {
        interaction.createMessage({
          content: 'DJ role UPDATED',
          flags: 64,
        })
      } else {
        interaction.createMessage({
          content: 'DJ role FAILED to update',
          flags: 64
        })
      }
    } else {
      interaction.createMessage({
        content: 'Invalid Role',
        flags: 64
      })
    }
  }
}

type DJRoleResponse = 'updated'
  | 'failed'

const isValidRole = (client: Client, role: string, guildId: string): boolean => {
  const guild = client.guilds.get(guildId) as Guild
  const r = guild.roles.get(role)

  return !r
}

const setOrUpdateDJ = async (guildId: string, role: string): Promise<DJRoleResponse> => {
  try {
    const currentSettings = await db.fetch('guildPlayer', {
      where: {
        guildId,
      }
    }) as GuildPlayer

    if (currentSettings.djRole) {
      await db.update('guildPlayer', {
        where: {
          guildId
        },
        data: {
          djRole: role
        }
      })
    } else {
      await db.insert('guildPlayer', {
        data: {
          djRole: role,
          guildId,
        }
      })
    }

    return 'updated'
  } catch (error) {
    const prismaError = error as db.PrismaError
    console.log(prismaError)

    if (prismaError.type === 'FETCH') {
      db.initialize('guildPlayer', {
        djRole: role,
        adminRole: null,
        leaveOnEmpty: false,
        leaveOnEmptyDuration: 0,
        guildId,
      })

      return 'updated'
    } else {
      console.log(error)

      return 'failed'
    }
  }
}

export default djRole
