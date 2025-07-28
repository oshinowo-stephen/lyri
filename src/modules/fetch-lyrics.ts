import { LyriLogger as logger } from '@utils/logger'
import { Client as GeniusClient } from 'genius-lyrics'
import {
  CacheError,
  checkCache,
  store as cacheStore,
} from '@services/cache'
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

  logger.debug(`A genius key was found, trying to find lyrics for: (${query})`)

  try {
    const inCache = await checkCache(query)

    if (inCache.length > 0) {
      logger.debug('Lyrics found in cache, using this instead.')
    }

    return JSON.parse(inCache) as GeniusResponse
  } catch (cacheError) {
    if ((cacheError as CacheError).type === 'NOT_FOUND') {
      try {
        const results = await geniusClient.songs.search(query, {
          sanitizeQuery: true
        })
        if (results.length === 0) {
          logger.warn('No results were returned searching for lyrics...')

          throw new GeniusError('NO_SONGS_FOUND')
        }

        // filter tracsk to match a title
        const tracks = results.filter(
          (song) =>
            !song.fullTitle.includes(query)
              ? !song.featuredTitle.includes(query)
                ? !song.title.includes(query)
                  ? null
                  : song
                : song
              : song
        )

        if (tracks.length === 0) {
          throw new GeniusError('NO_MATCHING_SONGS')
        }


        // TODO: Filter tracks to match language/preference
        const firstMatchedSong = tracks[0]
        if (!firstMatchedSong) throw new GeniusClient('INVALID_FIRST_MATCHED')
        const lyrics = await firstMatchedSong.lyrics()
        const resp: GeniusResponse = {
          lyrics: lyrics
            .split('\n')
            .splice(7, 12)
            .join('\n'),
          uri: firstMatchedSong.url
        }

        cacheStore(firstMatchedSong.title, JSON.stringify(resp))

        return resp
      } catch (geniusError) {
        const error = geniusError as GeniusError

        logger.error(`Genius error, [${error.name}]: ${error.message}`)

        throw error
      }
    } else {
      const error = cacheError as CacheError

      logger.error(`A cache error occurred, [${error.type}]: ${error.message} (${error.name})`)

      throw error
    }
  }

}

export default fetch