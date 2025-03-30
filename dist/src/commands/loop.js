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
const loop = {
    type: 1,
    name: 'loop',
    description: 'Loop the current track or queue.',
    options: [
        {
            type: 3,
            name: 'mode',
            description: 'Turn loop off, loop track or queue',
            required: true
        }
    ],
    action: (interaction, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mode = ((_a = args['mode']) === null || _a === void 0 ? void 0 : _a.value) || 'off';
        const queue = (0, discord_player_1.useQueue)(interaction.guildID || '');
        if (!queue)
            return interaction.createMessage({
                content: 'There is nothing in queue',
                flags: 64,
            });
        let message = `No such mode...`;
        switch (mode) {
            case 'off':
            case 'stop':
                queue.setRepeatMode(discord_player_1.QueueRepeatMode.OFF);
                message = 'Looping off!';
                break;
            case 'song':
            case 'track':
                queue.setRepeatMode(discord_player_1.QueueRepeatMode.TRACK);
                message = 'Looping track!';
                break;
            case 'queue':
            case 'playlist':
                queue.setRepeatMode(discord_player_1.QueueRepeatMode.QUEUE);
                message = 'Looping queue!';
                break;
        }
        interaction.createMessage({
            content: message,
            flags: 64
        });
    })
};
exports.default = loop;
//# sourceMappingURL=loop.js.map