import {
  TextableChannel,
  Message,
  Client
} from "eris"

export const fomatDurationByMillis = (duration: number): string => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export const trackProgressBar = (current: number, total: number, length: number = 20): string => {
  const progress = Math.floor((current / total) * length)
  return '▬'.repeat(progress) + '🔘' + '▬'.repeat(length - progress - 1)
}

export const awaitResponse = (client: Client, channel: TextableChannel, user: string, timeout: number = 30000): Promise<Message> => {
  return new Promise((resolve, reject) => {
    const listener = (message: Message) => {
      if (message.author.id === user && message.channel.id === channel.id) {
        console.log('Response received:', message.content)
        // Remove the listener to prevent memory leaks
        client.removeListener('messageCreate', listener)
        resolve(message)
      }
    }

    client.once('messageCreate', listener)

    setTimeout(() => {
      client.removeListener('messageCreate', listener)
      reject(new Error('Response timed out'))
    }, timeout)
  })
}

export const randomLyriMessage = (): string =>
  ([
    'Ah, what a beautiful song!',
    'This track is a masterpiece!',
    'I could listen to this all day!',
    'Such a vibe, I love it!',
    'This song hits different!',
    'The rhythm is just perfect!',
  ])[Math.floor(Math.random() * 6)] as string
