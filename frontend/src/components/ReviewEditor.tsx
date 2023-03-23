import { useState, FormEvent, ChangeEvent, MouseEvent } from 'react'
import { T_ReviewEditor_Prop } from '../types';
import LoadingSpinner from './LoadingSpinner';

const ReviewEditor = ({ lockEditor, review, index, uploadCallback, uploadEditCallback, cancelEditCallback }: T_ReviewEditor_Prop) => {
  const [reviewDraft, setReviewDraft] = useState<string>(review ? review.body : '');
  
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploadEditCallback) {
      const newReview = { ...review, body: reviewDraft };
      uploadEditCallback(newReview, index);
    }
    else if (uploadCallback) {
      uploadCallback(reviewDraft);
    }

    setReviewDraft('');
  }

  const handleDraftOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewDraft(e.target.value);
  }

  const handleDraftCancel = (e: MouseEvent<HTMLButtonElement>) => {
    if (cancelEditCallback) {
      cancelEditCallback(index);
    }
  }

  const renderForm = () => {
    return (
      <form className='p-4' onSubmit={handleFormSubmit}>      
        <textarea
          id="message"
          className="block p-2.5 w-full text-sm border bg-neutral-700 border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Write your review here"
          value={reviewDraft}
          onChange={handleDraftOnChange}
        />
        <div className='mt-4'>
          <input
            className="bg-green-700 hover:bg-green-800 border-green-700 hover:border-green-800 text-sm border-4 text-white py-1 px-2 rounded"
            type='submit'
            value='Submit'
          />

          {/* This will only show for the editor on the top. */}
          {!review &&
            <span className='ml-2'>Not sure how to post with Markdown styling? <a className='text-green-400' href='https://commonmark.org/help/' target="_blank">Click here.</a></span>
          }

          {review &&
            <button className='ml-2 bg-red-700 hover:bg-red-800 border-red-700 hover:border-red-800 text-sm border-4 text-white py-1 px-2 rounded cursor-default' onClick={handleDraftCancel}>Cancel</button>
          }
        </div>
      </form>
    );
  }

  return (
    <>
      {lockEditor !== null
        ? (
          ((!index && lockEditor === -1) || (index !== null && lockEditor === index))
            ? <LoadingSpinner /> : renderForm()
        )
        : renderForm()
      }
    </>
  )
}

export default ReviewEditor