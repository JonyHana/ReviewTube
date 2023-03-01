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
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVideoLink(e.target.value);
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST to server with URL (check if valid, check if YT, check if exists or not in DB, etc.)
    // https://bobbyhadz.com/blog/react-redirect-after-form-submit
    navigate('/video/' + inputVideoLink);
    /*try {
      let urlObj = new URL(inputVideoLink);
      console.log(urlObj);
      //let params = urlObj.search;
      //console.log(params.substring(3, params.length - 1));
      //navigate('/video/' + inputVideoLink);
    }
    catch (e) {
      //throw e;
    }*/
  }
  
  return (
    <div className="p-8">
      <h1 className="font-bold mb-4">Hello world!</h1>
      <form onSubmit={handleFormSubmit}>
        <input
        className="text-black"
        placeholder='YouTube video ID here'
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