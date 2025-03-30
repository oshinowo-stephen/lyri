"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.lyri = void 0;
const eris_1 = require("@hephaestus/eris");
const config_1 = __importDefault(require("config"));
const erisOptions = {
    restMode: true,
    intents: [
        'guilds',
        'guildMembers',
        'guildMessages',
        'guildVoiceStates',
    ]
};
exports.lyri = new eris_1.Hephaestus(config_1.default.get('BOT_TOKEN'), erisOptions);
exports.client = exports.lyri.client;
//# sourceMappingURL=lyri.js.map