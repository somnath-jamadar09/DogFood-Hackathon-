const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, 
    lowercase: true,
    index: true 
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password hash is required'], 
    select: false 
  },
  fullName: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    enum: ['visitor', 'participant', 'judge', 'organizer', 'admin'], 
    default: 'participant',
    index: true 
  },
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    default: null 
  },
  judgeTracks: [{ 
    type: String 
  }],
  conflictsOfInterest: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);
