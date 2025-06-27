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

export const localizeDuration = (duration: number): string => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`
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

export const randomInstrument = (): string => {
  const instruments = [
    'Violin',
    "Accordion",
    "Acoustic guitar",
    "Aeolian Harp",
    "Agung",
    "Ahoko",
    "Alphorn",
    "Alto saxophone",
    "Angklung",
    "Appalachian dulcimer",
    "Archlute",
    "Arghul",
    "Bagpipes",
    "Balafon",
    "Balalaika",
    "Bandoneón",
    "Banjo",
    "Baritone horn",
    "Bass Clarinet",
    "Bass Drum",
    "Bass flute",
    "Bass guitar",
    "Bassoon",
    "Bawu",
    "Bell",
    "Berimbau",
    "Bianqing",
    "Biniou",
    "Biwa",
    "Bodhrán",
    "Bongo drum",
    "Bouzouki",
    "Button accordion",
    "Calliope",
    "Carillon",
    "Castanets",
    "Celesta",
    "Cello",
    "Chenda",
    "Chimes",
    "Clarinet",
    "Classical guitar",
    "Clavichord",
    "Concertina",
    "Conch",
    "Conga",
    "Contrabassoon",
    "Cornet",
    "Cowbell",
    "Cymbals",
    "Dhol",
    "Didgeridoo",
    "Djembe",
    "Double Bass",
    "Drum machine",
    "Dulcimer",
    "Electric guitar",
    "Electric organ",
    "English Horn",
    "Erhu",
    "Euphonium",
    "Flugelhorn",
    "Flute",
    "French Horn",
    "Gamelan",
    "Ghatam",
    "Glockenspiel",
    "Gong",
    "Guitar",
    "Guqin",
    "Guzheng",
    "Harmonica",
    "Harmonium",
    "Harp",
    "Harpsichord",
    "Kalimba",
    "Koto",
    "Lute",
    "Mandolin",
    "Maracas",
    "Marimba",
    "Oboe",
    "Ocarina",
    "Ophicleide",
    "Organ",
    "Oud",
    "Panpipes",
    "Piano",
    "Piccolo",
    "Recorder",
    "Saxophone",
    "Sitar",
    "Surbahar",
    "Tabla",
    "Tamborim",
    "Tambourine",
    "Timpani",
    "Triangle",
    "Trombone",
    "Trumpet",
    "Tuba",
    "Ukulele",
    "Viola",
    "Violin",
    "Vibraphone",
    "Xylophone",
    "Zither"
  ]

  return (instruments[Math.floor(Math.random() * instruments.length)] as string).toUpperCase()
}

export const randomCheckUpMessage = (): string => ([
  'Really well actually, thanks for asking!',
  'As great as I can be, dad\'s taking me to an opera later!',
  'Just came back from music-camp, I\'ve met such bright people there!',
  'Not so bad, just trying to figure out how to play an chello...',
  '... I\'ve seen better days...'
])[Math.floor(Math.random() * 5)] as string