"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require("cors");
const connection_1 = require("./config/database/connection");
const authRoutes_1 = __importDefault(require("./presentation/routes/authRoutes"));
dotenv_1.default.config();
const port = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send("hello world");
});
app.use('/', authRoutes_1.default);
(0, connection_1.connectDatabase)();
app.listen(port, () => {
    console.log(`server started started successfully on port :${port}`);
});
