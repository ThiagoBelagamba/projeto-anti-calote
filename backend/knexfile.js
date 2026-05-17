"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
dotenv_1.default.config();
const config = {
    development: {
        client: "postgresql",
        connection: process.env.DATABASE_URL ||
            "postgresql://postgres:postgres_senha_local@localhost:5432/anti_calote_db",
        migrations: {
            directory: "./src/infrastructure/database/migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./src/infrastructure/database/seeds",
            extension: "ts",
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map