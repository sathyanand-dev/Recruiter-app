import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function PostSuccess(){
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{
    if (!id) return;
    API.get(`/jobs/${id}`).then(r=>setJob(r.data)).catch(e=>console.error(e));
  },[id]);

  const copyLink = () => {
    const url = window.location.origin + `/jobs/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard');
  };

  if (!job) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-8">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">Job Successfully Posted!</div>
        <p className="text-gray-600 mt-2">Your job has been published and is now visible to candidates.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={()=>nav('/jobs')} className="py-2 px-4 bg-purple-600 text-white rounded">Go to Dashboard</button>
          <button onClick={copyLink} className="py-2 px-4 border rounded">Copy Link</button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Share this Job</h3>
        <div className="flex gap-6 items-center">
          <button className="text-blue-400">Twitter</button>
          <button className="text-blue-700">LinkedIn</button>
          <button className="text-blue-500">Facebook</button>
          <button className="text-green-500">WhatsApp</button>
        </div>
        <div className="mt-4 p-3 border rounded bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-700">{window.location.origin + `/jobs/${id}`}</div>
          <button onClick={copyLink} className="py-1 px-3 border rounded">Copy</button>
        </div>
      </div>
    </div>
  );
}
