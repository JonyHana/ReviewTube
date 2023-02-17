import { ChangeEvent, FormEvent, useState } from "react";

function App() {
  const [inputVideoLink, setInputVideoLink] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVideoLink(e.target.value);
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  }

  return (
    <div className="p-8">
      <h1 className="font-bold mb-4">Hello world!</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className="text-black"
          placeholder='YouTube video link here'
          value={inputVideoLink}
          onChange={handleInputChange}
          required
        ></input>
        <input type='submit'></input>
      </form>
    </div>
  )
}

export default App
