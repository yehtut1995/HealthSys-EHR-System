const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const Setting = require('../models/Setting');

const patientSeed = [
  {
    patientId: 'PT8821',
    fullName: 'Alice Johnson',
    age: 34,
    gender: 'Female',
    status: 'Stable',
    contactInfo: { email: 'alice.johnson@example.com', phone: '+15552220001' },
    emergencyContact: { name: 'Mark Johnson', relationship: 'Spouse', phone: '+15553330001' }
  },
  {
    patientId: 'PT8822',
    fullName: 'Bob Smith',
    age: 45,
    gender: 'Male',
    status: 'Under Observation',
    contactInfo: { email: 'bob.smith@example.com', phone: '+15552220002' },
    emergencyContact: { name: 'Nina Smith', relationship: 'Spouse', phone: '+15553330002' }
  },
  {
    patientId: 'PT8823',
    fullName: 'Charlie Davis',
    age: 29,
    gender: 'Non-binary',
    status: 'Stable',
    contactInfo: { email: 'charlie.davis@example.com', phone: '+15552220003' },
    emergencyContact: { name: 'Emma Davis', relationship: 'Sibling', phone: '+15553330003' }
  },
  {
    patientId: 'PT8824',
    fullName: 'Diana Prince',
    age: 62,
    gender: 'Female',
    status: 'Critical',
    contactInfo: { email: 'diana.prince@example.com', phone: '+15552220004' },
    emergencyContact: { name: 'Steve Prince', relationship: 'Brother', phone: '+15553330004' }
  },
  {
    patientId: 'PT8825',
    fullName: 'Michael Chen',
    age: 51,
    gender: 'Male',
    status: 'Discharged',
    contactInfo: { email: 'michael.chen@example.com', phone: '+15552220005' },
    emergencyContact: { name: 'Linda Chen', relationship: 'Spouse', phone: '+15553330005' }
  }
];

const buildDate = (offsetDays) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date;
};

const ensureSeedData = async () => {
  for (const patient of patientSeed) {
    await Patient.findOneAndUpdate(
      { patientId: patient.patientId },
      { $setOnInsert: patient },
      { upsert: true, returnDocument: 'after' }
    );
  }

  const patients = await Patient.find({
    patientId: { $in: patientSeed.map((patient) => patient.patientId) }
  }).sort({ patientId: 1 });

  const patientMap = new Map(patients.map((patient) => [patient.patientId, patient]));

  if (!await Appointment.countDocuments()) {
    await Appointment.insertMany([
      {
        appointmentId: 'APT1001',
        patient: patientMap.get('PT8821')._id,
        patientId: 'PT8821',
        patientName: 'Alice Johnson',
        doctorName: 'Dr. Alexander Smith',
        department: 'Cardiology',
        appointmentDate: buildDate(0),
        appointmentTime: '10:30',
        type: 'Routine Checkup',
        status: 'Scheduled',
        notes: 'Annual preventive exam'
      },
      {
        appointmentId: 'APT1002',
        patient: patientMap.get('PT8822')._id,
        patientId: 'PT8822',
        patientName: 'Bob Smith',
        doctorName: 'Dr. Grace Miller',
        department: 'Neurology',
        appointmentDate: buildDate(0),
        appointmentTime: '11:00',
        type: 'Follow-up',
        status: 'In Progress',
        notes: 'Migraine management follow-up'
      },
      {
        appointmentId: 'APT1003',
        patient: patientMap.get('PT8823')._id,
        patientId: 'PT8823',
        patientName: 'Charlie Davis',
        doctorName: 'Dr. Emily Adams',
        department: 'Orthopedics',
        appointmentDate: buildDate(1),
        appointmentTime: '09:30',
        type: 'Consultation',
        status: 'Completed',
        notes: 'Post-injury mobility review'
      },
      {
        appointmentId: 'APT1004',
        patient: patientMap.get('PT8824')._id,
        patientId: 'PT8824',
        patientName: 'Diana Prince',
        doctorName: 'Dr. Alexander Smith',
        department: 'Cardiology',
        appointmentDate: buildDate(2),
        appointmentTime: '14:15',
        type: 'Specialist Review',
        status: 'Scheduled',
        notes: 'Cardiac stress review'
      },
      {
        appointmentId: 'APT1005',
        patient: patientMap.get('PT8825')._id,
        patientId: 'PT8825',
        patientName: 'Michael Chen',
        doctorName: 'Dr. Ryan Hall',
        department: 'General Medicine',
        appointmentDate: buildDate(-1),
        appointmentTime: '08:45',
        type: 'Discharge Review',
        status: 'Completed',
        notes: 'Medication and home-care discussion'
      }
    ]);
  }

  if (!await Report.countDocuments()) {
    await Report.insertMany([
      {
        reportId: 'RPT2001',
        patient: patientMap.get('PT8825')._id,
        patientId: 'PT8825',
        patientName: 'Michael Chen',
        title: 'Complete Blood Count',
        category: 'Lab Result',
        department: 'General Medicine',
        status: 'Abnormal',
        reportDate: buildDate(-1),
        summary: 'Elevated white blood cell count requires repeat testing.',
        metrics: [
          { label: 'WBC', value: '12.6 x10^9/L' },
          { label: 'Hemoglobin', value: '13.8 g/dL' }
        ]
      },
      {
        reportId: 'RPT2002',
        patient: patientMap.get('PT8822')._id,
        patientId: 'PT8822',
        patientName: 'Bob Smith',
        title: 'Brain MRI Review',
        category: 'Radiology',
        department: 'Neurology',
        status: 'Normal',
        reportDate: buildDate(-2),
        summary: 'No acute intracranial abnormality identified.',
        metrics: [
          { label: 'Impression', value: 'Normal study' }
        ]
      },
      {
        reportId: 'RPT2003',
        patient: patientMap.get('PT8821')._id,
        patientId: 'PT8821',
        patientName: 'Alice Johnson',
        title: 'HbA1c Screening',
        category: 'Lab Result',
        department: 'Cardiology',
        status: 'Normal',
        reportDate: buildDate(0),
        summary: 'Glycemic control is within target range.',
        metrics: [
          { label: 'HbA1c', value: '5.4%' }
        ]
      }
    ]);
  }

  if (!await Setting.countDocuments()) {
    await Setting.create({
      hospitalInfo: {
        name: 'General Hospital',
        address: '123 Medical Plaza, Bangkok',
        email: 'contact@generalhospital.com',
        phone: '+66 2 123 4567'
      },
      userProfile: {
        fullName: 'Dr. Alexander Smith',
        specialization: 'Cardiologist',
        email: 'asmith@generalhospital.com',
        phone: '+66 81 555 0101'
      },
      preferences: {
        language: 'English',
        timezone: 'UTC +7',
        notifications: 'Enabled'
      }
    });
  }
};

module.exports = ensureSeedData;
