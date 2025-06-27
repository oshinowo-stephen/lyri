import { createClient, RedisArgument } from 'redis'
import { LyriLogger as logger  } from '@utils/logger'
import config from 'config'

const LYRI_CACHE_KEY: string = config.get('REDIS_CACHE_KEY') ?? 'lyri-cache-key' // if we wanna be lazy,

export const client = createClient({
  url: config.get('REDIS_URL')
})

export const store = async <T extends RedisArgument>(key: string, value: T): Promise<void> => {
  await client.hSet(key, LYRI_CACHE_KEY, value)
}

export const fetch = async<T>(key: string): Promise<T> => {
  return (await client.hGet(key, LYRI_CACHE_KEY)) as T
}

export const rm = async (key: string): Promise<void> => {
  await client.hDel(key, LYRI_CACHE_KEY)
}

client.on('error', (error) => {
  logger.error('Redis ran into an error:\n'+JSON.stringify(error))
})

client.on('ready', () => {
  logger.info('The redis-cache is now online.')
})

client.connect()
  .catch((error) => logger.error('An error occurred connecting to the redis-cache:\n\n'+error))