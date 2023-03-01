import { prisma } from '../utils/db';

export default async function getVideoReviews(ytVideoId: string) {
  const reviews = await prisma.review.findMany({
    where: { ytVideoId }
  });

  return reviews;
}
