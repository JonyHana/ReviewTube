import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [inputVideoLink, setInputVideoLink] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // A hacky method used for the text roll-in transition everytime the error message element re-renders.
  //  Source: https://stackoverflow.com/questions/63186710/how-to-trigger-a-css-animation-on-every-time-a-react-component-re-renders
  //  A new key must be set for the element that displays the message so that the CSS animation resets (due to component re-rendering).
  const [errorMsgSeedKey, setErrorMsgKeySeed] = useState<number>(Math.random());

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user-ctx/`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data.email) {
        console.log('User authed', data);
      }
      else {
        console.log('User not authenticated');
      }
    });
  }, []);
  
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputVideoLink(e.target.value);
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Parses the video ID from the YouTube video URL.
    //  Source: https://stackoverflow.com/a/3452617
    let videoId = inputVideoLink.split('v=')[1];
    var ampersandPosition = videoId.indexOf('&');
    if(ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/video/${videoId}`,
      { method: 'GET' }
    );
    let data = await res.json();

    console.log(data);
    
    if (!data.error) {
      navigate('/video/' + videoId, { state: { reviews: data } });
    }
    else {
      setErrorMsg('Error: ' + data.error);
      setErrorMsgKeySeed(Math.random());
    }
  }
  
  return (
    <div className="p-8">
      <h1 className="font-bold mb-4">Welcome to ReviewTube</h1>
      <form className="w-full max-w-sm" onSubmit={handleFormSubmit}>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            value={inputVideoLink}
            onChange={handleInputChange}
            placeholder="Enter YouTube Video URL Here"
            aria-label="YouTube Video URL"
            required
          />
          <input
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type='submit'
            value='Submit'
          />
        </div>
      </form>
      {errorMsg &&
        <div key={errorMsgSeedKey}>
          <h4 className="roll-out mt-2 font-semibold text-orange-500">
            {errorMsg}
          </h4>
        </div>
      }
    </div>
  )
}

export default HomePage