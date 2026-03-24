document.addEventListener('DOMContentLoaded', () => {
  const message = document.getElementById('settingsMessage');

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#d32f2f' : '#2c8c5c';
  }

  async function updateSettings(payload) {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    showMessage(result.message || result.error || 'Settings updated', !response.ok);

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update settings');
    }
  }

  async function loadSettings() {
    const response = await fetch('/api/settings');
    const payload = await response.json();
    const data = payload.data || {};

    document.getElementById('hospitalName').value = data.hospitalInfo?.name || '';
    document.getElementById('hospitalAddress').value = data.hospitalInfo?.address || '';
    document.getElementById('hospitalEmail').value = data.hospitalInfo?.email || '';
    document.getElementById('hospitalPhone').value = data.hospitalInfo?.phone || '';

    document.getElementById('profileFullName').value = data.userProfile?.fullName || '';
    document.getElementById('profileSpecialization').value = data.userProfile?.specialization || '';
    document.getElementById('profileEmail').value = data.userProfile?.email || '';
    document.getElementById('profilePhone').value = data.userProfile?.phone || '';

    document.getElementById('preferenceLanguage').value = data.preferences?.language || 'English';
    document.getElementById('preferenceTimezone').value = data.preferences?.timezone || 'UTC +7';
    document.getElementById('preferenceNotifications').value = data.preferences?.notifications || 'Enabled';
  }

  document.getElementById('hospitalInfoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await updateSettings({
      hospitalInfo: {
        name: document.getElementById('hospitalName').value,
        address: document.getElementById('hospitalAddress').value,
        email: document.getElementById('hospitalEmail').value,
        phone: document.getElementById('hospitalPhone').value
      }
    });
  });

  document.getElementById('userProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await updateSettings({
      userProfile: {
        fullName: document.getElementById('profileFullName').value,
        specialization: document.getElementById('profileSpecialization').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value
      }
    });
  });

  document.getElementById('preferencesForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await updateSettings({
      preferences: {
        language: document.getElementById('preferenceLanguage').value,
        timezone: document.getElementById('preferenceTimezone').value,
        notifications: document.getElementById('preferenceNotifications').value
      }
    });
  });

  document.getElementById('passwordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword || newPassword !== confirmPassword) {
      showMessage('New password and confirmation must match.', true);
      return;
    }

    const response = await fetch('/api/settings');
    const payload = await response.json();
    const settings = payload.data || {};

    if (currentPassword !== settings.security?.password) {
      showMessage('Current password is incorrect.', true);
      return;
    }

    await updateSettings({
      security: {
        password: newPassword
      }
    });

    event.target.reset();
  });

  loadSettings().catch((error) => {
    console.error('Failed to load settings:', error);
    showMessage('Failed to load settings.', true);
  });
});
