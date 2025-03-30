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
exports.state = exports.player = void 0;
const extractor_1 = require("@discord-player/extractor");
const discord_player_1 = require("discord-player");
const discord_player_youtubei_1 = require("discord-player-youtubei");
const utils_1 = require("@hephaestus/utils");
const lyri_1 = require("./lyri");
exports.player = new discord_player_1.Player((0, discord_player_1.createErisCompat)(lyri_1.client));
exports.state = {
    memberQueue: new Map(),
    trackTimers: new Map()
};
exports.player.events.on('playerStart', (_queue, track) => {
    utils_1.logger.info(`Playing track: ${track.title}`);
    exports.state.trackTimers.set(track.id, Date.now());
});
exports.player.events.on('playerSkip', (_queue, _track) => {
    utils_1.logger.warn(`Skipping track: ${_track.title}`);
});
exports.player.events.on('audioTracksAdd', (_queue, tracks) => {
    for (const track of tracks) {
        exports.state.memberQueue.set(track.id, _queue.metadata.member);
    }
});
exports.player.events.on('audioTrackAdd', (_queue, track) => {
    utils_1.logger.info(`Adding track: ${track.title} to current queue.`);
    exports.state.memberQueue.set(track.id, _queue.metadata.member);
});
exports.player.events.on('debug', (_queue, message) => {
    console.log(`[DEBUG ${_queue.guild.id}] ${message}`);
});
exports.player.events.on('error', (_queue, error) => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.logger.error('the discord-player fell into an error:\n\n');
    console.error(error);
    yield _queue.metadata.createMessage({
        content: 'I fell into a stump, error logs was sent to my father... Hopefully this will be resolved soon...',
        flags: 64
    });
}));
exports.player.events.on('playerError', (_queue, error, track) => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.logger.error(`display-player had an player error playing this: ${track.cleanTitle}\n\n`);
    console.error(error);
    yield _queue.metadata.createMessage({
        content: `I've ran into an error trying to play: ${track.title} by ${track.author}, removing it from queue.
      \`\`\`${error}\`\`\`
      Check with <@229651386223034368>
      `,
        flags: 64
    });
}));
exports.player.extractors.loadMulti(extractor_1.DefaultExtractors)
    .catch((error) => console.log(error));
exports.player.extractors.register(discord_player_youtubei_1.YoutubeiExtractor, {})
    .catch((error) => console.log(error));
//# sourceMappingURL=player.js.map