# EHR System API Documentation

## Overview

The Electronic Health Record (EHR) System REST API provides endpoints for managing patient records in a healthcare environment. This API follows RESTful conventions and returns JSON responses.

**Base URL**: `http://localhost:3000/api`

## Authentication

Currently, the API is in development mode and does not require authentication. In production, appropriate authentication and authorization mechanisms should be implemented.

## General Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": object | array,
  "error": string (only on error),
  "message": string (optional success message)
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Health Check

#### GET /health
Check if the API server is running.

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

### Patients

#### GET /api/patients
Retrieve a paginated list of patients with optional filtering.

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by patient status
- `gender` (string, optional): Filter by gender

**Example Request**:
```
GET /api/patients?page=1&limit=10&status=Stable
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "patientId": "P001",
      "fullName": "John Doe",
      "age": 45,
      "gender": "Male",
      "status": "Stable",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

#### GET /api/patients/:id
Retrieve a single patient by their patient ID.

**Path Parameters**:
- `id` (string): Patient ID

**Example Request**:
```
GET /api/patients/P001
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "patientId": "P001",
    "fullName": "John Doe",
    "age": 45,
    "gender": "Male",
    "status": "Stable",
    "contactInfo": {
      "email": "john.doe@email.com",
      "phone": "+1234567890"
    },
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    },
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /api/patients
Create a new patient record.

**Request Body**:
```json
{
  "patientId": "P002",
  "fullName": "Jane Smith",
  "age": 32,
  "gender": "Female",
  "status": "Stable",
  "contactInfo": {
    "email": "jane.smith@email.com",
    "phone": "+1234567890"
  },
  "address": {
    "street": "456 Oak Ave",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "emergencyContact": {
    "name": "Bob Smith",
    "relationship": "Spouse",
    "phone": "+1234567890"
  }
}
```

**Required Fields**:
- `patientId` (string, 3-20 chars, alphanumeric)
- `fullName` (string, 2-100 chars)
- `age` (number, 0-150)
- `gender` (string, enum: "Male", "Female", "Non-binary", "Other")

**Optional Fields**:
- `status` (string, enum: "Stable", "Under Observation", "Critical", "Discharged")
- `contactInfo.email` (string, valid email)
- `contactInfo.phone` (string, valid phone number)
- `address` (object with street, city, state, zipCode)
- `medicalHistory` (array of medical conditions)
- `emergencyContact` (object with name, relationship, phone)

**Response**:
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012346",
    "patientId": "P002",
    "fullName": "Jane Smith",
    "age": 32,
    "gender": "Female",
    "status": "Stable",
    "createdAt": "2024-01-01T11:00:00.000Z",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

#### PUT /api/patients/:id
Update an existing patient record.

**Path Parameters**:
- `id` (string): Patient ID

**Request Body**: Same as POST, but all fields are optional.

**Example Request**:
```
PUT /api/patients/P001
Content-Type: application/json

{
  "status": "Under Observation",
  "age": 46
}
```

**Response**:
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "patientId": "P001",
    "fullName": "John Doe",
    "age": 46,
    "gender": "Male",
    "status": "Under Observation",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### DELETE /api/patients/:id
Delete a patient record.

**Path Parameters**:
- `id` (string): Patient ID

**Example Request**:
```
DELETE /api/patients/P001
```

**Response**:
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

## Data Models

### Patient Model

```typescript
interface Patient {
  _id: string;
  patientId: string; // Unique identifier
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Non-binary" | "Other";
  status: "Stable" | "Under Observation" | "Critical" | "Discharged";
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  medicalHistory?: Array<{
    condition: string;
    diagnosedDate: Date;
    notes?: string;
  }>;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Validation Rules

### Patient ID
- Required
- 3-20 characters
- Alphanumeric only
- Must be unique

### Full Name
- Required
- 2-100 characters
- Letters, spaces, hyphens, and apostrophes only

### Age
- Required
- Integer between 0 and 150

### Gender
- Required
- Must be one of: "Male", "Female", "Non-binary", "Other"

### Status
- Optional
- Must be one of: "Stable", "Under Observation", "Critical", "Discharged"
- Defaults to "Stable"

### Email
- Optional
- Must be a valid email format

### Phone
- Optional
- Must be a valid phone number format

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "value": "",
      "msg": "Patient ID is required",
      "param": "patientId",
      "location": "body"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Patient not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to create patient"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## Security Considerations

1. **Input Validation**: All inputs are validated using express-validator
2. **Sanitization**: String inputs are trimmed and sanitized
3. **CORS**: Configured for specific origins
4. **Helmet**: Security headers are set
5. **Error Handling**: Sensitive information is not exposed in production

## Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints.

### Example with curl:

```bash
# Get all patients
curl -X GET http://localhost:3000/api/patients

# Create a new patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P003",
    "fullName": "Test Patient",
    "age": 30,
    "gender": "Other"
  }'

# Get specific patient
curl -X GET http://localhost:3000/api/patients/P003

# Update patient
curl -X PUT http://localhost:3000/api/patients/P003 \
  -H "Content-Type: application/json" \
  -d '{"status": "Critical"}'

# Delete patient
curl -X DELETE http://localhost:3000/api/patients/P003
```

## Future Enhancements

1. Authentication and Authorization
2. Role-based access control
3. Audit logging
4. Data encryption
5. API versioning
6. Webhook notifications
7. Bulk operations
8. Advanced search and filtering
9. Data export functionality
10. Integration with external systems
