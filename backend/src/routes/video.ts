import express, { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { getReviews } from '../controllers/reviewController';

const router = express.Router();

const YT_API_KEY = process.env["YT_API_KEY"];

type T_YTInfoBody_Items = {
  kind: string;
  etag: string;
  id: string;
  status: {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
    madeForKids: boolean;
  }
}

type T_YTInfoBody = {
  kind: string;
  etag: string;
  items: T_YTInfoBody_Items[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

// YouTube video IDs are 11 characters long.
//  Though Google has not mentioned this being an indefinite standard,
//  so this could end up changing in the future.
const RESTYouTubeIDValidateSchema = z.string().length(11);

// When either a user or visitor searches a review page by YT video id.
// This will gather the reviews (if there's any) for that review page.
//  If there are none, it will let the user know.
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  try {
    RESTYouTubeIDValidateSchema.parse(id);
    
    // Note: Added production check so I don't keep hitting the third-party API during development.
    if (process.env.NODE_ENV === 'production') {
      // Check to see if YT video exists.
      //  If checking through the API and doesn't exist then (public) video doesn't exist.
      //  If it's in the DB but doesn't exist, then video may have been set to private or deleted.
      const apiFetch = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=status&id=${id}`;
      const fetchRes = await fetch(apiFetch);
      const fetchResData: T_YTInfoBody = await fetchRes.json();

      // Strong chance we've hit the API limit for the day.
      if (!fetchResData.items) {
        return res.json({
          error: 'Error occured while trying to retrieve YouTube video.'
        });
      }

      if (fetchResData.items.length === 0) {
        return res.json({
          error: 'Video does not exist.',
        });
      }
      
      if (!fetchResData.items[0].status.embeddable) {
        return res.json({
          error: 'Video exists but cannot be embedded. Prohibited by the YouTube channel of the video.',
        });
      }
    }
    
    const reviews = await getReviews(id);
    res.json(reviews);
  }
  catch (err) {
    if (err instanceof ZodError) {
      //console.log('[ZodError] GET video/:id -> err.message =', err.message);
      return res.json({
        error: 'Invalid YouTube video ID.',
      });
    }
    res.status(400);
    next(err);
  }
});

export default router;
