import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import session, { MemoryStore } from 'express-session';
import cors from 'cors';

import authMiddleware from './middleware/passport';

const client = new PrismaClient();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 'origin'      -> Currently set to access the backend API domain (api.site.com) only from our frontend domain (site.com).
// 'credentials' -> True = To include cookies on cross-origin requests.
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false, // Don't save session if unmodified.
  saveUninitialized: false, // Don't create session until something stored.
  store: new MemoryStore(), // REMINDER: MemoryStore is NOT production ready!
  //store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  rolling: true, // Force the resetting of session identifier cookie. Expiration countdown set to original maxAge.
  cookie: {
    maxAge: 604800000, // 1 week; unit: ms
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  }
}));

app.use(authMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'index page' });
});

app.listen(3000);
