import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import * as sessionActions from '../../store/session'; // Assuming session actions are in src/store/session
import './LoginForm.css';

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  // Redux state to check if the user is logged in
  const user = useSelector(state => state.session.user);

  // Redirect if user is already logged in
  if (user) {
    navigate('/'); // Replace history.push('/') with navigate('/')
  }

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(sessionActions.login({ credential, password }));

    if (data.errors) {
      setErrors(data.errors);  // Set errors if login fails
    } else {
      // Redirect to home page upon successful login
      navigate('/'); // Replace history.push('/') with navigate('/')
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="credential">Username or Email</label>
          <input
            type="text"
            id="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
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
          />
        </div>

        {errors.length > 0 && (
          <div className="errors">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginFormPage;
