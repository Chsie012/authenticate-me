// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>
            Home
          </NavLink>
        </li>

        {sessionUser ? (
          <li className="profile-item">
            <ProfileButton user={sessionUser} />
          </li>
        ) : (
          <>
            <li>
              <LoginFormModal />
            </li>
            <li>
              <NavLink to="/signup" className={({isActive}) => isActive ? "active" : ""}>
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
