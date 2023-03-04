import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import LoginLink from '../components/LoginLink';
import { T_Review, T_UserInfo_Prop } from '../types';

const ReviewPage = ({ user }: T_UserInfo_Prop) => {
  const { id } = useParams();
  const location = useLocation();

  const [reviews, setReviews] = useState<T_Review[]>(
    location.state?.reviews as T_Review[] || null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // This is if user accessed review page directly (didn't search from home page).
  useEffect(() => {
    if (!reviews) {
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
  }, []);
  
  return (
    <>
      {!errorMsg ? (
          <>
            <iframe
              width="1903"
              height="800"
              src={"https://www.youtube.com/embed/" + id}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen />
            <div className='p-8'>
              {reviews && reviews.length > 0 ? (
                reviews.map((review, i) => {
                  return (
                    <div key={i} className='p-4 bg-gray-700'>
                      <h4>{review.user.displayName}</h4>
                      <p>{review.body}</p>
                    </div>
                  )
                })
              ) : (
                <>
                  <h4>No reviews found. Be the first one to post! {!user ? <LoginLink /> : null}</h4>
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
