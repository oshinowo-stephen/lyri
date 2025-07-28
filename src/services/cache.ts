import { createClient, RedisArgument } from 'redis'
import { LyriLogger as logger } from '@utils/logger'
import config from 'config'

const LYRI_CACHE_KEY: string = config.get('REDIS_CACHE_KEY') // if we wanna be lazy,

export class CacheError extends Error {
  type: 'INSERT'
    | 'NOT_FOUND'
    | 'FETCH'
    | 'OTHER'
  constructor (
    message: string,
    type?: 'INSERT'
    | 'FETCH'
    | 'NOT_FOUND'
    | 'OTHER'
  ) {
    super(message)
    this.message = message
    this.name = 'CACHE_ERROR'
    this.type = type || 'OTHER'
  }
}

export const client = createClient({
  url: config.get('REDIS_URL')
})

export const store = async <T extends RedisArgument>(key: string, value: T): Promise<void> => {
  try {
    await client.hSet(key, LYRI_CACHE_KEY, value)
  } catch (error) {
    throw new CacheError((error as Error).message)
  }
}

export const fetch = async<T>(key?: string): Promise<T> => {
  console.log('cache key got - ', key)
  if (!key) throw new CacheError('INVALID_KEY', 'NOT_FOUND')

  try {
    return (await client.hGet(key, LYRI_CACHE_KEY)) as T
  } catch (error) {
    console.log((error as Error).message)
    throw new CacheError((error as Error).message)
  }
}

export const rm = async (key?: string): Promise<void> => {
  if (!key) throw new CacheError('INVALID_KEY', 'NOT_FOUND')

  try {
    await client.hDel(key, LYRI_CACHE_KEY)
  } catch (error) {
    throw new CacheError((error as Error).message)
  }
}

export const checkCache = async (query: string): Promise<string> => {
  try {
    const findDirectTitle = async (title: string): Promise<string | undefined> =>
      (await client.keys('*')).length !== 0
        ? (
          await client.keys('*')
        ).filter((k) => k.includes(title))[0] as string
        : undefined

    if ((await findDirectTitle) === undefined) {
      throw new CacheError('NO_MATCHING_KEYS')
    }

    const result = await fetch<string>(await findDirectTitle(query))

    console.log('cache result:', result)
    return result
  } catch (_error) {
    const err = _error as CacheError

    throw new CacheError(err.message, err.type)
  }
}

client.on('error', (error) => {
  logger.error('Redis ran into an error:\n'+JSON.stringify(error))
})

client.on('ready', () => {
  logger.info('The redis-cache is now online.')
})

client.connect()
  .catch((error) => logger.error('An error occurred connecting to the redis-cache:\n\n'+error))