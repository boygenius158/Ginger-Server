import express from 'express'
import dotenv from 'dotenv'
const cors = require("cors");
const http = require('http');
import { Server } from 'socket.io';


import { connectDatabase } from './config/database/connection'

import authRouter from './presentation/routes/UserRoute'
import mediaRouter from './presentation/routes/PostRoute'
import adminRouter from './presentation/routes/AdminRoute'
import datingRouter from './presentation/routes/DatingRoute'
import { setupSocketIO } from './presentation/socket/SocketIO';
import scheduleCronJobs from './infrastructure/cron/cronScheduler';

import s3service from './application/Services/S3service'
import logger from './utils/logger';


dotenv.config()
const port = 5000;
const app = express();
// scheduleCronJobs()
app.use(express.json());

app.use(cors({
    // origin:['*'],
    origin: 'http://localhost:3000',

    // origin: 'https://gingerfrontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all common HTTP methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Allow Authorization and Content-Type headers
    credentials: true // If you want to support credentials (cookies, etc.)
}));

const server = http.createServer(app);
connectDatabase();
setupSocketIO(server)

app.get('/', (req, res) => {
    res.send('backend is running on aws .....')
})

app.use('/', authRouter);
app.use('/', mediaRouter);
app.use('/', adminRouter);
app.use('/', datingRouter);
app.use('/', s3service)


// Start the server using 'server.listen' instead of 'app.listen'
server.listen(port, () => {
    console.log(`Server started successfully on http://localhost:${port}`);
});





