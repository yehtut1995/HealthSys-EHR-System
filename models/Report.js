const mongoose = require('mongoose');

const ReportMetricSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Lab Result', 'Radiology', 'Clinical Note', 'Discharge Summary']
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true,
    enum: ['Normal', 'Abnormal', 'Critical', 'Pending']
  },
  reportDate: {
    type: Date,
    required: true,
    index: true
  },
  summary: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  metrics: {
    type: [ReportMetricSchema],
    default: []
  }
}, {
  timestamps: true
});

ReportSchema.index({ status: 1, reportDate: -1 });

module.exports = mongoose.model('Report', ReportSchema);
