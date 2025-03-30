"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@hephaestus/utils");
const path_1 = require("path");
const modules_1 = require("./modules");
require("./modules");
modules_1.lyri.commands.forge((0, path_1.join)(__dirname, 'commands'));
modules_1.lyri.events.forge((0, path_1.join)(__dirname, 'events'));
modules_1.lyri.connect()
    .then(() => utils_1.logger.info('Lyri is connecting to the discord API'))
    .catch(console.error);
//# sourceMappingURL=index.js.map