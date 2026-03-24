const mongoose = require('mongoose');

/**
 * Patient Schema for EHR System
 * Defines the structure and validation rules for patient records
 */
const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Patient ID must be at least 3 characters'],
    maxlength: [20, 'Patient ID cannot exceed 20 characters'],
    match: [/^[A-Za-z0-9]+$/, 'Patient ID must contain only letters and numbers'],
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be a whole number'
    }
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Non-binary', 'Other'],
      message: 'Gender must be one of: Male, Female, Non-binary, Other'
    },
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['Stable', 'Under Observation', 'Critical', 'Discharged'],
      message: 'Status must be one of: Stable, Under Observation, Critical, Discharged'
    },
    default: 'Stable',
    index: true
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    }
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
    }
  },
  medicalHistory: [{
    condition: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Condition name cannot exceed 100 characters']
    },
    diagnosedDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    },
    phone: {
      type: String,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
PatientSchema.index({ status: 1, createdAt: -1 });
PatientSchema.index({ gender: 1, age: 1 });

// Virtual for formatted age display
PatientSchema.virtual('ageDisplay').get(function() {
  return `${this.age} years old`;
});

// Virtual for patient summary
PatientSchema.virtual('summary').get(function() {
  return `${this.fullName} (${this.age}, ${this.gender}) - ${this.status}`;
});

// Pre-save middleware to ensure data consistency
PatientSchema.pre('save', function(next) {
  // Convert patientId to uppercase for consistency
  if (this.patientId) {
    this.patientId = this.patientId.toUpperCase();
  }
  
  // Auto-update status based on age (just an example business rule)
  if (this.age > 80 && this.status === 'Stable') {
    this.status = 'Under Observation';
  }
  
  next();
});

// Static method to find patients by status
PatientSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get patient statistics
PatientSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgAge: { $avg: '$age' }
      }
    }
  ]);
};

// Instance method to get patient age in months
PatientSchema.methods.getAgeInMonths = function() {
  return this.age * 12;
};

// Instance method to check if patient is minor
PatientSchema.methods.isMinor = function() {
  return this.age < 18;
};

module.exports = mongoose.model('Patient', PatientSchema);
