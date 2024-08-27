import express from 'express'
import dotenv from 'dotenv'
const cors = require("cors");
const http = require('http');
import { Server } from 'socket.io';


import { connectDatabase } from './config/database/connection'

import authRouter from './presentation/routes/authRoutes'
import mediaRouter from './presentation/routes/mediaRoutes'
import adminRouter from './presentation/routes/AdminRoute'
import { setupSocketIO } from './presentation/socket/SocketIO';
import scheduleCronJobs from './infrastructure/cron/cronScheduler';
import { initializeFirebaseAdmin } from './config/firebase/firebaseAdmin';

dotenv.config()
const port = 5000;
const app = express();
scheduleCronJobs()
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
connectDatabase();
setupSocketIO(server)
initializeFirebaseAdmin()

app.get('/', (req, res) => {
    res.send("Hello World");
}); 

app.use('/', authRouter);
app.use('/', mediaRouter);
app.use('/', adminRouter);


// Start the server using 'server.listen' instead of 'app.listen'
server.listen(port, () => {
    console.log(`Server started successfully on http://localhost:${port}`);
});





