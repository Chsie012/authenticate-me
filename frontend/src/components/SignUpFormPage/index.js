import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../store/session'; // Import the signup action

import './SignUpForm.css'; // Import the CSS file

const SignupFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors(['Password and Confirm Password must match.']);
      return;
    }

    const data = await dispatch(signup({ username, email, password }));

    if (data.errors) {
      setErrors(data.errors); // Set errors if signup fails
    } else {
      navigate('/'); // Redirect to homepage upon successful signup
    }
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx} className="error-message">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupFormPage;
