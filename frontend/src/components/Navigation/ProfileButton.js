// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const openMenu = () => {
    setShowMenu(prev => !prev); // Toggle the menu state
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      // Only close if clicking outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <button onClick={openMenu} className="profile-button">
        <i className="fas fa-user-circle" />
      </button>

      {showMenu && (
        <ul className="profile-dropdown">
          <li className="profile-dropdown-item">{user.username}</li>
          <li className="profile-dropdown-item">{user.email}</li>
          <li className="profile-dropdown-item">
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
