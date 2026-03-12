// ================================
// PATIENT VISITS TREND
// ================================

const visitsChart = new Chart(
document.getElementById('visitsChart'),
{
type: 'line',

data: {
labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],

datasets: [{
label: 'Patient Visits',
data: [34, 42, 50, 38, 60, 45, 30],
borderColor: '#2b6edc',
backgroundColor: 'rgba(43,110,220,0.1)',
fill: true,
tension: 0.3
}]
},

options: {
responsive:true,
plugins:{
legend:{display:false}
}
}

});



// ================================
// APPOINTMENTS BY DEPARTMENT
// ================================

const departmentChart = new Chart(
document.getElementById('departmentChart'),
{
type:'bar',

data:{
labels:[
'Cardiology',
'Neurology',
'Orthopedics',
'Pediatrics',
'General'
],

datasets:[{
label:'Appointments',
data:[40,25,30,20,50],
backgroundColor:[
'#2b6edc',
'#4caf50',
'#ff9800',
'#9c27b0',
'#f44336'
]
}]
},

options:{
plugins:{
legend:{display:false}
}
}

});




// ================================
// APPOINTMENT STATUS
// ================================

const statusChart = new Chart(
document.getElementById('statusChart'),
{

type:'pie',

data:{
labels:[
'Scheduled',
'Completed',
'In Progress'
],

datasets:[{
data:[35,50,15],

backgroundColor:[
'#3564d2',
'#2c8c5c',
'#888'
]
}]
}

});