import {
  CommandWithSubCommands,
} from '@hephaestus/eris'

import leaveOnEmpty from './leave-on-empty'

const settings: CommandWithSubCommands = {
  name: 'queue-config',
  description: 'Configure your guild queue settings!',
  options: [
    leaveOnEmpty
  ],
}

export default settings