"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@hephaestus/utils");
const error = {
    name: 'error',
    handler: (error, id) => {
        utils_1.logger.error(`An error has occurred on shard: ${id}`);
        console.log(error);
    }
};
exports.default = error;
//# sourceMappingURL=error.js.map