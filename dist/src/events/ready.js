"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@hephaestus/utils");
const ready = {
    name: 'ready',
    handler: () => {
        utils_1.logger.info('Lyri is now connected to the discord\'s API');
    }
};
exports.default = ready;
//# sourceMappingURL=ready.js.map