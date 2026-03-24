# HealthSys EHR System

HealthSys is a sample full-stack Electronic Health Record system built with Node.js, Express, MongoDB, and a static frontend served by the backend. It now includes working backend modules for patients, appointments, reports, settings, and dashboard summaries, so the project can be used as a realistic demo instead of a frontend-only mockup.

## Overview

The application serves both:

- A browser-based admin interface from `public/`
- A REST API from `/api/*`

When the server starts, it connects to MongoDB and seeds demo data for core modules so the UI has usable information immediately.

## Features

- Patient directory backed by MongoDB
- Appointment scheduling with live summary cards
- Reports dashboard with chart-based analytics
- System settings persistence
- Dashboard metrics for patients, appointments, visits, and lab results
- Seeded starter data for demo use
- Validation using `express-validator`
- Security headers via Helmet
- Static frontend served directly from Express

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Vanilla HTML, CSS, and JavaScript
- Chart.js for report visualizations
- Helmet, CORS, dotenv, express-validator

## Project Structure

```text
HealthSys EHR System/
|-- config/
|   |-- db.js
|   `-- seedData.js
|-- models/
|   |-- Appointment.js
|   |-- Patient.js
|   |-- Report.js
|   `-- Setting.js
|-- public/
|   |-- css/
|   |-- images/
|   |-- js/
|   |-- appointments.html
|   |-- dashboard.html
|   |-- index.html
|   |-- login.html
|   |-- patients.html
|   |-- reports.html
|   `-- settings.html
|-- routes/
|   |-- appointmentRoutes.js
|   |-- dashboardRoutes.js
|   |-- patientRoutes.js
|   |-- reportRoutes.js
|   `-- settingRoutes.js
|-- index.js
|-- package.json
|-- API_DOCUMENTATION.md
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB running locally or a reachable MongoDB connection string

### Install

```bash
npm install
```

### Environment

Create or update `.env` with:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/healthsys
```

### Run the App

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Seeded Demo Data

On startup, the app seeds:

- Patients
- Appointments
- Reports
- Settings

This makes the dashboard, appointments page, reports page, and settings page usable on first run.

Default demo password for the settings password form:

```text
admin123
```

## Frontend Pages

- `/dashboard.html` shows live patient, appointment, visit, and lab summary data
- `/patients.html` loads patient records from the API and supports quick add
- `/appointments.html` lists appointments and allows scheduling new ones
- `/reports.html` renders charts from appointment/report analytics
- `/settings.html` loads and updates stored system settings

## API Summary

Base URL:

```text
http://localhost:3000/api
```

### Health

- `GET /health`

### Dashboard

- `GET /api/dashboard`

### Patients

- `GET /api/patients`
- `GET /api/patients/count`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Appointments

- `GET /api/appointments`
- `GET /api/appointments/summary`
- `POST /api/appointments`

### Reports

- `GET /api/reports`
- `GET /api/reports/analytics`

### Settings

- `GET /api/settings`
- `PUT /api/settings`

Detailed examples are still in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md), though that file mainly covers the patient API and can be expanded later.

## Key Backend Notes

- MongoDB is required for full functionality
- Seed data runs automatically after database connection
- Report charts depend on Chart.js loaded from `cdn.jsdelivr.net`
- Helmet is configured to allow that CDN so charts can render correctly

## Validation and Security

- Request validation is handled with `express-validator`
- Helmet is enabled with a CSP that allows local assets and Chart.js CDN
- CORS is enabled for local development origins
- Mongoose schemas provide field validation and indexing

## Known Limitations

This is a strong demo sample, but not a production healthcare deployment yet. It does not currently include:

- Authentication and authorization
- Role-based access control
- Audit logging
- File uploads
- Encryption for sensitive medical records
- HIPAA or other regulatory compliance features

## Verification

Recently verified locally:

- `node --check` passes for updated backend and frontend JavaScript files
- `node index.js` starts successfully and connects to MongoDB

## Next Improvements

- Expand `API_DOCUMENTATION.md` to cover appointments, reports, settings, and dashboard endpoints
- Add authentication for admin and clinician roles
- Add editable report creation flows
- Improve patient create/edit forms beyond prompt-based input
- Add automated tests for API routes

## Author

**YeHtut**

## License

ISC
