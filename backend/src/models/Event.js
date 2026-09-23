const mongoose = require('mongoose');

const RubricCriterionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0.05, max: 1.0 },
  scaleMin: { type: Number, default: 1 },
  scaleMax: { type: Number, default: 10 }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'judging', 'completed'], 
    default: 'active',
    index: true 
  },
  submissionDeadline: { 
    type: Date, 
    required: true 
  },
  tracks: [{ 
    type: String, 
    required: true 
  }],
  rubric: [RubricCriterionSchema]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Event', EventSchema);
