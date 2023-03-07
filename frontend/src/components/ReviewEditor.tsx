import { useState, FormEvent, ChangeEvent } from 'react'
import { T_ReviewEditor_Prop } from '../types';

const ReviewEditor = ({ uploadCallback }: T_ReviewEditor_Prop) => {
  const [reviewDraft, setReviewDraft] = useState<string>('');
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uploadCallback(reviewDraft);
  }

  const handleDraftOnChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewDraft(e.target.value);
  }

  return (
    <form className='p-4' onSubmit={handleFormSubmit}>      
      <textarea
        id="message"
        className="block p-2.5 w-full resize-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."
        value={reviewDraft}
        onChange={handleDraftOnChange}
      />
      <input
        className="flex-shrink-0 bg-green-700 hover:bg-green-800 border-green-700 hover:border-green-800 text-sm border-4 text-white py-1 px-2 rounded"
        type='submit'
        value='Submit'
      />
    </form>
  )
}

export default ReviewEditor