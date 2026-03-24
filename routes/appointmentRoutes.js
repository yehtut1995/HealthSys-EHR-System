const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const router = express.Router();

const statusValues = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Radiology'];

router.get('/summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, todaysAppointments, pendingAppointments] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } })
    ]);

    res.json({
      success: true,
      data: {
        totalAppointments,
        todaysAppointments,
        pendingAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load appointment summary' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search = '', status, limit = 10 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(parseInt(limit, 10));

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load appointments' });
  }
});

router.post('/', [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('doctorName').notEmpty().withMessage('Doctor name is required'),
  body('department').isIn(departments).withMessage('Valid department is required'),
  body('status').optional().isIn(statusValues).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const patient = await Patient.findOne({ patientId: req.body.patientId.toUpperCase() });
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found for appointment' });
    }

    const totalAppointments = await Appointment.countDocuments();
    const appointment = await Appointment.create({
      appointmentId: `APT${1001 + totalAppointments}`,
      patient: patient._id,
      patientId: patient.patientId,
      patientName: patient.fullName,
      doctorName: req.body.doctorName,
      department: req.body.department,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      type: req.body.type || 'Follow-up',
      status: req.body.status || 'Scheduled',
      notes: req.body.notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to schedule appointment' });
  }
});

module.exports = router;
