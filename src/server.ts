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


dotenv.config()
const port = 5000;
const app = express();
scheduleCronJobs()
app.use(express.json());

app.use(cors({
    origin: '*', // Adjust as necessary
    allowedHeaders: ['Authorization', 'Content-Type']
}));


const server = http.createServer(app);
connectDatabase();
setupSocketIO(server)

app.get('/hello', (req, res) => {
    res.send('hello world')
})
app.get('/', (req, res) => {
    res.send('hello ginger.com')
})

app.use('/', authRouter);
app.use('/', mediaRouter);
app.use('/', adminRouter);
app.use('/', datingRouter);


// Start the server using 'server.listen' instead of 'app.listen'
server.listen(port, () => {
    console.log(`Server started successfully on http://localhost:${port}`);
});





