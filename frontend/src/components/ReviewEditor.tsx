import { useState, FormEvent, ChangeEvent, MouseEvent } from 'react'
import { T_ReviewEditor_Prop } from '../types';
import LoadingSpinner from './LoadingSpinner';

const ReviewEditor = ({ lockEditor, review, index, uploadCallback, uploadEditCallback, cancelEditCallback }: T_ReviewEditor_Prop) => {
  const [reviewDraft, setReviewDraft] = useState<string>(review ? review.body : '');
  
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploadEditCallback) {
      const newReview = { ...review, body: reviewDraft };
      uploadEditCallback(newReview);
    }
    else if (uploadCallback) {
      uploadCallback(reviewDraft);
    }
  }

  const handleDraftOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewDraft(e.target.value);
  }

  const handleDraftCancel = (e: MouseEvent<HTMLButtonElement>) => {
    if (cancelEditCallback) {
      cancelEditCallback(index);
    }
  }

  return (
    <>
      {lockEditor === true
        ? (
          <LoadingSpinner />
        )
        : (
          <form className='p-4' onSubmit={handleFormSubmit}>      
            <textarea
              id="message"
              className="block p-2.5 w-full resize-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your review here"
              value={reviewDraft}
              onChange={handleDraftOnChange}
            />
            <input
              className="flex-shrink-0 bg-green-700 hover:bg-green-800 border-green-700 hover:border-green-800 text-sm border-4 text-white py-1 px-2 rounded"
              type='submit'
              value='Submit'
            />

            {/* This will only show for the editor on the top. */}
            {!review &&
              <span className='ml-2'>Not sure how to post with Markdown styling? <a className='text-green-400' href='https://commonmark.org/help/' target="_blank">Click here.</a></span>
            }

            {review &&
              <button onClick={handleDraftCancel}>Cancel</button>
            }
          </form>
        )
      }
    </>
  )
}

export default ReviewEditor