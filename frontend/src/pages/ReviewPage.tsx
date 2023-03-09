import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import LoginLink from '../components/LoginLink';
import ReviewEditor from '../components/ReviewEditor';

import { T_Review, T_UserInfo_Prop } from '../types';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ReviewPage = ({ user }: T_UserInfo_Prop) => {
  const { id } = useParams();
  const location = useLocation();

  const [reviews, setReviews] = useState<T_Review[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockEditor, setLockEditor] = useState<boolean>(false);

  // This is if user accessed review page directly (didn't search from home page).
  useEffect(() => {
    if (location.state?.reviews) {
      //console.log('came from home page');
      setReviews(location.state?.reviews);
      // Clears location.state on page refresh without triggering a re-render.
      //  This is necessary otherwise user won't fetch new reviews on page refresh.
      window.history.replaceState({}, document.title);
    }
    else {
      //console.log('user either entered link directly or refreshed page');
      refreshReviews();
    }
  }, []);

  const refreshReviews = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/video/${id}`,
      { method: 'GET' }
    )
    .then((res) => { return res.json(); })
    .then((data) => {
      if (!data.error) { setReviews(data); }
      else { setErrorMsg(data.error); }
    });
  }

  const uploadReview = async (reviewBody: string) => {
    if (reviewBody.length < 0) return;
    
    // Note: Haven't tested this out yet.
    //setLockEditor(true);
    
    fetch(
      `${import.meta.env.VITE_API_URL}/review/`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ytVideoId: id as string,
          reviewBody
        })
      }
    )
    .then((res) => { return res.json() })
    .then((data) => {
      //console.log(data);
    })
    .finally(() => {
      //setLockEditor(false);
      refreshReviews();
    });
  }
  
  return (
    <>
      {!errorMsg ? (
          <>
            <iframe
              className='w-full h-[800px]'
              src={"https://www.youtube.com/embed/" + id}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen />
            <div className='p-8'>
              {user &&
                (lockEditor
                  ? <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
                  : <ReviewEditor uploadCallback={uploadReview} />
                )
              }

              {reviews && reviews.length > 0 ? (
                <div className='flex flex-col-reverse'>
                  {reviews.map((review, i) => {
                    return (
                      <div key={i} className='m-4 p-4 bg-gray-700'>
                        <h4>{review.user.displayName}</h4>
                        <ReactMarkdown children={review.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <>
                  <h4>No reviews found. Be the first one to post! {!user && <LoginLink />}</h4>
                </>
              )}
            </div>
          </>
        ) : (
          <div className='p-4'>
            <h4 className='text-orange-500 font-semibold'>Error: {errorMsg}</h4>
            <h4>Click <Link className='text-blue-400' to='/'>here</Link> to head back to home page</h4>
          </div>
        )
      }
    </>
  )
}

export default ReviewPage;
