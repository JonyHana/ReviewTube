import { MouseEvent, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import LoginButton from '../components/LoginButton';
import ReviewEditor from '../components/ReviewEditor';

import { T_Review, T_UserInfo_Prop } from '../types';

import ReactMarkdown from 'react-markdown';

const ReviewPage = ({ user }: T_UserInfo_Prop) => {
  const { id } = useParams();
  const location = useLocation();

  const [reviews, setReviews] = useState<T_Review[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockEditors, setLockEditors] = useState<boolean>(false);

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
      if (!data.error) {
        const revs: T_Review[] = [];
        data.forEach((v: T_Review, i: number) => {
          revs.push({ ...v, isEditing: false });
        });
        setReviews(revs);
      }
      else {
        setErrorMsg(data.error);
      }
    });
  }

  const uploadReview = async (reviewBody: string) => {
    if (reviewBody.length < 0) return;
    
    setLockEditors(true);
    
    fetch(
      `${import.meta.env.VITE_API_URL}/review/`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ytVideoId: id,
          reviewBody
        })
      }
    )
    .then((res) => { return res.json() })
    .then((data) => {
      //console.log(data);
    })
    .finally(() => {
      setLockEditors(false);
      refreshReviews();
    });
  }
  
  const uploadEditedReview = (review: T_Review, index: number) => {
    console.log('editReview -> ', review);

    setLockEditors(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/review/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ytVideoId: id,
          reviewBody: review.body,
          reviewId: review.id
        })
      }
    )
    .then((res) => { return res.json() })
    .then((data) => {
      //console.log(data);
    })
    .finally(() => {
      setLockEditors(false);
      refreshReviews();
    });
  }

  // DEBUGGING // I want LoadSpinner to appear only once at a time.
  // const uploadReview = async (reviewBody: string) => {
  // }
  // const uploadEditedReview = (review: T_Review, index: number) => {
  // }

  const cancelReviewEditing = (index: number) => {
    console.log('cancelReviewEditing -> ', index);

    changeReviewToEditing(index, false);
  }

  const changeReviewToEditing = (index: number, isEditing: boolean) => {
    console.log('changeReviewToEditing -> ', index);
    
    const revs = [ ...reviews as T_Review[] ];
    revs[index].isEditing = isEditing;
    setReviews(revs);
  }
  
  const renderReview = (index: number, review: T_Review) => {
    console.log('renderReview -> ', review.userId, user?.id, review.userId === user?.id);

    if (review.isEditing) {
      return (
        <div key={index} className='m-4 p-4 bg-gray-700'>
          <ReviewEditor
            lockEditor={lockEditors}
            review={review}
            index={index}
            uploadEditCallback={uploadEditedReview}
            cancelEditCallback={cancelReviewEditing}
          />
        </div>
      )
    }
    else {
      return (
        <div key={index} className='m-4 p-4 bg-gray-700'>
          {review.userId === user?.id &&
            <button onClick={() => changeReviewToEditing(index, true)}>Edit</button>
          }
          <img className='inline-block mr-3' src={review.user.avatarURL} width={40} />
          <h4 className='inline-block font-semibold'>{review.user.displayName}</h4>
          
          <ReactMarkdown className="prose prose-invert" children={review.body}></ReactMarkdown>
        </div>
      )
    }
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
              {user && <ReviewEditor lockEditor={lockEditors} uploadCallback={uploadReview} />}

              {/* Not sure of a better way of doing this. Ternary in JSX is hell..*/}
              {!user
                ? (<>
                    <h4 className='inline-block mr-2'>Log in to start posting!</h4>
                    <LoginButton />
                  </>)
                : (!reviews || reviews.length === 0 && (
                    <>
                      <h4 className='inline-block mr-2'>No reviews found. Be the first one to post!</h4>
                      {!user && <LoginButton />}
                    </>
                  )
                )
              }

              {reviews && reviews.length > 0 && (
                <div className='flex flex-col-reverse'>
                  {reviews.map((review, i) => {
                    return renderReview(i, review);
                  })}
                </div>
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
