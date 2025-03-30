"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@hephaestus/utils");
const discord_player_1 = require("discord-player");
const player = (0, discord_player_1.useMainPlayer)();
const play = {
    type: 1,
    name: 'play',
    description: 'Play a track !',
    options: [
        {
            type: 3,
            name: 'query',
            required: true,
            description: 'Insert track link or title.',
        }
    ],
    action: (interaction_1, args_1, _a) => __awaiter(void 0, [interaction_1, args_1, _a], void 0, function* (interaction, args, { client }) {
        var _b, _c;
        yield interaction.acknowledge();
        const query = (_b = args['query']) === null || _b === void 0 ? void 0 : _b.value;
        const response = yield interaction.createFollowup({
            content: `Searching for ${query}...`,
            flags: 64,
        });
        const guild = client.guilds.get(interaction.guildID || '');
        if (!guild)
            utils_1.logger.error('This shouldn\'t happen...');
        const voiceChannel = (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.voiceState.channelID;
        const channel = guild === null || guild === void 0 ? void 0 : guild.channels.get(voiceChannel || '');
        const timeline = (0, discord_player_1.useTimeline)({
            node: interaction.guildID || ''
        }) || undefined;
        if (!channel) {
            yield response.edit({
                content: 'Wait a minute... you must be in a voice channel silly!',
                flags: 64,
            });
            return;
        }
        if (timeline && timeline.paused)
            timeline.resume();
        try {
            const { track } = yield player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            yield response.edit({
                content: `TRACK FOUND! I've placed [${track.title}](${track.url}) into the queue for you!`,
                flags: 64,
            });
        }
        catch (error) {
            utils_1.logger.error(`An error occurred searching for song:\n\n`);
            console.log(error);
            yield response.edit({
                content: `I had issues resolving query: ${query}, reason: \`\`\`${error}\`\`\`Report this to the developer.`,
                flags: 64,
            });
        }
    })
};
exports.default = play;
//# sourceMappingURL=play.js.map