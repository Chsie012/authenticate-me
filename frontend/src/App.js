import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginFormPage from './components/LoginFormPage';
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
            path="/login"
            element={sessionUser ? <Navigate to="/" /> : <LoginFormPage />}
          />
          <Route
            path="/signup"
            element={sessionUser ? <Navigate to="/" /> : <SignUpFormPage />}
          />
          <Route
            path="/"
            element={sessionUser ? (
              <h2>Welcome, {sessionUser.username}!</h2>
            ) : (
              <Navigate to="/login" />
            )}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
