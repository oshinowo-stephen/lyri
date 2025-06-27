import { TopLevelCommand } from '@hephaestus/eris'
import { player } from '@services/player'
import {
  fomatDurationByMillis as duration,
  randomLyriMessage,
  trackProgressBar,
} from '@utils/qol'
import {
  Member,
  MessageContent,
} from 'eris'
import lyrics from '@modules/fetch-lyrics'

const tracks: TopLevelCommand = {
  type: 1,
  name: 'tracks',
  description: 'List all tracks in the current queue, and more...',
  options: [
    {
      type: 5,
      name: 'current',
      required: false,
      description: 'Show the current track playing.'
    },
  ],
  action: async (interaction, args, { client }): Promise<void> => {
    await interaction.acknowledge()

    const manager = player.queueManager
    const showCurrent = args['current']
      ? args['current'].value as boolean
      : false

    let content: MessageContent | string | undefined = undefined
    if (!manager) {
      content = '❌ There is no current manager available... Please report this to the developers!'
      return interaction.createMessage(content)
    }

    const queue = manager.queue(interaction.guildID ?? '')
    if (!queue) {
      content = '❌ There is no song in queue to list!'
      return interaction.createMessage(content)
    }

    let trackLyrics = async (track: string): Promise<string | undefined> => {
      try {
        const trackLyrics = await lyrics(track)

        return `Found lyrics for the following track: ***${track}***\n\n${
          trackLyrics.lyrics === 'No lyrics found.'
            ? ''
            : trackLyrics.lyrics
        }\n\nInterested to sing along with me? Follow [${track} lyrics](${trackLyrics.uri === 'No URL found.' ? 'https://example.com' : trackLyrics.uri }).`
      } catch (_error) {
        return undefined
      }
    }

    const currentTrack = queue.currentPlaybackTrack
    const currentTrackPos = player.currentTrackPosition
    if (!currentTrack) {
      content = `<@${interaction?.member?.id}> There was a problem finding the current track playing`
      return interaction.createMessage(content)
    }

    const currentTrackLyrics: string | undefined = await trackLyrics(currentTrack.info.title ?? 'invalid-track-that-shouldnt-work299')
    const lyriTrackThoughts = `My thoughts on **${currentTrack.info.title}**? Well, ***${randomLyriMessage()}***`

    if ((!showCurrent && (currentTrack && queue.size === 0)) || (showCurrent && currentTrack)) {
      const embeds = [
        {
          color: 0xed9121,
          description: currentTrackLyrics
            ? currentTrackLyrics + `\n\n${lyriTrackThoughts}`
            : lyriTrackThoughts,
          image: {
            url: currentTrack.info.artworkUrl ?? '',
          },
          footer: {
            text: `Requested by: ${(<Member>currentTrack.userData.playedBy).globalName ?? 'Unknown Member.'}\n`
              + `[${trackProgressBar(currentTrackPos, currentTrack.info.length, 10)}] | [${duration(currentTrackPos)}/${duration(currentTrack.info.length)}]`,
            icon_url: (<Member>currentTrack.userData.playedBy).avatarURL,
          },
        },
      ]

      return interaction.createMessage({
        embeds,
        content: `🎶 **Now Playing:** [${currentTrack.info.title}](${currentTrack.info.uri})`,
      })
    } else if (!showCurrent && (queue.size > 0 && currentTrack)) {
      const upcomingTracks = queue.queue.map((track) =>
        `🎶 [${track.info.title}](<${track.info.uri}>) by ${track.info.author} (${duration(track.info.length)})`
      ).splice(0, 10).join('\n')

      content = `CURRENTLY IN ***[${client.guilds.get(interaction.guildID ?? '')?.name ?? 'Your Guild\'s'}]*** queue:\n`
      queue.loopMode !== 'off'
        ? content += `\nCurrently looping this: ${queue.loopMode}`
        : null
      content += `\n**Current Track:** [${currentTrack.info.title}](<${currentTrack.info.uri}>) by ${currentTrack.info.author} (${duration(currentTrack.info.length)})`
      content += `\n\n**Upcoming Tracks:**\n${upcomingTracks || 'No upcoming tracks in the queue.'}\n${queue.size > 10 ? `\nAnd ${queue.size - 10} more tracks...` : ''}`
      content += `\n\nTotal tracks in queue: ${queue.size}`
      content += `\n\nRemember to use \`/tracks current\` to see the current track playing!`

      interaction.createMessage(content)
    }
  }
}

export default tracks