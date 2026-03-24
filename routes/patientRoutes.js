const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Public
 * @returns {Object} { success: boolean, count: number, data: Array }
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, gender, search } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { patientId: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const patients = await Patient.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Patient.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: patients
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch patients' 
    });
  }
});

router.get('/count', async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      totalPatients
    });
  } catch (err) {
    console.error('Error fetching patient count:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patient count'
    });
  }
});

/**
 * @desc    Get single patient by ID
 * @route   GET /api/patients/:id
 * @access  Public
 * @returns {Object} { success: boolean, data: Object }
 */
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch patient' 
    });
  }
});

/**
 * @desc    Add a new patient
 * @route   POST /api/patients
 * @access  Public
 * @body {
 *   patientId: String (required, unique),
 *   fullName: String (required),
 *   age: Number (required, min=0, max=150),
 *   gender: String (required, enum: ['Male', 'Female', 'Non-binary', 'Other']),
 *   status: String (optional, enum: ['Stable', 'Under Observation', 'Critical', 'Discharged'])
 * }
 * @returns {Object} { success: boolean, data: Object }
 */
router.post('/', [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isAlphanumeric()
    .withMessage('Patient ID must be alphanumeric'),
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('age')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .isIn(['Male', 'Female', 'Non-binary', 'Other'])
    .withMessage('Invalid gender option'),
  body('status')
    .optional()
    .isIn(['Stable', 'Under Observation', 'Critical', 'Discharged'])
    .withMessage('Invalid status option')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const patient = await Patient.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (err) {
    console.error('Error creating patient:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Patient ID already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create patient' 
    });
  }
});

/**
 * @desc    Update patient
 * @route   PUT /api/patients/:id
 * @access  Public
 * @returns {Object} { success: boolean, data: Object }
 */
router.put('/:id', [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Non-binary', 'Other'])
    .withMessage('Invalid gender option'),
  body('status')
    .optional()
    .isIn(['Stable', 'Under Observation', 'Critical', 'Discharged'])
    .withMessage('Invalid status option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (err) {
    console.error('Error updating patient:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Patient ID already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update patient' 
    });
  }
});

/**
 * @desc    Delete patient
 * @route   DELETE /api/patients/:id
 * @access  Public
 * @returns {Object} { success: boolean, message: String }
 */
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ patientId: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete patient' 
    });
  }
});

module.exports = router;
