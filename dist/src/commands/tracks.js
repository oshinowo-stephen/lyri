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
const discord_player_1 = require("discord-player");
const modules_1 = require("../modules");
const tracks = {
    type: 1,
    name: 'tracks',
    description: 'Display all current tracks in queue',
    action: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const queue = (0, discord_player_1.useQueue)(interaction.guildID || '');
        if (!queue)
            return interaction.createMessage({
                content: 'There is no queue.',
                flags: 64,
            });
        if (!queue.tracks)
            return interaction.createMessage({
                content: 'There\'s nothing in queue.',
                flags: 64,
            });
        const tracks = queue.tracks;
        const currentTrack = queue.currentTrack;
        if (!currentTrack) {
            console.log('No current track on now playing...');
            return interaction.createMessage({
                content: 'This shouldn\'t happen...',
                flags: 64,
            });
        }
        const memberQueue = modules_1.state.memberQueue;
        let displayMessage = `CURRENTLY PLAYING: ${currentTrack.title}, Requested by: ${(_a = memberQueue.get(currentTrack.id)) === null || _a === void 0 ? void 0 : _a.globalName}\n`;
        let upcomingTracks = tracks
            .map((track) => {
            var _a;
            return `> ${track.title}, Requested by: ${(_a = memberQueue.get(track.id)) === null || _a === void 0 ? void 0 : _a.globalName}`;
        })
            .slice(0, 6)
            .join('\n');
        tracks.size > 0
            ? displayMessage += `\nUPCOMING TRACKS:\n${upcomingTracks}`
            : undefined;
        interaction.createMessage({
            content: displayMessage !== null && displayMessage !== void 0 ? displayMessage : 'N/A',
            flags: 64,
        });
    })
};
exports.default = tracks;
//# sourceMappingURL=tracks.js.map