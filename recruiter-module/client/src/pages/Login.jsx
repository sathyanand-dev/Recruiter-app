import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
  const { data } = await API.post('/auth/login', { identifier, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  // Redirect to jobs (posts) page after login
  nav('/jobs');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <button onClick={()=>nav(-1)} className="text-sm text-gray-600 hover:text-gray-800">← Back</button>
        </div>
        <h1 className="text-2xl font-semibold mb-6">LOGIN</h1>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="Email or username" className="w-full mb-4 p-3 border rounded" required />

          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full mb-4 p-3 border rounded" required />

          <div className="flex items-center mb-4">
            <input id="remember" type="checkbox" className="mr-2" />
            <label htmlFor="remember" className="text-sm">Remember me?</label>
          </div>

          <button className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium">LOGIN</button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>

        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-red-500">G</button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-blue-600">f</button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-blue-400">in</button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Need an account? <a href="/signup" className="font-medium text-pink-600">SIGN UP</a>
        </div>
      </div>
    </div>
  );
}
