document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('appointmentsTableBody');
  const searchInput = document.getElementById('appointmentSearch');
  const appointmentForm = document.getElementById('appointmentForm');
  const patientSelect = document.getElementById('patientId');
  const appointmentMessage = document.getElementById('appointmentMessage');

  const statusClassMap = {
    Scheduled: 'scheduled',
    'In Progress': 'progress',
    Completed: 'complete',
    Cancelled: 'observation'
  };

  async function loadPatients() {
    const response = await fetch('/api/patients?limit=100');
    const payload = await response.json();
    patientSelect.innerHTML = '<option value="">Select a patient</option>';

    (payload.data || []).forEach((patient) => {
      const option = document.createElement('option');
      option.value = patient.patientId;
      option.textContent = `${patient.fullName} (${patient.patientId})`;
      patientSelect.appendChild(option);
    });
  }

  function renderAppointments(appointments) {
    tableBody.innerHTML = '';

    if (!appointments.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">No appointments found.</td>
        </tr>
      `;
      return;
    }

    appointments.forEach((appointment) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.patientName}</td>
        <td>${new Date(appointment.appointmentDate).toLocaleDateString()}</td>
        <td>${appointment.appointmentTime}</td>
        <td>${appointment.doctorName}</td>
        <td><span class="status ${statusClassMap[appointment.status] || 'scheduled'}">${appointment.status}</span></td>
      `;
      tableBody.appendChild(row);
    });
  }

  async function loadSummary() {
    const response = await fetch('/api/appointments/summary');
    const payload = await response.json();
    const data = payload.data || {};

    document.getElementById('totalAppointments').textContent = data.totalAppointments || 0;
    document.getElementById('todaysAppointments').textContent = data.todaysAppointments || 0;
    document.getElementById('pendingAppointmentCount').textContent = data.pendingAppointments || 0;
  }

  async function loadAppointments(search = '') {
    const response = await fetch(`/api/appointments?limit=20&search=${encodeURIComponent(search)}`);
    const payload = await response.json();
    renderAppointments(payload.data || []);
  }

  searchInput.addEventListener('input', () => {
    loadAppointments(searchInput.value).catch((error) => console.error(error));
  });

  appointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      patientId: patientSelect.value,
      appointmentDate: document.getElementById('appointmentDate').value,
      appointmentTime: document.getElementById('appointmentTime').value,
      doctorName: document.getElementById('doctorName').value,
      department: document.getElementById('department').value
    };

    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    appointmentMessage.textContent = result.message || result.error || 'Unable to schedule appointment';
    appointmentMessage.style.color = response.ok ? '#2c8c5c' : '#d32f2f';

    if (response.ok) {
      appointmentForm.reset();
      await Promise.all([loadAppointments(), loadSummary()]);
    }
  });

  Promise.all([loadPatients(), loadAppointments(), loadSummary()]).catch((error) => {
    console.error('Failed to initialize appointments:', error);
  });
});
