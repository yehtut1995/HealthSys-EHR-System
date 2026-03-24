const express = require('express');
const { body, validationResult } = require('express-validator');
const Setting = require('../models/Setting');

const router = express.Router();

const getSettingsDocument = async () => {
  let settings = await Setting.findOne().sort({ createdAt: 1 });
  if (!settings) {
    settings = await Setting.create({
      hospitalInfo: { name: 'General Hospital' },
      userProfile: { fullName: 'Dr. Alexander Smith' }
    });
  }
  return settings;
};

router.get('/', async (req, res) => {
  try {
    const settings = await getSettingsDocument();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load settings' });
  }
});

router.put('/', [
  body('hospitalInfo.name').optional().notEmpty().withMessage('Hospital name cannot be empty'),
  body('userProfile.fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('preferences.notifications').optional().isIn(['Enabled', 'Disabled']).withMessage('Invalid notification setting')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const settings = await getSettingsDocument();

    settings.hospitalInfo = { ...settings.hospitalInfo.toObject(), ...(req.body.hospitalInfo || {}) };
    settings.userProfile = { ...settings.userProfile.toObject(), ...(req.body.userProfile || {}) };
    settings.preferences = { ...settings.preferences.toObject(), ...(req.body.preferences || {}) };

    if (req.body.security && req.body.security.password) {
      settings.security.password = req.body.security.password;
      settings.security.lastPasswordChange = new Date();
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

module.exports = router;
