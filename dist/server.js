"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require("cors");
const http = require('http');
const connection_1 = require("./config/database/connection");
const UserRoute_1 = __importDefault(require("./presentation/routes/UserRoute"));
const PostRoute_1 = __importDefault(require("./presentation/routes/PostRoute"));
const AdminRoute_1 = __importDefault(require("./presentation/routes/AdminRoute"));
const DatingRoute_1 = __importDefault(require("./presentation/routes/DatingRoute"));
const SocketIO_1 = require("./presentation/socket/SocketIO");
// import scheduleCronJobs from './infrastructure/cron/cronScheduler';
const S3service_1 = __importDefault(require("./application/Services/S3service"));
const logger_1 = __importDefault(require("./utils/logger"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const port = 5000;
const app = (0, express_1.default)();
// scheduleCronJobs()
app.use(express_1.default.json());
app.use(cors({
    // origin:['*'],
    // origin: 'http://localhost:3000',
    origin: ['http://localhost:3000', 'https://gingerfrontend.vercel.app'],
    // origin: 'https://gingerfrontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all common HTTP methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Allow Authorization and Content-Type headers
    credentials: true // If you want to support credentials (cookies, etc.)
}));
const server = http.createServer(app);
(0, connection_1.connectDatabase)();
(0, SocketIO_1.setupSocketIO)(server);
logger_1.default;
app.get('/', (req, res) => {
    // console.log("hi");
    res.send('backend is running on awss .....');
});
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim()), // Use Winston's info level
    },
}));
app.use('/', UserRoute_1.default);
app.use('/', PostRoute_1.default);
app.use('/', AdminRoute_1.default);
app.use('/', DatingRoute_1.default);
app.use('/', S3service_1.default);
// Start the server using 'server.listen' instead of 'app.listen'
server.listen(port, () => {
    console.log(`Server started successfully on http://localhost:${port}`);
});
