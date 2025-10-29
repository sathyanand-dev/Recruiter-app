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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      {/* Steps header */}
      <div className="mb-6">
        <div className="mb-3">
          <button onClick={()=>navigate(-1)} className="text-sm text-gray-600 hover:text-gray-800">← Back</button>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <h2 className="text-2xl font-semibold">Create New Job</h2>
          <div className="text-sm">Complete the following steps to create a new job posting.</div>
        </div>

  {/* hide verbose step labels on small screens to save space */}
  <div className="mt-4 hidden md:flex items-center gap-6">
          {['Job details','Eligibility & Screening','AI Interview Assistant','Review Job Details'].map((label, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${idx===0 ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'}`}>
                {idx+1}
              </div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>

  {/* Main 2-column area */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Job details form (updated to match provided design) */}
        <div className="p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Job Details</h3>

          {/* Job Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <div className="relative">
              <input value={job.title} onChange={e=>setJob({...job,title:e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none" placeholder="e.g. UX Designer" />
              <div className="absolute right-3 top-3 text-gray-400">🔍</div>
            </div>
            {errors.title && <div className="text-red-600 mt-1">{errors.title}</div>}
          </div>

          {/* Seniority pills */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Seniority Level *</label>
              <div className="text-xs text-gray-400">Select one or more options</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Fresher','Junior','Mid-Level','Senior','Lead'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={()=>setJob(prev=>({...prev, seniority: prev.seniority===s ? '' : s}))}
                  className={`px-3 py-1 rounded-md border ${job.seniority===s ? 'bg-purple-50 border-purple-400 text-purple-700' : 'bg-white text-gray-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category select with chip */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Category</label>
            <div className="flex items-center gap-2">
              <select value={job.category} onChange={e=>setJob({...job,category:e.target.value})} className="flex-1 p-2 border rounded bg-white">
                <option value="">Select a job category</option>
                <option>Design & Creative</option>
                <option>Engineering</option>
                <option>Product</option>
                <option>Software Development</option>
                <option>Software Engineering</option>               
                <option>Design & Research</option>
              </select>
              {job.category && (
                <div className="ml-2 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">{job.category} <button onClick={()=>setJob({...job,category:''})} className="text-gray-500">✕</button></div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">Max 3 Categories</div>
          </div>

          {/* Closing date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Closing Date *</label>
            <input type="date" value={job.closingDate} onChange={e=>setJob({...job,closingDate:e.target.value})} className="w-full p-2 border rounded bg-white" />
          </div>

          {/* Workplace type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Workplace Type *</label>
            <div className="flex gap-2">
              {['In Office','Hybrid','Remote'].map(m => (
                <button key={m} type="button" onClick={()=>setJob({...job,workMode:m})} className={`px-3 py-1 rounded-md border ${job.workMode===m ? 'bg-purple-50 border-purple-400 text-purple-700' : 'bg-white text-gray-700'}`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Location *</label>
            <select value={job.location} onChange={e=>setJob({...job,location:e.target.value})} className="w-full p-2 border rounded bg-white">
              <option value="">Select or search for a location</option>
              <option>Remote</option>
              <option>Bengaluru</option>
              <option>Mumbai</option>
            </select>
            <div className="text-xs text-gray-400 mt-1">Select from popular Indian cities or search for other locations (up to 7)</div>
          </div>

          {/* Job type pills */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Type *</label>
            <div className="flex gap-2">
              {['Full-Time','Part-Time','Contract','Internship'].map(t=> (
                <button key={t} type="button" onClick={()=>setJob({...job,jobType:t})} className={`px-3 py-1 rounded-md border ${job.jobType===t ? 'bg-purple-50 border-purple-400 text-purple-700' : 'bg-white text-gray-700'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Salary Details *</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 border rounded w-1/2 p-2 bg-white">
                <span className="text-gray-500">₹</span>
                <input value={job.salaryMin} onChange={e=>setJob({...job,salaryMin:e.target.value})} placeholder="Minimum salary" className="w-full border-0 outline-none" />
              </div>
              <div className="flex items-center gap-2 border rounded w-1/2 p-2 bg-white">
                <span className="text-gray-500">₹</span>
                <input value={job.salaryMax} onChange={e=>setJob({...job,salaryMax:e.target.value})} placeholder="Maximum salary" className="w-full border-0 outline-none" />
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Enter complete annual CTC details (e.g., 600000 to 800000)</div>
          </div>

          {/* Skills chips */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills *</label>
            <div className="mb-2">
              <select value="" onChange={e=>{
                const v = e.target.value; if(!v) return; setJob({...job,tags: Array.from(new Set([...job.tags, v]))}); e.target.value='';
              }} className="w-full p-2 border rounded bg-white">
                <option value="">Select or search for skills</option>
                <option>UI/UX Design</option>
                <option>Figma</option>
                <option>Adobe XD</option>
                <option>Wireframing</option>
                <option>Prototyping</option>
                <option>React.js</option>
                <option>JavaScript</option>
                <option>HTML5 & CSS3</option>
                <option>RESTful APIs</option>
                <option>Git / Version Control</option>
                <option>Node.js</option>
                <option>Express.js</option>
                <option>MongoDB</option>
                <option>RESTful API Development</option>
                <option>Authentication & Authorization (JWT)</option>
                <option>User Research</option>
                <option>Usability Testing</option>
                <option>Wireframing & Prototyping</option>
                <option>Figma</option>
                <option>Design Thinking</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((t,i)=>(
                <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">{t} <button onClick={()=>setJob({...job,tags: job.tags.filter(x=>x!==t)})} className="text-gray-500">✕</button></span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Description editor / preview */}
        <div className="p-4 bg-white rounded border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Job Description</h3>
            
          </div>

          <div className="mb-3">
            <ReactQuill theme="snow" value={job.description} onChange={val=>setJob({...job,description:val})} />
            {errors.description && <div className="text-red-600 mt-2">{errors.description}</div>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Add short instructions</label>
            <input className="w-full p-2 border rounded" placeholder="Want to make it engaging? Enter your instructions here" />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
        <span className="text-sm text-gray-600 order-first sm:order-none w-full sm:w-auto text-left">{saving ? 'Saving...' : (jobId ? 'Draft saved' : 'Not saved')}</span>
        {/* <button onClick={next} disabled={!isStepValid()} className="py-2 px-4 bg-indigo-600 text-white rounded">Save & Next</button> */}
        <button onClick={publish} disabled={saving} className="py-2 px-4 bg-green-600 text-white rounded w-full sm:w-auto">Publish</button>
      </div>
    </div>
  );
}
