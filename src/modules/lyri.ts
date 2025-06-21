import { Hephaestus as Forge } from '@hephaestus/eris'
import { join as __join } from 'path'
import { ClientOptions } from 'eris'
import config from 'config'

// optional exports

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

export const lyri = new Forge(config.get('BOT_TOKEN'), erisOptions)

export const client = lyri.client

export default lyri