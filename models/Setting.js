const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  hospitalInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  },
  userProfile: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  },
  preferences: {
    language: {
      type: String,
      trim: true,
      default: 'English'
    },
    timezone: {
      type: String,
      trim: true,
      default: 'UTC +7'
    },
    notifications: {
      type: String,
      enum: ['Enabled', 'Disabled'],
      default: 'Enabled'
    }
  },
  security: {
    password: {
      type: String,
      trim: true,
      default: 'admin123'
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', SettingsSchema);
