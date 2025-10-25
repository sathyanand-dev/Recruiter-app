import React, { useEffect, useState } from 'react';
import API from '../api/api';
import JobCard from '../components/JobCard';
import CreateJob from './CreateJob';
import ErrorBoundary from '../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

export default function JobList(){
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const nav = useNavigate();

  const fetchJobs = async () => {
    const res = await API.get('/jobs', { params: { q } });
    setJobs(res.data);
  };

  useEffect(()=>{ fetchJobs(); }, []);

  // Called after inline CreateJob publishes
  const handlePublished = (jobId) => {
    // hide create form and refresh list, then navigate to success
    setShowCreate(false);
    fetchJobs();
    nav(`/post-success/${jobId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Your jobs</h2>
        <div>
          <button onClick={()=>setShowCreate(s=>!s)} className="py-1 px-3 bg-green-600 text-white rounded">{showCreate ? 'Close' : 'Create job'}</button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          {/* Wrap CreateJob in ErrorBoundary to avoid white screens when an editor or other runtime error occurs */}
          <ErrorBoundary>
            <CreateJob onPublished={handlePublished} />
          </ErrorBoundary>
        </div>
      )}

      <div className="mb-4">
        <input placeholder="Search by title" value={q} onChange={e=>setQ(e.target.value)} className="p-2 border rounded w-full max-w-md" />
        <button onClick={fetchJobs} className="ml-2 py-1 px-3 bg-blue-600 text-white rounded">Search</button>
      </div>

      <div className="grid gap-3">
        {jobs.map(j => <JobCard key={j._id} job={j} />)}
      </div>
    </div>
  );
}
