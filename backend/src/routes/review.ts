import express, { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { createReview, updateReview } from '../controllers/reviewController';

import {
  RESTCreateReviewSchema,
  T_RESTCreateReview,
  RESTUpdateReviewSchema,
  T_RESTUpdateReview
} from '../types/reviewTypes';

const router = express.Router();

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'Unauthorized, not logged in.' });
}

// Authorization middleware, specifically for the routes below, 
//  to execute before user hits one of said route endpoints.
router.use(isLoggedIn);

// When the user posts a review.
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { ytVideoId, reviewBody }: T_RESTCreateReview = req.body;
  const userEmail = (req.user as Express.User).email;
  
  try {
    RESTCreateReviewSchema.parse({ ytVideoId, reviewBody });
    
    await createReview({
      userEmail,
      ytVideoId,
      body: reviewBody
    });
    
    res.status(200).json([]);
  }
  catch (err: any) {
    if (err instanceof ZodError) {
      console.log('[ZodError] POST review/ -> err.message =', err.message);
    }
    res.status(400);
    next(err);
  }
});

// When the user edits one of their reviews.
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  const { reviewId, reviewBody }: T_RESTUpdateReview = req.body;
  const userEmail = (req.user as Express.User).email;

  try {
    RESTUpdateReviewSchema.parse({ reviewId, reviewBody });

    await updateReview({
      userEmail,
      reviewId,
      body: reviewBody
    });
    
    res.status(200).json([]);
  }
  catch (err: any) {
    if (err instanceof ZodError) {
      console.log('[ZodError] PUT review/ -> err.message =', err.message);
    }
    res.status(400);
    next(err);
  }
});

export default router;
