console.log('Dashboard JS loaded');

const recentVisitsList = document.getElementById('recentVisitsList');
const recentLabResultsList = document.getElementById('recentLabResultsList');

const statusClassMap = {
  Scheduled: 'scheduled',
  'In Progress': 'progress',
  Completed: 'complete',
  Cancelled: 'observation',
  Normal: 'normal',
  Abnormal: 'abnormal',
  Critical: 'critical'
};

function renderListItems(items, container, formatter) {
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = '<li><strong>No data available</strong><span>Records will appear here once created.</span></li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = formatter(item);
    container.appendChild(li);
  });
}

async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard');
    const payload = await response.json();
    const data = payload.data || {};

    document.getElementById('patientCount').textContent = data.totalPatients || 0;
    document.getElementById('pendingAppointments').textContent = data.pendingAppointments || 0;
    document.getElementById('recentActivity').textContent = `${data.recentActivity || 0}%`;

    renderListItems(data.recentVisits || [], recentVisitsList, (visit) => `
      <strong>${visit.patientName}</strong>
      <span>${visit.type} - ${visit.appointmentTime}</span>
      <span class="status ${statusClassMap[visit.status] || 'scheduled'}">${visit.status}</span>
    `);

    renderListItems(data.recentLabResults || [], recentLabResultsList, (report) => `
      <strong>${report.title}</strong>
      <span>Patient: ${report.patientName}</span>
      <span class="status ${statusClassMap[report.status] || 'normal'}">${report.status}</span>
    `);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

loadDashboard();
