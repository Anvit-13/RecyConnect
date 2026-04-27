# RecyConnect - E-Waste Management System

A full-stack technical platform designed to streamline the collection and recycling of electronic waste. This system allows users to request e-waste pickup through a web application, and ensures safe delivery of collected items to certified recyclers.

## 🚀 Features

- **Multi-Role System**: Users, Collectors, Recyclers, and Admins
- **Pickup Request Management**: Submit requests with multiple devices
- **Smart Value Estimation**: Automatic device value calculation
- **User Management**: Profile editing, password change, inactive user cleanup
- **Real-time Status Tracking**: Track pickup requests from submission to completion
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Authentication**: JWT-based authentication with role-based access control

## 🛠️ Technology Stack

### Frontend
- React 18.3.1 + TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- React Router 7.13.0
- Axios for API calls
- Radix UI components
- Recharts for analytics

### Backend
- Node.js + Express.js
- PostgreSQL (SQL Database)
- JWT Authentication
- bcrypt for password hashing
- Multer for file uploads

### Database
- PostgreSQL 15+
- 6 normalized tables
- Foreign keys and indexes
- Connection pooling

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- npm or yarn

## 🚀 Quick Start

### 1. Setup PostgreSQL Database

```bash
# Create database
createdb ewaste_db
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run setup-db
npm start
```

Backend runs on http://localhost:5000

### 3. Setup Frontend

```bash
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

Frontend runs on http://localhost:5173

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[SQL_SETUP_GUIDE.md](SQL_SETUP_GUIDE.md)** - PostgreSQL setup and configuration
- **[SQL_CHEATSHEET.md](SQL_CHEATSHEET.md)** - Common SQL queries
- **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** - API integration details
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ewaste_db
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## 👥 User Roles

1. **User** - Submit pickup requests, track status, manage profile
2. **Collector** - View assigned routes, collect e-waste
3. **Recycler** - Process collected items, record materials
4. **Admin** - Manage users, assign pickups, view analytics

## 🧪 Testing

### Create Admin User
```sql
psql -U postgres ewaste_db
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Test Workflow
1. Register as a user
2. Submit a pickup request with devices
3. View requests in "My Requests"
4. Login as admin to manage system

## 📊 Database Schema

- **users** - User accounts with roles
- **pickup_requests** - E-waste pickup requests
- **devices** - Devices in pickup requests
- **device_images** - Device photos
- **recycling_records** - Processing records
- **collection_routes** - Collector routes

## ✅ Implemented Features

- ✅ User authentication (register, login, JWT)
- ✅ Protected routes with role-based access
- ✅ User profile management
- ✅ Pickup request submission (multiple devices)
- ✅ Device value estimation
- ✅ Request viewing and cancellation
- ✅ Admin inactive user management
- ✅ Toast notifications
- ✅ Loading states and error handling
- ✅ PostgreSQL database with proper schema

## 🔄 In Progress

- Dashboard statistics integration
- Collector route management
- Recycler processing center
- File upload for device images
- Email notifications
- Real-time updates

## 🚀 Deployment

See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for production deployment checklist.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Pickup Requests
- `POST /api/pickups` - Create request
- `GET /api/pickups/my-requests` - Get user's requests
- `GET /api/pickups/:id` - Get single request
- `PUT /api/pickups/:id` - Update status
- `DELETE /api/pickups/:id` - Delete request

### Admin
- `GET /api/admin/users/inactive` - Get inactive users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/dashboard/stats` - Get statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[Your License Here]

## 🆘 Support

For issues and questions:
- Check documentation files
- Review SQL_CHEATSHEET.md for database queries
- See API_INTEGRATION_GUIDE.md for integration help

## 🎯 Project Status

**Status**: ✅ Core features implemented with PostgreSQL database integration

**Last Updated**: April 7, 2026

