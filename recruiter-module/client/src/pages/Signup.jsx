import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', username:'', password:''});
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      setMsg('Account created. Redirecting to login...');
      setTimeout(()=>nav('/login'), 800);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <button onClick={()=>nav(-1)} className="text-sm text-gray-600 hover:text-gray-800">← Back</button>
        </div>
        <h1 className="text-2xl font-semibold mb-6">SIGN UP</h1>
        {msg && <div className="mb-2 text-sm text-green-600">{msg}</div>}
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-gray-700">Full name</label>
          <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full mb-3 p-3 border rounded" />

          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required className="w-full mb-3 p-3 border rounded" />

          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full mb-3 p-3 border rounded" />

          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required type="password" className="w-full mb-4 p-3 border rounded" />

          <button className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium">SIGN UP</button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>
        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-red-500">G</button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-blue-600">f</button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-blue-400">in</button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already a user? <a href="/login" className="font-medium text-pink-600">LOGIN</a>
        </div>
      </div>
    </div>
  );
}
