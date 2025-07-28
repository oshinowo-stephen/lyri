import {
  CommandWithSubCommands,
} from '@hephaestus/eris'

import djRole from './dj-role'
// import adminRole from './admin-role'
import leaveOnEmpty from './leave-on-empty'

import {
  isDev,
  isAdmin,
} from '@utils/perms'

const settings: CommandWithSubCommands = {
  name: 'player-settings',
  description: 'Configure your guild settings!',
  permission: {
    level: 0,
    name: 'admin',
    action: async (interaction, _, _client) => {
      if (interaction.member) {
        return (
          isAdmin(interaction.member)
          || isDev(interaction.member)
        )
      } else {
        return false
      }
    }
  },
  options: [
    leaveOnEmpty,
    // adminRole,
    djRole,
  ]
}

export default settings