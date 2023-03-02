import express, { Request, Response } from 'express';
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

// When either a user or visitor searches a review page by YT video id.
// This will gather the reviews (if there's any) for that review page.
//  If there are none, it will let the user know.
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check to see if YT video exists.
  //  If checking through the API and doesn't exist then (public) video doesn't exist.
  //  If it's in the DB but doesn't exist, then video may have been set to private or deleted.
  let apiFetch = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=status&id=${id}`;
  let fetchRes = await fetch(apiFetch);
  let fetchResData: T_YTInfoBody = await fetchRes.json();
  
  if (fetchResData.items.length === 0) {
    res.json({
      msg: 'Video does not exist.',
      statusCode: 0,
      errorCode: 0
    });
    return;
  }
  
  if (!fetchResData.items[0].status.embeddable) {
    res.json({
      msg: 'Video exists but cannot be embedded. Prohibited by the YouTube channel of the video.',
      statusCode: 0,
      errorCode: 1
    });
    // Note: Maybe load existing reviews but don't allow people to post reviews?
    return;
  }

  const reviews = await getReviews(id);
  
  if (reviews.length === 0) {
    res.json({ 
      msg: 'This video has no reviews. Be the first to post a review!',
      statusCode: 1
    });
  }
  else {
    res.json({ reviews });
  }
});

export default router;
