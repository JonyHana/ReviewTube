import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();

const client = new PrismaClient();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({msg: 'index page'});
});

app.listen(3000);
