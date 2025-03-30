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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_player_1 = require("discord-player");
const format_duration_1 = __importDefault(require("format-duration"));
const modules_1 = require("../modules");
const nowPlaying = {
    type: 1,
    name: 'np',
    description: 'Display current track',
    action: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const queue = (0, discord_player_1.useQueue)(interaction.guildID || '');
        if (!queue)
            return interaction.createMessage({
                content: 'There is no queue',
                flags: 64,
            });
        const track = queue.currentTrack;
        if (!track)
            return interaction.createMessage({
                content: 'There is no songs in queue.',
                flags: 64,
            });
        const trackTimer = (_a = modules_1.state.trackTimers.get(track.id)) !== null && _a !== void 0 ? _a : 0;
        const requestedBy = modules_1.state.memberQueue.get(track.id);
        interaction.createMessage({
            embeds: [
                {
                    title: `Currently playing: ${track.title} by ${track.author} - Inserted by: ${requestedBy === null || requestedBy === void 0 ? void 0 : requestedBy.globalName}`,
                    thumbnail: {
                        url: requestedBy === null || requestedBy === void 0 ? void 0 : requestedBy.avatarURL
                    },
                    image: {
                        url: track.thumbnail
                    },
                    footer: {
                        text: `Song Progress: [${(0, format_duration_1.default)(Date.now() - trackTimer)}/${(0, format_duration_1.default)(track.durationMS)}]`,
                    }
                }
            ],
        });
    })
};
exports.default = nowPlaying;
//# sourceMappingURL=np.js.map