document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('patientSearch');
    const tableBody = document.getElementById('patientTable');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const patientId = row.cells[0].textContent.toLowerCase();
            const fullName = row.cells[1].textContent.toLowerCase();
            const visible = patientId.includes(searchTerm) || fullName.includes(searchTerm);
            row.style.display = visible ? '' : 'none';
        });
    });
});