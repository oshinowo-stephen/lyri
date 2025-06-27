import { LoadType, PlaylistInfo, Track } from '@discordx/lava-player'
import { Queue } from '@modules/queue-manager'
import { Member } from 'eris'
import { LyriLogger as logger } from '@utils/logger'

export type TrackSource = 'youtube' | 'soundcloud' | 'spotify' | 'bandcamp' | 'twitch' | 'vimeo'


interface PlaylistData {
  info: PlaylistInfo,
  tracks: Track[]
}

export const isPlaylist = (obj: any): obj is PlaylistData =>
  (
    typeof obj === 'object'
    && (obj !== null || obj !== undefined)
    && 'info' in obj
    && 'tracks' in obj
  ) as boolean

const youtubeVideoRegex = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/
const youtubePlaylistRegex = /[\?&]list=([a-zA-Z0-9_-]+)/

const getIdByYoutubeURL = (url: string): string | undefined =>
  url.match(youtubeVideoRegex)
    ? url.match(youtubeVideoRegex)![1] as string
    : url.match(youtubePlaylistRegex)
      ? url.match(youtubePlaylistRegex)![1]
      : undefined

const findTracksByYtQuery = async (queue: Queue, query: string, member: Member): Promise<Track[]> => {
  if (!queue.player) throw new Error('Player is not initialized.')
  const response = await queue.search(`ytsearch:${query}`)

  if (response.loadType !== LoadType.SEARCH || response.data.length === 0) {
    throw new Error(`The track: ${query} was not found! Please try another one.`)
  }

  let tracks = response.data as Track[]

  tracks = tracks.map((track) => {
    track.userData = {
      playedAt: Date.now(),
      playedBy: member
    }

    return track
  })

  return tracks
}

const loadPlaylistByYtId = async (queue: Queue, id: string, member: Member): Promise<PlaylistData> => {
  if (!queue.player) throw new Error('Player is not initalized.')
  const response = await queue.search(`ytsearch:${id}`)

  if (response.loadType !== LoadType.PLAYLIST || response.data.tracks.length === 0) {
    throw new Error(`Failed to load playlist: ${id}. Please try again.`)
  }

  let tracks: Track[] = []
  tracks.push(...response.data.tracks)

  tracks = tracks.map((track) => {
    track.userData = {
      playedAt: Date.now(),
      playedBy: member
    }

    return track
  })

  return {
    tracks,
    info: response.data.info,
  }
}

const loadTrackByYtId = async (queue: Queue, id: string, member: Member): Promise<Track> => {
  if (!queue.player) throw new Error('Player is not initialized.')
  const response = await queue.search(`ytsearch:${id}`)

  if (response.loadType !== LoadType.SEARCH || response.data.length === 0) {
    throw new Error(`The track with ID: ${id} was not found! Please try another one.`)
  }

  let track = response.data.find((track) => track.info.identifier === id)
  if (!track) {
    logger.warn(`Track with ID: ${id} not found in search results, going with first result.`)
    track = response.data[0]
  }

  (track as Track).userData = {
    playedAt: Date.now(),
    playedBy: member
  }

  return track as Track
}

export const findTracks = async (query: string, guildQueue: Queue, member: Member, source?: TrackSource): Promise<Track | PlaylistData | Track[]> => {
  // if not souce ws provided, default to youtube search
  switch (source) {
    default:
      const ytId = getIdByYoutubeURL(query)
      logger.trace(ytId ?? 'Unable to do nothing.')
      if (!ytId) return (await findTracksByYtQuery(guildQueue, query, member))

      try {
        return (await loadPlaylistByYtId(guildQueue, ytId, member))
      } catch (error) {
        try {
          return (await loadTrackByYtId(guildQueue, ytId, member))
        } catch (error) {
          throw new Error(`Invalid Query: "${query}". A direct link or title should do.`)
        }
      }
  }
}
