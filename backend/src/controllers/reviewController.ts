import { prisma } from '../utils/db';

type T_DBCreateReview = {
  userEmail: string;
  ytVideoId: string;
  body: string;
}

type T_DBUpdateReview = {
  userEmail: string;
  reviewId: number;
  body: string;
}

export async function getReviews(ytVideoId: string) {
  const reviews = await prisma.review.findMany({
    where: { ytVideoId },
    select: { body: true }
  });

  return reviews;
}

export async function createReview(data: T_DBCreateReview) {
  const review = await prisma.review.create({
    data: {
      ytVideoId: data.ytVideoId,
      body: data.body,
      user: { connect: { email: data.userEmail } },
    },
  });

  return review;
}

export async function updateReview(data: T_DBUpdateReview) {
  const post = await prisma.review.update({
    where: { id: data.reviewId },
    data: { body: data.body },
  });

  return post;
}
