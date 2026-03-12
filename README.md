# Electronic Health Record (EHR) System

A modern, RESTful API for managing patient records in healthcare environments. This project demonstrates best practices in Node.js backend development with Express, MongoDB, and comprehensive error handling.

## 🚀 Features

- **RESTful API Design**: Clean, intuitive endpoints following REST conventions
- **Comprehensive Validation**: Input validation and sanitization using express-validator
- **Advanced Error Handling**: Centralized error handling with detailed error responses
- **Security First**: Helmet.js, CORS configuration, and security best practices
- **Database Optimization**: Mongoose with proper indexing and validation
- **Environment Configuration**: Flexible configuration using dotenv
- **API Documentation**: Complete API documentation with examples
- **Modern JavaScript**: ES6+ features and async/await patterns

## 📋 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **Security**: Helmet.js, CORS
- **Environment**: dotenv
- **Development**: nodemon

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Clone the Repository

```bash
git clone <repository-url>
cd ehr-system
```

### Install Dependencies

```bash
npm install
```

### Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/healthsys
```

### Start MongoDB

Make sure MongoDB is running on your system:
```bash
# For MongoDB Community Edition
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Run the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```bash
GET /health
```

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients (with pagination and filtering) |
| GET | `/api/patients/:id` | Get specific patient by ID |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient information |
| DELETE | `/api/patients/:id` | Delete patient record |

### Example Requests

#### Create a Patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P001",
    "fullName": "John Doe",
    "age": 45,
    "gender": "Male",
    "status": "Stable"
  }'
```

#### Get All Patients
```bash
curl -X GET http://localhost:3000/api/patients
```

#### Get Patient by ID
```bash
curl -X GET http://localhost:3000/api/patients/P001
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🏗️ Project Structure

```
ehr-system/
├── config/
│   └── db.js                # Database connection configuration
├── models/
│   └── Patient.js          # Patient data model and schema
├── routes/
│   └── patientRoutes.js    # Patient API routes
├── public/                 # Frontend static files
├── raw/                    # Raw assets
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── index.js               # Main application entry point
├── package.json           # Project dependencies and scripts
├── API_DOCUMENTATION.md  # Detailed API documentation
└── README.md             # This file
```

## 🧪 Testing

### Manual Testing with curl

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test creating a patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "TEST001",
    "fullName": "Test Patient",
    "age": 30,
    "gender": "Other"
  }'

# Test getting patients
curl http://localhost:3000/api/patients
```

### Testing with Postman

1. Import the following collection into Postman:
```json
{
  "info": {
    "name": "EHR System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get All Patients",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/patients"
      }
    },
    {
      "name": "Create Patient",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/patients",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"patientId\": \"P001\",\n  \"fullName\": \"John Doe\",\n  \"age\": 45,\n  \"gender\": \"Male\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/healthsys` |
| `JWT_SECRET` | JWT secret key | (generated) |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

### Database Schema

The Patient model includes comprehensive validation and the following fields:

- **Basic Info**: patientId, fullName, age, gender, status
- **Contact**: email, phone
- **Address**: street, city, state, zipCode
- **Medical**: medicalHistory array
- **Emergency**: emergencyContact object

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**:
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://your-production-db/healthsys
JWT_SECRET=your-super-secure-secret
```

2. **Security Considerations**:
   - Use HTTPS in production
   - Set strong JWT secrets
   - Configure proper CORS origins
   - Enable rate limiting
   - Set up monitoring and logging

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ehr-system .
docker run -p 3000:3000 --env-file .env ehr-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

This project follows JavaScript Standard Style with ESLint configuration:

- Use 2 spaces for indentation
- Prefer `const` over `let`
- Use async/await for asynchronous operations
- Include comprehensive error handling
- Write meaningful commit messages

## 🔒 Security Features

- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Mongoose ODM prevents NoSQL injection
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet.js sets security headers
- **Error Sanitization**: Sensitive data not exposed in production

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval with pagination
- **Connection Pooling**: MongoDB connection management
- **Caching Ready**: Structure supports caching implementation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**:
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

3. **Module Not Found**:
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**YeHtut** - *Initial work* - [GitHub Profile](https://github.com/YeHtut)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB for the robust database solution
- Open source community for inspiration and tools

---

**Note**: This is a portfolio project demonstrating backend development skills. For production use in healthcare environments, additional security measures, compliance (HIPAA), and extensive testing would be required.
