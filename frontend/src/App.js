import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSessionUser } from './store/session';
import SignUpFormPage from './components/SignUpFormPage';
import Navigation from './components/Navigation';

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    // Restore the session user when the component mounts
    dispatch(restoreSessionUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation />

      <main className="app-content">
        <Routes>
          <Route
            path="/signup"
            element={sessionUser ? <Navigate to="/" /> : <SignUpFormPage />}
          />
          <Route
            path="/"
            element={sessionUser ? (
              <h2>Welcome, {sessionUser.username}!</h2>
            ) : (
              // Show home page content for non-logged in users instead of redirecting
              <h2>Welcome to the application! Please log in or sign up.</h2>
            )}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
