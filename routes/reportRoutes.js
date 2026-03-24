const express = require('express');
const Report = require('../models/Report');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/analytics', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const visitsTrend = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: start }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$appointmentDate' },
          visits: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const departmentBreakdown = await Appointment.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1, _id: 1 } }
    ]);

    const statusDistribution = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const latestReports = await Report.find().sort({ reportDate: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        visitsTrend,
        departmentBreakdown,
        statusDistribution,
        latestReports
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load report analytics' });
  }
});

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ reportDate: -1 }).limit(20);
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load reports' });
  }
});

module.exports = router;
