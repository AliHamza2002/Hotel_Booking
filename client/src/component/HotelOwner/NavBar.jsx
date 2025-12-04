import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext'

const NavBar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opacity-80' />
      </Link>

      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <img src={assets.userIcon} alt="user" className="h-5 invert" />
          <span className="text-sm text-gray-700">{user?.name}</span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
            <button
              onClick={() => { navigate('/'); setShowUserMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar