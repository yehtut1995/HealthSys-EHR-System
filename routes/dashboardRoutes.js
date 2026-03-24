const express = require('express');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [totalPatients, pendingAppointments, recentVisits, recentLabResults] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } }),
      Appointment.find()
        .sort({ appointmentDate: 1, appointmentTime: 1 })
        .limit(5)
        .select('patientName type appointmentTime status'),
      Report.find()
        .sort({ reportDate: -1 })
        .limit(5)
        .select('title patientName status')
    ]);

    res.json({
      success: true,
      data: {
        totalPatients,
        pendingAppointments,
        recentActivity: Math.min(100, 70 + (pendingAppointments * 3)),
        recentVisits,
        recentLabResults
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
