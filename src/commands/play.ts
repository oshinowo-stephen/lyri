import { TopLevelCommand } from '@hephaestus/eris'
import { player as PlayerNode } from '@services/player'
import { Track } from '@discordx/lava-player'

import { LyriLogger as logger } from '@utils/logger'
import { findTracks, isPlaylist, TrackSource } from '@modules/track-loader'
import { Queue } from '@modules/queue-manager'
import { awaitResponse } from '@utils/qol'

const play: TopLevelCommand = {
  type: 1,
  name: 'play',
  description: 'I\'ll play a song for you!',
  options: [
    {
      type: 3,
      name: 'query',
      required: true,
      description: 'Inserting the track URL or title -- HERE.'
    },
    {
      type: 3,
      name: 'source',
      required: false,
      description: 'The source of the track, e.g. `youtube`, `soundcloud`, etc. Defaults to `youtube`.',
      choices: [
        {
          name: 'youtube',
          value: 'ytsearch',
        }
      ],
    }
  ] as const,
  action: async (interaction, args, { client }): Promise<void> => {
    const query = args['query']?.value as string
    const source = args['source']?.value as string || 'ytsearch'

    await interaction.acknowledge()
    const response = await interaction.createFollowup({
      content: `🔎 SEARCHING FOR: [${query}]... Please standby...`,
      flags: 64,
    })

    const queue = PlayerNode.node && typeof interaction.guildID === 'string'
      ? PlayerNode.queueManager?.queue(interaction.guildID)
      : undefined
    const player = queue && typeof interaction.guildID === 'string'
      ? queue.player
      : undefined

    if (!queue) {
      response.edit('❌ Failed to initialize the guild\'s queue!')
      return
    }

    if (!player) {
      response.edit('❌ Failed to initialize the guild\'s player!')
      return
    }

    if (
      (interaction.member && interaction.member.voiceState)
      && interaction.member.voiceState.channelID
    ) {
      logger.debug('Member voice state is available, joining voice channel...')
      await player.join({
        channel: interaction.member.voiceState.channelID,
        deaf: true,
        mute: false,
      })
    } else {
      logger.debug('Member voice state is not available, cannot join voice channel.')
      response.edit('❌ You must be in a voice channel to play music!')
      return
    }

    try {
      const tracksResponse = await findTracks(query, queue, interaction.member, (source as TrackSource))

      if (!tracksResponse || (Array.isArray(tracksResponse) && tracksResponse.length === 0)) {
        response.edit(`❌ No tracks found for the query: \`${query}\``)
        return
      }

      if (Array.isArray(tracksResponse)) {
        let content = '🎶 Found the following tracks:\n'
        content += tracksResponse.map((track, index) => `**${index + 1}.** [${track.info.title}](<${track.info.uri}>)`)
          .splice(0, 10) // Limit to 10 tracks
          .join('\n')
        content += `\n\nInput the track number to play it, or type \`cancel\` or \`exit\` to cancel.`

        await response.edit({ content, flags: 64})
        const userResponse = await awaitResponse(client, interaction.channel, interaction.member.id)

        if (userResponse.content.toLowerCase() === 'cancel' || userResponse.content.toLocaleLowerCase() === 'exit') {
          response.edit('❌ Track selection cancelled.')
          return
        }

        const trackIndex = parseInt(userResponse.content, 10) - 1
        if (isNaN(trackIndex) || trackIndex < 0 || trackIndex >= tracksResponse.length) {
          response.edit('❌ Invalid track number selected. Please try again.')
          return
        }
        const selectedTrack = tracksResponse[trackIndex]
        // console.log('user selected track:', selectedTrack)
        if (!selectedTrack) {
          response.edit('❌ Selected track not found. Please try again.')
          return
        }

        let playTrackResponse = await playTracks(queue, selectedTrack)
        await userResponse.delete('Lyri awaited response, no need to have here...')
          .catch((_) => {
            logger.debug('Unable to delete this message, most likly missing perms.')
            playTrackResponse += `\n\n> I'm currently missing permissions to delete messages.`
            playTrackResponse += `\n> Please allow me to delete message to remove clutter from awaited user respones!`
          })
        response.edit({
          content: playTrackResponse,
          flags: 64,
        })
      } else if (isPlaylist(tracksResponse) && tracksResponse.tracks.length !== 0) {
        const playTrackResponse = await playTracks(queue, tracksResponse.tracks, tracksResponse.info.name)
        response.edit({
          content: playTrackResponse,
          flags: 64,
        })
      } else {
        const playTrackResponse = await playTracks(queue, (tracksResponse as Track))
        response.edit({
          content: playTrackResponse,
          flags: 64,
        })
      }
    } catch (error) {
      response.edit({
        content: `❌ Failed to play the track, reason: \`\`\`\n${error}\n\`\`\``,
        flags: 64,
      })

      return
    }
  }
}

const playTracks = async (queue: Queue, tracks: Track | Track[], playlistTitle?: string): Promise<string> => {
  if (Array.isArray(tracks)) {
    queue.insertTracks(...tracks)
    await queue.playNextTrack()
    return `🎧 Loaded Playlist: ***${playlistTitle ?? 'Unknown Playlist'}*** with *[${tracks.length}]* tracks`
  } else {
    if (!queue.playing && queue.size === 0) {
      queue.insertTracks(tracks)
      await queue.playNextTrack()
      return `▶️ Now playing: [${tracks.info.title}](<${tracks.info.uri}>)`
    } else {
      await queue.insertTracks(tracks)
      return `⬆️ Track added to the queue: [${tracks.info.title}](<${tracks.info.uri}>)`
    }
  }
}

export default play
