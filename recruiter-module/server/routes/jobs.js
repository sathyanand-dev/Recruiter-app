const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Create or update draft (save on step change)
router.post('/save', auth, async (req, res) => {
  try {
    const data = req.body;
    // if there's id -> update, else create
    if (data._id) {
      // try to update an existing job owned by this user; do NOT upsert here
      const job = await Job.findOneAndUpdate(
        { _id: data._id, owner: req.user._id },
        data,
        { new: true }
      );
      if (!job) return res.status(404).json({ msg: 'Not found' });
      return res.json(job);
    } else {
      // create a new draft owned by the authenticated user
      const job = new Job({ ...data, owner: req.user._id });
      await job.save();
      return res.json(job);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Publish job
router.post('/publish/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, owner: req.user._id });
    if (!job) return res.status(404).json({ msg: 'Not found' });
    job.status = 'published';
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// List jobs for owner (with optional search)
router.get('/', auth, async (req, res) => {
  const { q } = req.query;
  const filter = { owner: req.user._id };
  if (q) filter.title = { $regex: q, $options: 'i' };
  const jobs = await Job.find(filter).sort({ updatedAt: -1 });
  res.json(jobs);
});

// Get single job detail
router.get('/:id', auth, async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, owner: req.user._id });
  if (!job) return res.status(404).json({ msg: 'Not found' });
  res.json(job);
});

// Delete job (optional)
router.delete('/:id', auth, async (req, res) => {
  await Job.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  res.json({ msg: 'Deleted' });
});

module.exports = router;
