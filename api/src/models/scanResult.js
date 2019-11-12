const mongoose = require('mongoose');

const { Schema } = mongoose;

const findingSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  ruleId: {
    type: String,
    required: true,
  },
  location: { // If required we can also define schema of location
    type: Object,
    required: true,
  },
  metadata: { // If required we can also define schema of metadata
    type: Object,
    required: true,
  },
});


// Depending on amount of data  we might need to seprate findings to separate collection.
const scanResultSchema = new Schema({
  status: {
    type: String,
    default: 'queued',
    enum: ['queued', 'in-progress', 'success', 'failed'],
  },
  repositoryName: {
    type: String,
    required: true,
  },
  findings: [findingSchema],
  scanningAt: {
    type: Date,
  },
  finishedAt: {
    type: Date,
  },
  queuedAt: {
    type: Date,
  },
});


const ScanResult = mongoose.model('ScanResult', scanResultSchema, 'scanResults');

module.exports = ScanResult;
