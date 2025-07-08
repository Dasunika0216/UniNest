import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/env.js';
import errorMiddleware from './middleware/error.middleware.js';

import authRouter from './routes/auth.routes.js';
import hostRouter from './routes/host.routes.js';
import boardingRouter from './routes/boarding.routes.js';
import connectToDatabase from './config/mongodb.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/hosts', hostRouter);
app.use('/api/v1/boardings', boardingRouter);


app.use(errorMiddleware);

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;

