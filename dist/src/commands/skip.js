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
const skip = {
    type: 1,
    name: 'skip',
    description: 'Skip the current track.',
    action: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const queue = (0, discord_player_1.useQueue)(interaction.guildID || '');
        if (!queue)
            return interaction.createMessage({
                content: `Nothing is in the queue to be skipped.`,
                flags: 64,
            });
        queue.node.skip();
        interaction.createMessage({
            content: `<@${(_a = interaction.member) === null || _a === void 0 ? void 0 : _a.id}> okay! Skipping track...`,
            flags: 64,
        });
    })
};
exports.default = skip;
//# sourceMappingURL=skip.js.map