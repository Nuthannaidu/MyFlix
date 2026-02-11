import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/authSlice';

import Home from './pages/Home/Home';
import Watch from './pages/Watch'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ErrorPage from "./pages/ErrorPage";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(checkAuth());
      setIsAuthChecked(true);
    };
    initAuth();
  }, [dispatch]);

  // Loading Screen Logic
  if (loading && !isAuthChecked) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center flex-col gap-4">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-r-purple-600/30 border-b-purple-600/10 border-l-purple-600/50"></div>
         <p className="text-purple-400 text-sm animate-pulse">Connecting to server...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;