import { z } from 'zod';

export const RESTCreateReviewSchema = z.object({
  ytVideoId: z.string().length(11),
  reviewBody: z.string().min(1)
});
export type T_RESTCreateReview = z.infer<typeof RESTCreateReviewSchema>;

export const RESTUpdateReviewSchema = z.object({
  reviewId: z.number(),
  reviewBody: z.string().min(1)
});
export type T_RESTUpdateReview = z.infer<typeof RESTUpdateReviewSchema>;
