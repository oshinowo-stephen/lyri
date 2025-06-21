import {
  Node,
  Rest,
  Track,
  GuildPlayer,
  PlayerStatus,
  TrackResponse
} from '@discordx/lava-player'

import shuffleArray from 'lodash/shuffle'

export type LoopMode = 'off'
  | 'track'
  | 'queue'

export class QueueError extends Error {
  constructor(name: string, message: string) {
    super(message)
    this.name = name
    this.message = message
    this.stack = 'QUEUE_ERROR'
  }
}

export default class Queue {
  node: Node
  guild: string
  private _tracks: Track[] = []
  private _currentPlaybackTrack: Track | undefined = undefined
  private _currentTrackPosition: number = 0
  private _loopMode: LoopMode = 'off'
  private _leaveOnEmpty: boolean = false
  private _leaveOnEmptyTimeout: number = (10 * 1000) // Default to 10 seconds

  get queue(): readonly Track[] {
    return this._tracks
  }

  get currentPlaybackTrack(): Track | undefined {
    return this._currentPlaybackTrack ?? undefined
  }

  get currentTrackPosition(): number {
    return this._currentTrackPosition
  }

  get loopMode(): LoopMode {
    return this._loopMode
  }

  get leaveOnEmpty(): boolean {
    return this._leaveOnEmpty
  }

  get leaveOnEmptyTimeout(): number {
    return this._leaveOnEmptyTimeout
  }

  get size(): number {
    return this._tracks.length
  }

  get player(): GuildPlayer {
    return this.node.guildPlayerStore.get(this.guild)
  }

  get rest(): Rest {
    return this.node.rest
  }

  get http() {
    return this.player.http
  }

  get session() {
    return this.node.sessionId
  }

  get playing(): boolean {
    return (
      this.currentPlaybackTrack !== undefined &&
      this.player.status === PlayerStatus.PLAYING
    )
  }

  constructor(node: Node, guild: string) {
    // Initialize the queue with default values if needed
    this.node = node
    this.guild = guild
  }

  insertTracks(...tracks: Track[]): void {
    this._tracks.push(...tracks)
  }

  insertFirstTrack(...tracks: Track[]): void {
    this._tracks.unshift(...tracks)
  }

  changeTrackPosition(position: number): void {
    if (position < 0 || position >= this.size) {
      throw new Error('Position out of bounds')
    }

    if (this._tracks.length === 0) {
      throw new Error('Queue is empty')
    }

    if (this._currentPlaybackTrack && this._currentTrackPosition === position) {
      return // No change needed
    }

    this._currentTrackPosition = position
    this._currentPlaybackTrack = this._tracks[position]
  }

  async playNextTrack(): Promise<Track> {
    if (this.currentPlaybackTrack !== undefined && this.loopMode !== 'off') {
      if (this.loopMode === 'queue') {
        this.insertTracks(this.currentPlaybackTrack)
      } else {
        this.insertFirstTrack(this.currentPlaybackTrack)
      }
    }

    this._currentPlaybackTrack = undefined

    const nextTrack = this._tracks.shift()
    if (!nextTrack) throw new QueueError('NO_TRACKS', 'No tracks found in queue.')

    await this.player.update({
      track: {
        encoded: nextTrack.encoded
      }
    })

    this._currentPlaybackTrack = nextTrack
    return nextTrack
  }

  async pause(): Promise<void> {
    await this.player.update({ paused: true })
    this.player.status = PlayerStatus.PAUSED
  }

  async resume(): Promise<void> {
    await this.player.update({ paused: false })
    this.player.status = PlayerStatus.PLAYING
  }

  async purge(): Promise<void> {
    this._currentPlaybackTrack = undefined
    this.removeAllTracks()

    await this.player.leave()
    await this.player.destroy()
  }

  search(text: string): Promise<TrackResponse> {
    return this.rest.loadTracks(text)
  }

  removeTracks(...indices: number[]): void {
    if (indices.length === 0) return

    // Sort indices in descending order to avoid index shifting issues
    indices.sort((a, b) => b - a)

    for (const index of indices) {
      if (index < 0 || index >= this._tracks.length) {
        throw new Error(`Index ${index} out of bounds`)
      }
      this._tracks.splice(index, 1)
    }

    // If the current track was removed, reset it
    if (this._currentPlaybackTrack && !this._tracks.includes(this._currentPlaybackTrack)) {
      this._currentPlaybackTrack = undefined
      this._currentTrackPosition = 0
    }
  }

  removeAllTracks(): void {
    this._tracks = []
  }

  setLoopMode(mode: LoopMode): void {
    if (!['off', 'track', 'queue'].includes(mode)) {
      this._loopMode = 'off'
    }

    this._loopMode = mode
  }

  setPlaybackPosition(time: number): void {
    this._currentTrackPosition = time
  }

  shuffleQueue(): void {
    this._tracks = shuffleArray(this._tracks)
  }
}