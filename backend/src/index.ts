require("dotenv").config();

import express, { Request, Response, NextFunction } from 'express';
import session, { MemoryStore } from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import cors from 'cors';

import authMiddleware from './middleware/passport';
import reviewRoute from './routes/review';
import videoRoute from './routes/video';
import { RedisClientType } from '@redis/client';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  // Currently set to access the backend API domain (api.site.com) only from our frontend domain (site.com).
  origin: `${process.env.FRONTEND_URL}`,
  // True = To include cookies on cross-origin requests.
  credentials: true
}));

let redisClient: RedisClientType | null = null;
if (process.env.NODE_ENV === 'production') {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient
    .connect()
    .catch((e) => {
      console.log('[Redis Error] -> ', e);
      redisClient?.disconnect();
      redisClient = null;
    })
    .finally(() => {
      if (redisClient === null) {
        throw new Error('Error occured while connecting to Redis. Exiting..');
      }
      else {
        console.log('Connected to Redis @ ', process.env.REDIS_URL);
      }
    });
}

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false, // Don't save session if unmodified.
  saveUninitialized: false, // Don't create session until something stored.
  store: (
    !redisClient
    ? new MemoryStore()
    : new RedisStore({ client: redisClient, prefix: "myapp:" })
  ),
  rolling: true, // Force the resetting of session identifier cookie. Expiration countdown set to original maxAge.
  cookie: {
    maxAge: 604800000, // 1 week; unit: ms
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  }
}));

app.use(authMiddleware);

app.use('/video', videoRoute);
app.use('/review', reviewRoute);

app.get('/user-ctx', async (req: Request, res: Response) => {
  const user = req.user;
  res.json({
    displayName:  user?.displayName ?? null,
    id:           user?.id ?? null
  });
});

app.listen(Number(PORT), () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
