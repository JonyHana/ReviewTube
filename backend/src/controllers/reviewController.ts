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

// export async function countReviews(ytVideoId: string) {
//   return await prisma.review.count({
//     where: { ytVideoId }
//   });
// }

export async function getReviews(ytVideoId: string) {
  return await prisma.review.findMany({
    where: { ytVideoId },
    select: {
      body: true,
      id: true,
      userId: true,
      user: {
        select: {
          displayName: true,
          avatarURL: true
        }
      },
      createdOn: true,
      editedOn: true
    }
  });
}

export async function createReview(data: T_DBCreateReview) {
  return await prisma.review.create({
    data: {
      ytVideoId: data.ytVideoId,
      body: data.body,
      user: { connect: { email: data.userEmail } },
    },
    select: {
      body: true,
      user: {
        select: {
          displayName: true,
          avatarURL: true
        }
      },
      createdOn: true,
      editedOn: true
    }
  });
}

export async function updateReview(data: T_DBUpdateReview) {
  return await prisma.review.update({
    where: { id: data.reviewId },
    data: {
      body: data.body,
      editedOn: new Date().toISOString()
    },
  });
}
