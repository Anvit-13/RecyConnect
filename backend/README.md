# E-Waste Management System - Backend API

Full-featured REST API for the E-Waste Management System built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Register, login, profile management
- **Pickup Requests**: Create, view, update, and delete e-waste pickup requests
- **Multi-Device Support**: Submit multiple devices in a single pickup request
- **Admin Dashboard**: User management, inactive user tracking, statistics
- **File Uploads**: Image upload support for device photos
- **Estimated Pricing**: Automatic calculation of e-waste value
- **Security**: Helmet, CORS, password hashing, input validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE ewaste_db;
```

### 3. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ewaste_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### 4. Setup Database Schema

Run the database setup script:

```bash
npm run db:setup
```

This will create all necessary tables:
- `users` - User accounts
- `pickup_requests` - Pickup requests
- `devices` - Device details
- `device_images` - Device photos
- `recycling_records` - Recycling data
- `collection_routes` - Collector routes

## 🏃 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Pickup Requests

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/pickups` | Create pickup request | Yes | User |
| GET | `/api/pickups/my-requests` | Get user's requests | Yes | User |
| GET | `/api/pickups/all` | Get all requests | Yes | Admin/Collector/Recycler |
| GET | `/api/pickups/:id` | Get request details | Yes | Any |
| PUT | `/api/pickups/:id` | Update request status | Yes | Admin/Collector/Recycler |
| DELETE | `/api/pickups/:id` | Delete request | Yes | User (own) / Admin |

### Admin

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/admin/users` | Get all users | Yes | Admin |
| GET | `/api/admin/users/inactive` | Get inactive users | Yes | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Yes | Admin |
| PATCH | `/api/admin/users/:id/toggle-status` | Toggle user status | Yes | Admin |
| GET | `/api/admin/dashboard/stats` | Get dashboard stats | Yes | Admin |

## 📝 API Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St, City",
  "role": "user"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### Create Pickup Request

```bash
POST /api/pickups
Authorization: Bearer <token>
Content-Type: application/json

{
  "devices": [
    {
      "deviceType": "laptop",
      "brand": "Apple",
      "model": "MacBook Pro 14\" M2",
      "condition": "working",
      "quantity": 1
    },
    {
      "deviceType": "smartphone",
      "brand": "Samsung Galaxy",
      "model": "Galaxy S23",
      "condition": "partially-working",
      "quantity": 2
    }
  ],
  "address": "123 Main Street, City, State 12345",
  "pickupDate": "2026-04-15"
}
```

### Get Inactive Users (Admin)

```bash
GET /api/admin/users/inactive?days=90
Authorization: Bearer <admin_token>
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **user**: Regular users who submit pickup requests
- **collector**: Collect e-waste from users
- **recycler**: Process collected e-waste
- **admin**: Full system access and management

## 🗄️ Database Schema

### Users Table
- id (UUID, PK)
- name, email, password
- phone, address
- role (user/admin/collector/recycler)
- is_active, last_login
- created_at, updated_at

### Pickup Requests Table
- id (UUID, PK)
- user_id (FK → users)
- address, pickup_date
- status (pending/scheduled/in-progress/completed/cancelled)
- total_estimated_value
- collector_id, recycler_id (FK → users)
- created_at, updated_at

### Devices Table
- id (UUID, PK)
- pickup_request_id (FK → pickup_requests)
- device_type, brand, model
- condition, quantity
- estimated_value
- created_at

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- SQL injection protection (parameterized queries)
- CORS configuration
- Helmet security headers
- File upload restrictions

## 📊 Error Handling

All API responses follow a consistent format:

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "errors": { ... }
}
```

## 🧪 Testing

Test the API health:

```bash
curl http://localhost:5000/health
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── setupDatabase.js     # Schema setup script
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── pickupController.js  # Pickup logic
│   │   └── adminController.js   # Admin logic
│   ├── middleware/
│   │   ├── auth.js              # Authentication
│   │   └── upload.js            # File upload
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── pickupRoutes.js      # Pickup endpoints
│   │   └── adminRoutes.js       # Admin endpoints
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   └── server.js                # Entry point
├── uploads/                     # Uploaded files
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
JWT_SECRET=strong_random_secret_key
FRONTEND_URL=https://your-frontend-domain.com
```

### Recommended Hosting

- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Database**: Heroku Postgres, Supabase, AWS RDS
- **File Storage**: AWS S3, Cloudinary (for production file uploads)

## 📄 License

MIT

## 👨‍💻 Support

For issues or questions, please create an issue in the repository.
