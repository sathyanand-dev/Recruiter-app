import React, { useEffect, useState } from 'react';
import API from '../api/api';
import JobCard from '../components/JobCard';
import CreateJob from './CreateJob';
import ErrorBoundary from '../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

export default function JobList(){
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  // showCreate removed: Create flow now opens on a separate page (/create)
  const nav = useNavigate();

  const fetchJobs = async () => {
    const res = await API.get('/jobs', { params: { q } });
    setJobs(res.data);
  };

  useEffect(()=>{ fetchJobs(); }, []);

  // Called after CreateJob publishes (when using separate page)
  const handlePublished = (jobId) => {
    fetchJobs();
    nav(`/post-success/${jobId}`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl mb-3 sm:mb-0">Your jobs</h2>
        <div className="w-full sm:w-auto">
          <button onClick={()=>nav('/create')} className="py-2 px-3 bg-green-600 text-white rounded w-full sm:w-auto">Create job</button>
        </div>
      </div>


      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start">
        <input placeholder="Search by title" value={q} onChange={e=>setQ(e.target.value)} className="p-2 border rounded w-full sm:max-w-md" />
        <button onClick={fetchJobs} className="py-2 px-3 bg-blue-600 text-white rounded w-full sm:w-auto">Search</button>
      </div>

      <div className="grid gap-3">
        {jobs.map(j => <JobCard key={j._id} job={j} />)}
      </div>
    </div>
  );
}
