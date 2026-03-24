const latestReportsList = document.getElementById('latestReportsList');
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function loadReportsAnalytics() {
  try {
    const response = await fetch('/api/reports/analytics');
    const payload = await response.json();
    const data = payload.data || {};

    new Chart(document.getElementById('visitsChart'), {
      type: 'line',
      data: {
        labels: (data.visitsTrend || []).map((item) => weekdayLabels[(item._id || 1) - 1]),
        datasets: [{
          label: 'Patient Visits',
          data: (data.visitsTrend || []).map((item) => item.visits),
          borderColor: '#2b6edc',
          backgroundColor: 'rgba(43,110,220,0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    new Chart(document.getElementById('departmentChart'), {
      type: 'bar',
      data: {
        labels: (data.departmentBreakdown || []).map((item) => item._id),
        datasets: [{
          label: 'Appointments',
          data: (data.departmentBreakdown || []).map((item) => item.count),
          backgroundColor: ['#2b6edc', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00acc1']
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });

    new Chart(document.getElementById('statusChart'), {
      type: 'pie',
      data: {
        labels: (data.statusDistribution || []).map((item) => item._id),
        datasets: [{
          data: (data.statusDistribution || []).map((item) => item.count),
          backgroundColor: ['#3564d2', '#2c8c5c', '#888', '#f44336']
        }]
      }
    });

    latestReportsList.innerHTML = '';
    (data.latestReports || []).forEach((report) => {
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${report.title}</strong>
        <span>${report.patientName} - ${new Date(report.reportDate).toLocaleDateString()}</span>
        <span class="status ${report.status.toLowerCase()}">${report.status}</span>
      `;
      latestReportsList.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load reports analytics:', error);
  }
}

loadReportsAnalytics();
