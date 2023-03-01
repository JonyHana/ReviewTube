import express, { Request, Response, NextFunction } from 'express';

require("dotenv").config();

const router = express.Router();

const YT_API_KEY = process.env["YT_API_KEY"];

type CreateReviewReqBody = {
  ytVideoId: string;
  reviewBody: string;
};

type UpdateReviewReqBody = {
  reviewId: number;
  updatedReviewBody: string;
};

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  //res.redirect('/review_error');
  res.status(401).json({ msg: 'Unauthorized, not logged in.' });
}

// // When the user posts a review.
// router.post('/', isLoggedIn, async (req: Request, res: Response) => {
//   const { ytVideoId, reviewBody }: CreateReviewReqBody = req.body;
//   const userEmail = req.user?.email;

//   const review = await prisma.review.create({
//     data: {
//       ytVideoId,
//       body: reviewBody,
//       user: { connect: { email: userEmail } },
//     },
//   });

//   res.json(review);
// });

// // Side notes:
// //  https://stackoverflow.com/questions/396164/exposing-database-ids-security-risk 
// //  https://stackoverflow.com/questions/56576985/is-it-a-bad-practice-to-expose-the-database-id-to-the-client-in-your-rest-api
// // When the user edits one of their reviews.
// router.put('/:id', isLoggedIn, async (req: Request, res: Response) => {
//   const { reviewId, updatedReviewBody }: UpdateReviewReqBody = req.body;

//   const post = await prisma.review.update({
//     where: { id: reviewId },
//     data: { body: updatedReviewBody },
//   });

//   res.json(post);
// });
