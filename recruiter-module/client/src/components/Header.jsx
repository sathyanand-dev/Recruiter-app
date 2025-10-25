import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(){
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); nav('/login'); };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold mr-4">Recruiter Module</Link>
        </div>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-gray-600">{user?.name || user?.username}</span>
              <button onClick={logout} className="py-1 px-3 bg-red-500 text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/signup" className="text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
