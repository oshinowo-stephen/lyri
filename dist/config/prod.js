"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docker_secret_env_1 = require("docker-secret-env");
(0, docker_secret_env_1.load)();
exports.default = Object.assign({}, process.env);
//# sourceMappingURL=prod.js.map