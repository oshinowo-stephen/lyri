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
const purge = {
    type: 1,
    name: 'purge',
    description: 'Purge the queue, and remove all current tracks!',
    action: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const queue = (0, discord_player_1.useQueue)(interaction.guildID || '');
        if (!queue)
            return interaction.createMessage({
                content: 'There is no queue',
                flags: 64,
            });
        if (queue.repeatMode !== discord_player_1.QueueRepeatMode.OFF) {
            queue.setRepeatMode(discord_player_1.QueueRepeatMode.OFF);
        }
        queue.clear();
        interaction.createMessage({
            content: `Successfully purged the queue! Now skipping current song...`,
            flags: 64,
        });
    })
};
exports.default = purge;
//# sourceMappingURL=purge.js.map