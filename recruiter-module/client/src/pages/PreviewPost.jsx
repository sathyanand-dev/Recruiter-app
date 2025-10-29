import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function PreviewPost(){
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{
    if (!id) return;
    API.get(`/jobs/${id}`).then(r=>setJob(r.data)).catch(e=>console.error(e));
  },[id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow sm:p-6">
        <div className="mb-3">
          <button onClick={()=>nav(-1)} className="text-sm text-gray-600 hover:text-gray-800">← Back</button>
        </div>
        <div className="text-sm text-gray-500 mb-3">My Jobs / Job Details</div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span className="text-gray-400">🏷️</span>{job.location}</div>
            <div className="flex items-center gap-2"><span className="text-gray-400">📁</span>{job.jobType}</div>
            <div className="flex items-center gap-2"><span className="text-gray-400">💼</span>{job.workMode}</div>
            <div className="px-3 py-1 bg-gray-100 rounded text-xs">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="py-1 px-3 bg-blue-600 text-white rounded mr-2" onClick={()=>nav(`/create/${id}`)}>Edit</button>
          <button
            className="py-1 px-3 bg-red-600 text-white rounded"
            onClick={async () => {
              if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
              try {
                await API.delete(`/jobs/${id}`);
                nav('/jobs');
              } catch (err) {
                console.error('Delete failed', err);
                alert('Failed to delete job. Please try again.');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* <div className="bg-gray-50 p-5 rounded">
          <h3 className="font-semibold text-gray-700 mb-3">Company Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="text-xs text-gray-400">Company</div>
              <div>NA</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Posted</div>
              <div>{new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Industry</div>
              <div>Technology, Information and Media</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Company Size</div>
              <div>1 to 10</div>
            </div>
          </div>
        </div> */}

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Job Description</h3>
          <div className="border rounded p-4 max-h-72 overflow-auto bg-white">
            <div className="prose" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Requirements</h3>
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-2">Skills</div>
            <div className="flex flex-wrap gap-2">
              {job.tags?.map((t,i)=>(<span key={i} className="inline-block bg-gray-100 px-3 py-1 rounded text-sm">{t}</span>))}
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}
