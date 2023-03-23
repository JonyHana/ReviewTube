require("dotenv").config();

import express, { Request, Response, NextFunction } from 'express';
import session, { MemoryStore } from 'express-session';
import cors from 'cors';

import authMiddleware from './middleware/passport';
import reviewRoute from './routes/review';
import videoRoute from './routes/video';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  // Currently set to access the backend API domain (api.site.com) only from our frontend domain (site.com).
  origin: `${process.env.FRONTEND_URL}`,
  // True = To include cookies on cross-origin requests.
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

app.use('/video', videoRoute);
app.use('/review', reviewRoute);

app.get('/user-ctx', async (req: Request, res: Response) => {
  const user = req.user;
  res.json({
    displayName:  user?.displayName ?? null,
    id:           user?.id ?? null
  });
});

app.listen(3000);
