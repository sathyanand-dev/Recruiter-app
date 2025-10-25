const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String },
  jobType: { type: String }, // e.g., Full-time, Part-time
  workMode: { type: String }, // Remote, Onsite, Hybrid
  isInternship: { type: Boolean, default: false },
  description: { type: String }, // rich text stored as HTML or markdown
  tags: [String],
  screeningQuestions: [{ question: String, type: String }],
  status: { type: String, enum: ['draft','published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', JobSchema);
