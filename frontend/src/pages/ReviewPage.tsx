import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import LoginButton from '../components/LoginButton';
import ReviewEditor from '../components/ReviewEditor';

import { T_Review, T_UploadReview_FuncParams, T_UserInfo_Prop } from '../types';

import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';

const ReviewPage = ({ user }: T_UserInfo_Prop) => {
  const { id } = useParams();
  const location = useLocation();

  const [reviews, setReviews] = useState<T_Review[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //const [lockEditors, setLockEditors] = useState<boolean>(false);
  // -1 for the editor that creates reviews.
  // >= 0 for the editors of each existing reviews, with # being the index of the currently edited review editor.
  // null for no locked editors.
  const [lockEditors, setLockEditors] = useState<number | null>(null);

  // This only counts towards editors of existing review, not the top editor for creating reviews.
  const [editorReservedTo, setEditorReservedTo] = useState<number | null>(null);

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
  
  const refreshReviews = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/video/${id}`,
      { method: 'GET' }
    );
    
    const data = await res.json();
    
    if (!data.error) {
      const revs: T_Review[] = [];

      data.forEach((v: T_Review, i: number) => {
        revs.push({ ...v, isEditing: false });
      });

      setReviews(revs);
      setEditorReservedTo(null);
    }
    else {
      setErrorMsg(data.error);
    };
  }

  const uploadReviewInternal = async (
    method: 'POST' | 'PUT',
    review: T_UploadReview_FuncParams
  ) => {
    setLockEditors(method === 'POST' ? -1 : review.renderIndex as number);

    const sendBody: any = {
      reviewBody: review.body
    };

    if (method === 'PUT') {
      sendBody.reviewId = review.id;
    }
    else {
      sendBody.ytVideoId = id;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/review/`, {
        method: method,
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sendBody)
      }
    );
    
    //const data = await res.json();
    //console.log(data);

    setLockEditors(null);
    refreshReviews();
  }

  const uploadReview = (reviewBody: string) => {
    //console.log('uploadReview -> ', review);

    uploadReviewInternal('POST', {
      body: reviewBody
    });
  }

  const uploadEditedReview = (review: T_Review, index: number) => {
    //console.log('uploadEditedReview -> ', review);
    
    uploadReviewInternal('PUT', {
      body: review.body,
      id: review.id,
      renderIndex: index
    });
  }

  const cancelReviewEditing = (index: number) => {
    //console.log('cancelReviewEditing -> ', index);

    changeReviewToEditing(index, false);
  }

  const changeReviewToEditing = (index: number, isEditing: boolean) => {
    //console.log('changeReviewToEditing -> ', index);
    if (isEditing && editorReservedTo && index !== editorReservedTo) return;
    
    const revs = [ ...reviews as T_Review[] ];
    revs[index].isEditing = isEditing;
    setReviews(revs);

    setEditorReservedTo(isEditing ? index : null);
  }
  
  const renderReview = (index: number, review: T_Review) => {
    //console.log('renderReview -> ', review, user);

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
            <button className='block p-0.5 px-2 mb-2 bg-gray-600 hover:bg-gray-500 cursor-default' onClick={() => changeReviewToEditing(index, true)}>Edit</button>
          }
          <p>📄 {new Date(review.createdOn).toUTCString()}</p>
          {review.editedOn &&
            <p>✏️ {new Date(review.editedOn).toUTCString()}</p>
          }

          <img className='inline-block mt-2 mr-3' src={review.user.avatarURL} width={40} />
          <h4 className='inline-block font-semibold'>{review.user.displayName}</h4>
          <ReactMarkdown className="mt-3 prose prose-invert prose-hr:m-0 prose-hr:invert" children={review.body}></ReactMarkdown>
        </div>
      )
    }
  }
  
  return (
    <>
      <Navbar />
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
