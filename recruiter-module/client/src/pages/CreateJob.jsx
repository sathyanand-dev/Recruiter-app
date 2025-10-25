import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const initialJob = {
  title: '',
  seniority: '',
  category: '',
  location: '',
  closingDate: '',
  salaryMin: '',
  salaryMax: '',
  jobType: '',
  workMode: '',
  isInternship: false,
  description: '',
  tags: [],
  screeningQuestions: []
};

export default function CreateJob({ onPublished }) {
  const [job, setJob] = useState(initialJob);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [jobId, setJobId] = useState(null);
  const savingRef = useRef(false);
  const pendingSavePromiseRef = useRef(null);
  const navigate = useNavigate();
  const autoSaveTimer = useRef(null);
  const [errors, setErrors] = useState({});

  // Load draft if editing (optional)
  useEffect(() => {
    // if editing via query param or state, fetch job
  }, []);
  // load when route has id param
  const params = useParams();
  useEffect(() => {
    const { id } = params || {};
    if (!id) return;
    // fetch job and populate form
    API.get(`/jobs/${id}`).then(res => {
      const j = res.data;
      // map server fields into local state shape
      setJob({
        title: j.title || '',
        seniority: j.seniority || '',
        category: j.category || '',
        location: j.location || '',
        closingDate: j.closingDate ? j.closingDate.split('T')[0] : '',
        salaryMin: j.salaryMin || '',
        salaryMax: j.salaryMax || '',
        jobType: j.jobType || '',
        workMode: j.workMode || '',
        isInternship: !!j.isInternship,
        description: j.description || '',
        tags: j.tags || [],
        screeningQuestions: j.screeningQuestions || []
      });
      setJobId(j._id);
    }).catch(err => {
      console.error('Failed to load job for edit', err);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* params */]);

  const saveDraft = async (currentJob = job) => {
    // prevent concurrent save requests causing duplicate creates
    if (savingRef.current) {
      // if there's an in-flight save, return the same promise so callers await it
      if (pendingSavePromiseRef.current) return pendingSavePromiseRef.current;
      return null;
    }

    savingRef.current = true;
    setSaving(true);

    const savePromise = (async () => {
      try {
        const payload = { ...currentJob };
        if (jobId) payload._id = jobId;
        const res = await API.post('/jobs/save', payload);
        if (res && res.data && res.data._id) {
          setJobId(res.data._id);
          return res.data._id;
        }
        return null;
      } catch (err) {
        console.error('save error', err);
        return null;
      } finally {
        savingRef.current = false;
        pendingSavePromiseRef.current = null;
        setSaving(false);
      }
    })();

    pendingSavePromiseRef.current = savePromise;
    return savePromise;
  };

  // autosave on changes with debounce
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(()=> saveDraft(), 800);
    return () => clearTimeout(autoSaveTimer.current);
  }, [job]);

  // Pure validation that returns whether the current step is valid (no side-effects)
  const isStepValid = (forStep = step) => {
    if (forStep === 0) {
      if (!job.title || job.title.trim().length < 3) return false;
      if (!job.location || job.location.trim().length < 2) return false;
      return true;
    }
    if (forStep === 1) {
      if (!job.description || job.description.trim().length < 10) return false;
      return true;
    }
    return true;
  };

  // Validation that sets error messages (side-effect) — call when user attempts to advance
  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!job.title || job.title.trim().length < 3) e.title = 'Title is required (min 3 chars)';
      if (!job.location || job.location.trim().length < 2) e.location = 'Location is required';
    }
    if (step === 1) {
      if (!job.description || job.description.trim().length < 10) e.description = 'Description is required (min 10 chars)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    // run validation with side-effects (show errors) when user tries to advance
    if (!validateStep()) return;
    // save then go next
    await saveDraft();
    setStep(s => s + 1);
  };

  const publish = async () => {
    // ensure full validation
    if (!job.title || !job.location || !job.description) return alert('Please fill required fields');
    const savedId = await saveDraft();
    const idToUse = savedId || jobId;
    if (!idToUse) return alert('No job id saved');
    await API.post(`/jobs/publish/${idToUse}`);
    // if parent provided a callback (inline create), call it. Otherwise navigate.
    if (typeof onPublished === 'function') {
      onPublished(idToUse);
    } else {
      navigate(`/post-success/${idToUse}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Create Job</h2>
      <div className="mb-4">
        <div className="flex gap-2">
          <button className={`px-3 py-1 ${step===0 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} onClick={()=>setStep(0)}>Details</button>
          <button className={`px-3 py-1 ${step===1 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} onClick={()=>setStep(1)}>Description</button>
          <button className={`px-3 py-1 ${step===2 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} onClick={()=>setStep(2)}>Screening</button>
        </div>
      </div>

      {step === 0 && (
        <div>
          <label className="block font-medium">Job Title*</label>
          <input value={job.title} onChange={e=>setJob({...job,title:e.target.value})} className="w-full p-2 border rounded mb-2"/>
          {errors.title && <div className="text-red-600 mb-2">{errors.title}</div>}

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block font-medium">Seniority</label>
              <select value={job.seniority} onChange={e=>setJob({...job,seniority:e.target.value})} className="w-full p-2 border rounded">
                <option value="">Select level</option>
                <option>Fresher</option>
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Category</label>
              <input value={job.category} onChange={e=>setJob({...job,category:e.target.value})} placeholder="e.g. Design" className="w-full p-2 border rounded" />
            </div>
          </div>

          <label className="block font-medium">Location*</label>
          <input value={job.location} onChange={e=>setJob({...job,location:e.target.value})} className="w-full p-2 border rounded mb-2"/>
          {errors.location && <div className="text-red-600 mb-2">{errors.location}</div>}
          <div className="grid grid-cols-2 gap-3">
            <select value={job.jobType} onChange={e=>setJob({...job,jobType:e.target.value})} className="p-2 border rounded">
              <option value="">Select job type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>

            <select value={job.workMode} onChange={e=>setJob({...job,workMode:e.target.value})} className="p-2 border rounded">
              <option value="">Work mode</option>
              <option>Onsite</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={job.isInternship} onChange={e=>setJob({...job,isInternship:e.target.checked})} />
              Internship
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block font-medium">Closing date</label>
              <input type="date" value={job.closingDate} onChange={e=>setJob({...job,closingDate:e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Salary min</label>
              <input value={job.salaryMin} onChange={e=>setJob({...job,salaryMin:e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Salary max</label>
              <input value={job.salaryMax} onChange={e=>setJob({...job,salaryMax:e.target.value})} className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <label>Job description*</label>
          <ReactQuill theme="snow" value={job.description} onChange={val=>setJob({...job,description:val})}/>
          {errors.description && <div className="text-red-600 mt-2">{errors.description}</div>}
        </div>
      )}

      {step === 2 && (
        <div>
          <label>Tags (comma separated)</label>
          <input value={job.tags.join(',')} onChange={e=>setJob({...job,tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} className="w-full p-2 border rounded mb-2"/>
          <label>Screening questions</label>
          {job.screeningQuestions.map((q, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={q.question} onChange={e=> {
                const sq = [...job.screeningQuestions]; sq[i].question = e.target.value; setJob({...job,screeningQuestions: sq});
              }} className="flex-1 p-2 border rounded" />
              <button onClick={()=> {
                setJob({...job,screeningQuestions: job.screeningQuestions.filter((_,idx)=>idx!==i)});
              }}>Remove</button>
            </div>
          ))}
          <button onClick={()=>setJob({...job,screeningQuestions:[...job.screeningQuestions,{question:'',type:'text'}]})} className="mt-2 py-1 px-2 bg-gray-200 rounded">Add question</button>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div>
          {step>0 && <button onClick={()=>setStep(s=>s-1)} className="py-1 px-3 bg-gray-200 rounded mr-2">Back</button>}
          {step < 2 && <button disabled={!isStepValid()} onClick={next} className="py-1 px-3 bg-blue-600 text-white rounded">Continue</button>}
        </div>
        <div>
          <span className="text-sm mr-4">{saving ? 'Saving...' : (jobId ? 'Draft saved' : 'Not saved')}</span>
          <button onClick={publish} disabled={saving} className="py-1 px-3 bg-green-600 text-white rounded disabled:opacity-60">Publish</button>
        </div>
      </div>
    </div>
  );
}
