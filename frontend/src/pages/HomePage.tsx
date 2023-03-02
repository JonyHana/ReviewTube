import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [inputVideoLink, setInputVideoLink] = useState<string>('');

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
    
    if (data.statusCode !== 0) {
      navigate('/video/' + videoId, { state: { reviews: data } });
    }
    else {
      // TODO: Show popup of error msg.
    }
  }
  
  return (
    <div className="p-8">
      <h1 className="font-bold mb-4">Welcome to ReviewTube</h1>
      <form onSubmit={handleFormSubmit}>
        <input
        className="text-black"
        placeholder='Enter YouTube Video URL Here'
        value={inputVideoLink}
        onChange={handleInputChange}
        required
        ></input>
        <input type='submit' value="Submit"></input>
      </form>
    </div>
  )
}

export default HomePage