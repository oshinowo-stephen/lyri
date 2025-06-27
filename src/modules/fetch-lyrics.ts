import { LyriLogger as logger } from '@utils/logger'
import { Client as GeniusClient  } from 'genius-lyrics'
import config from 'config'

let geniusClient: GeniusClient | undefined
if (config.get('GENIUS_API_KEY')) {
  geniusClient = new GeniusClient(config.get('GENIUS_API_KEY'))
}

export interface GeniusResponse {
  lyrics: string
  uri: string
}

export class GeniusError extends Error {
  constructor(type: string, reason?: string) {
    super(reason ?? 'A genius error has occurred.')
    this.name = type
    this.message = reason ?? 'A genius error has occurred.'
  }
}

const fetch = async (query: string): Promise<GeniusResponse> => {
  if (!geniusClient) {
    throw new GeniusError('NO_KEY')
  }

  try {
    logger.debug(`A genius key was found, trying to find lyrics for: (${query})`)

    const results = await geniusClient.songs.search(query)
    if (results.length === 0) {
      logger.warn('No results were returned searching for lyrics...')

      throw new GeniusError('NO_SONGS_FOUND')
    }

    const tracks = results.filter((song) =>
      query.includes(song.title)
        ? song
        : null
    )

    if (tracks.length === 0) {
      throw new GeniusError('NO_MATCHING_SONGS')
    }

    const firstMatchedSong = tracks[0] // we might have to filter harder later on... but rn we'll be lazy.
    if (!firstMatchedSong) throw new GeniusClient('INVALID_FIRST_MATCHED')
    const lyrics = await firstMatchedSong.lyrics()

    return {
      lyrics: lyrics
        .split('\n')
        .splice(7, 12)
        .join('\n'),
      uri: firstMatchedSong.url
    }
  } catch (_error) {
    logger.error('An error occurred fetching lyrics...')

    console.error(_error)

    throw new GeniusError('INVALID_ERROR')
  }
}

export default fetch