import { MouseEvent } from 'react';

const LogoutButton = () => {
  const onFormSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    window.location.href = '/';

    await fetch(
      `${import.meta.env.VITE_API_URL}/logout`,
      { method: 'POST', credentials: 'include' }
    );
  }

  return (
    <form className='inline-block' onSubmit={onFormSubmit}>
      <button className="p-2 rounded bg-neutral-600 hover:bg-neutral-500 cursor-default">
        Sign Out
      </button>
    </form>
  )
}

export default LogoutButton