import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginFormPage from './components/LoginFormPage';
import { restoreSessionUser, logout } from './store/session'; // Import the restore session user thunk
import SignUpFormPage from './components/SignUpFormPage';


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    // Restore the session user when the component mounts
    dispatch(restoreSessionUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="App">
      <h1>My Redux App</h1>
      {sessionUser ? (
        <div>
          <p>Welcome, {sessionUser.username}!</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
      <Routes>
        {/* Redirect to home if the user is logged in, else show login form */}
        <Route
          path="/login"
          element={sessionUser ? <Navigate to="/" /> : <LoginFormPage />}
        />
        <Route
          path="/signup"
          element={sessionUser ? <Navigate to="/" /> : <SignUpFormPage />}
        />
        {/* If the user is logged in, show a welcome message */}
        <Route
          path="/"
          element={sessionUser ? (
            <h2>Welcome, {sessionUser.username}!</h2>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </div>
  );
}

export default App;
