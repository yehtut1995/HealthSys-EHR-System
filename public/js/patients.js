document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('patientSearch');
  const tableBody = document.getElementById('patientTable');
  const summary = document.getElementById('patientRecordSummary');
  const addPatientButton = document.getElementById('addPatientBtn');
  let patients = [];

  const statusClassMap = {
    Stable: 'stable',
    'Under Observation': 'observation',
    Critical: 'critical',
    Discharged: 'complete'
  };

  function renderPatients(records) {
    tableBody.innerHTML = '';

    if (!records.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">No patient records found.</td>
        </tr>
      `;
      summary.textContent = 'No patient records available yet.';
      return;
    }

    records.forEach((patient) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#${patient.patientId}</td>
        <td class="name">${patient.fullName}</td>
        <td>${patient.age}</td>
        <td><span class="gender">${patient.gender}</span></td>
        <td><span class="status ${statusClassMap[patient.status] || 'stable'}">${patient.status}</span></td>
        <td class="actions">
          <button class="view" data-id="${patient.patientId}">View</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    summary.textContent = `Managing ${records.length} patient records currently available in the system.`;
  }

  async function loadPatients() {
    const response = await fetch('/api/patients?limit=100');
    const payload = await response.json();
    patients = payload.data || [];
    renderPatients(patients);
  }

  searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = patients.filter((patient) =>
      patient.patientId.toLowerCase().includes(searchTerm) ||
      patient.fullName.toLowerCase().includes(searchTerm)
    );
    renderPatients(filtered);
  });

  addPatientButton.addEventListener('click', async function() {
    const patientId = window.prompt('Enter patient ID');
    if (!patientId) return;

    const fullName = window.prompt('Enter patient full name');
    const age = window.prompt('Enter age');
    const gender = window.prompt('Enter gender: Male, Female, Non-binary, or Other');

    if (!fullName || !age || !gender) {
      return;
    }

    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        fullName,
        age: Number(age),
        gender
      })
    });

    if (!response.ok) {
      const error = await response.json();
      window.alert(error.error || 'Failed to create patient');
      return;
    }

    await loadPatients();
  });

  loadPatients().catch((error) => {
    console.error('Failed to load patients:', error);
  });
});
