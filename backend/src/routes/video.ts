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
  let { id } = req.params;

  // YouTube video IDs are 11 characters long.
  //  Though Google has not mentioned this being an indefinite standard,
  //  so this could end up changing in the future.
  id = id.substring(0, 11);

  // Note: Maybe load existing reviews but don't allow people to post reviews?
  //  If so, will need to check if video has reviews first, otherwise just execute code blocks below countReviews.
  // countReviews(id);
  // if (countReviews(id) < 0) {

  // Note: Accidentally hit YT V3 API too much.
  //  Currently have the following block of code commented off while I test out reviews functionality for now.
  //console.log('ping check', new Date().getTime().toString().substring(0, Math.floor(Math.random() * 12)));
  /*
  // Check to see if YT video exists.
  //  If checking through the API and doesn't exist then (public) video doesn't exist.
  //  If it's in the DB but doesn't exist, then video may have been set to private or deleted.
  let apiFetch = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=status&id=${id}`;
  let fetchRes = await fetch(apiFetch);
  let fetchResData: T_YTInfoBody = await fetchRes.json();
  
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
  */
  
  const reviews = await getReviews(id);
  res.json(reviews);
});

export default router;
