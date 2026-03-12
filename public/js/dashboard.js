console.log('Dashboard JS loaded');

async function loadPatientCount() {

    try {
        const response = await fetch('/api/patients/count');
        const data = await response.json();

        document.getElementById('patientCount').textContent =
            data.totalPatients;

    } catch (error) {
        console.error("Error loading patient count:", error);
    }

}

loadPatientCount();