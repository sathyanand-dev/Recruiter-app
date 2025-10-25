import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job }){
  const nav = useNavigate();
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <div className="font-semibold">{job.title}</div>
        <div className="text-sm text-gray-600">{job.location} • {job.jobType || '—'}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-500 mr-4">{job.status}</div>
        <button onClick={()=>nav(`/jobs/${job._id}`)} className="py-1 px-3 bg-blue-600 text-white rounded">Open</button>
        <button onClick={()=>nav(`/preview/${job._id}`)} className="py-1 px-3 bg-gray-200 rounded">Preview</button>
      </div>
    </div>
  );
}
