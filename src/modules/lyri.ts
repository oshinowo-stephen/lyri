import { Hephaestus as Forge } from '@hephaestus/eris'
import { join as __join } from 'path'
import { ClientOptions, Client } from 'eris'
import config from 'config'

export type ForgeExtended = Forge & {
  uptime?: number
}

const erisOptions: ClientOptions = {
  restMode: true,
  intents: [
    'guilds',
    'guildEmojis',
    'guildEmojisAndStickers',
    'guildVoiceStates',
    'guildMembers',
    'guildMessages',
    'guildVoiceStates',
    'messageContent',
  ]
}

export const lyri: ForgeExtended = new Forge(config.get('BOT_TOKEN'), erisOptions)
lyri.uptime = 0

export const client = lyri.client

export default lyri