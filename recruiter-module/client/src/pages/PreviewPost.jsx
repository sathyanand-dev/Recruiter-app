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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="text-sm text-gray-600">{job.location} • {job.jobType} • {job.workMode}</div>
        </div>
        <div>
          <button className="py-1 px-3 bg-blue-600 text-white rounded mr-2" onClick={()=>nav(`/create/${id}`)}>Edit</button>
        </div>
      </div>

      <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: job.description }} />

      {job.tags?.length > 0 && (
        <div className="mt-4">
          {job.tags.map((t, i) => <span key={i} className="inline-block bg-gray-100 px-2 py-1 mr-2 rounded">{t}</span>)}
        </div>
      )}

      {job.screeningQuestions?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Screening questions</h3>
          <ul className="list-disc ml-6">
            {job.screeningQuestions.map((q,i)=>(<li key={i}>{q.question}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}
