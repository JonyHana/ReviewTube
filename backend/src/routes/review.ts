import express, { Request, Response, NextFunction } from 'express';
import { createReview, updateReview } from '../controllers/reviewController';

const router = express.Router();

type T_RESTCreateReview = {
  ytVideoId: string;
  reviewBody: string;
};

type T_RESTUpdateReview = {
  reviewId: number;
  updatedReviewBody: string;
};

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'Unauthorized, not logged in.' });
}

// Authorization middleware, specifically for the routes below, 
//  to execute before user hits one of said route endpoints.
router.use(isLoggedIn);

// When the user posts a review.
router.post('/', async (req: Request, res: Response) => {
  const { ytVideoId, reviewBody }: T_RESTCreateReview = req.body;
  const userEmail = (req.user as Express.User).email;
  
  const review = await createReview({
    userEmail,
    ytVideoId,
    body: reviewBody
  });

  res.json(review);
});

// When the user edits one of their reviews.
router.put('/', async (req: Request, res: Response) => {
  const { reviewId, updatedReviewBody }: T_RESTUpdateReview = req.body;
  const userEmail = (req.user as Express.User).email;
  
  const post = await updateReview({
    userEmail,
    reviewId,
    body: updatedReviewBody
  });

  res.json(post);
});

export default router;
