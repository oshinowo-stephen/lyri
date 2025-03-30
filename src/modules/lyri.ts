import { Hephaestus as Forge } from '@hephaestus/eris'
import { join as __join } from 'path'
import { ClientOptions } from 'eris'
import config from 'config'

const erisOptions: ClientOptions = {
  restMode: true,
  intents: [
        'guilds',
        'guildMembers',
        'guildMessages',
        'guildVoiceStates',
  ] 
}

export const randomBotMessages = (): string => {
  const messages = [
    'OH I\'ve heard this before!',
    'Wow a nice song is playing atm!',
    'I feel the vibes with this one...'
  ]

  return messages[Math.floor(Math.random() * messages.length)] as string
}

export const lyri = new Forge(config.get('BOT_TOKEN'), erisOptions) 

export const client = lyri.client
