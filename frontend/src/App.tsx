import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
import { T_UserInfo } from './types';

function App() {
  const [userInfo, setUserInfo] = useState<T_UserInfo | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user-ctx/`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data.displayName) {
        console.log('User authed', data);
        setUserInfo(data);
      }
      else {
        console.log('User not authenticated');
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage user={userInfo} />} />
        <Route path='/video/:id' element={<ReviewPage user={userInfo} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
