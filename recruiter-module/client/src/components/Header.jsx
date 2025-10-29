import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(){
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); nav('/login'); };

  useEffect(()=>{
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return ()=> document.removeEventListener('click', onDoc);
  }, []);

  const firstLetter = (user?.name || user?.username || 'U')[0]?.toUpperCase();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold mr-4 flex items-center gap-2">
            <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded">Recuter Module</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={ref}>
              <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-3 focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">{firstLetter}</div>
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border rounded shadow-lg z-50">
                  <div className="p-3 border-b">
                    <div className="font-medium">{user?.name || user?.username}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <div className="p-2">
                    <button onClick={()=>{ setOpen(false); nav('/profile'); }} className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">View profile</button>
                    <button onClick={logout} className="w-full text-left px-2 py-2 rounded text-red-600 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              )}
            </div>
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
