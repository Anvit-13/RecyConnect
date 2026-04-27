# Quick Start Guide - E-Waste Management System

## What's Been Done

Your e-waste management system now has a fully functional REST API integration connecting the React frontend with the Node.js/Express/PostgreSQL backend.

## Integrated Components

### ✅ Authentication
- **Login** - Users can log in with email/password, JWT authentication
- **Register** - New users can create accounts
- **Protected Routes** - All routes require authentication and role-based access

### ✅ User Features
- **User Settings** - Edit profile (name, email, phone, address) and change password
- **Submit Pickup** - Create pickup requests with multiple devices and estimated values
- **My Pickup Requests** - View all pickup requests, cancel pending ones

### ✅ Admin Features
- **Admin Settings** - View and delete inactive users (90+ days)
- **Dashboard** - View system statistics (still using mock data, needs integration)

### ✅ Global Features
- **Toast Notifications** - Success/error messages for all actions
- **Loading States** - All forms show loading during API calls
- **Error Handling** - Proper error messages from backend

## How to Run

### 1. Setup PostgreSQL Database

**Important: This project uses PostgreSQL (SQL database)**

#### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql@15 && brew services start postgresql@15`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ewaste_db;

# Exit
\q
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=ewaste_db
# DB_USER=postgres
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=your-secret-key-here

# Setup database tables (creates all SQL tables, indexes, triggers)
npm run setup-db

# Start backend server
npm start
```

Backend will run on http://localhost:5000

**See SQL_SETUP_GUIDE.md for detailed SQL database setup instructions**

### 2. Setup Frontend
```bash
# Install dependencies (from root directory)
npm install

# Copy environment file
cp .env.example .env

# .env should contain:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the System

### 1. Create an Account
1. Go to http://localhost:5173/register
2. Fill in the registration form
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### 2. Submit a Pickup Request
1. Click "Submit Pickup" in the sidebar
2. Add one or more devices:
   - Select device type (laptop, smartphone, etc.)
   - Select brand (Apple, Dell, Samsung, etc.)
   - Select model (specific model from the list)
   - Select condition (working, partially-working, not-working, broken)
   - Enter quantity
3. See the estimated value calculated automatically
4. Fill in pickup address and date
5. Click "Submit Request"
6. Check "My Pickup Requests" to see your submission

### 3. Update Your Profile
1. Click "Settings" in the sidebar
2. Click "Edit" button
3. Update your information
4. Click "Save Changes"

### 4. Change Password
1. Go to Settings
2. Scroll to "Change Password" section
3. Enter current password, new password, and confirm
4. Click "Update Password"

### 5. Test Admin Features (Create Admin User)
To test admin features, you need to create an admin user in the PostgreSQL database:

```bash
# Connect to your PostgreSQL database
psql -U postgres ewaste_db

# Update a user to admin role
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# Exit
\q
```

Then login with that account and access:
- Admin Dashboard
- Admin Settings (view/delete inactive users)
- User Management

**Tip**: You can also view all users with:
```sql
SELECT id, name, email, role FROM users;
```

## API Endpoints Being Used

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Pickup Requests
- `POST /api/pickups` - Create pickup request
- `GET /api/pickups/my-requests` - Get user's requests
- `GET /api/pickups/:id` - Get single request
- `PUT /api/pickups/:id` - Update request status
- `DELETE /api/pickups/:id` - Delete request

### Admin
- `GET /api/admin/users/inactive` - Get inactive users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/dashboard/stats` - Get dashboard stats

## Features Still Using Mock Data

These components need to be integrated next:
1. AdminDashboard - Dashboard statistics
2. UserManagement - User list and management
3. RecyclerDashboard - Recycler statistics
4. CollectorDashboard - Collector statistics
5. PickupAssignmentManagement - Assign pickups to collectors
6. ProcessingCenter - Process collected items
7. RecyclingRecords - View recycling history
8. CollectionRoutes - Collector route management
9. MyCollections - Collector's collections
10. PickupDetails - Detailed view of single pickup

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env) - PostgreSQL Configuration
```
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ewaste_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
```

**Note**: The system uses PostgreSQL (SQL database), not MongoDB or other NoSQL databases.

## Troubleshooting

### Backend won't start
- **Check if PostgreSQL is running**:
  - Linux: `sudo systemctl status postgresql`
  - macOS: `brew services list`
  - Windows: Check Services app
- **Verify database credentials** in `backend/.env`
- **Ensure database exists**: 
  ```bash
  psql -U postgres -l  # List all databases
  createdb -U postgres ewaste_db  # Create if missing
  ```
- **Run setup script**: `cd backend && npm run setup-db`
- **Check PostgreSQL logs** for errors

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Login fails
- Check if user exists in database
- Verify password is correct
- Check backend logs for errors
- Ensure JWT_SECRET is set in backend `.env`

### Toast notifications not showing
- Toaster component is configured in `src/main.tsx`
- Check browser console for errors

## Next Steps

1. **Test all integrated features** - Login, register, submit pickup, view requests, update profile
2. **Create test users** - Create users with different roles (user, admin, collector, recycler)
3. **Integrate remaining components** - Follow the pattern used in integrated components
4. **Add file upload** - Implement device image upload functionality
5. **Add real-time updates** - Consider WebSocket for live updates
6. **Deploy to production** - Follow deployment checklist in API_INTEGRATION_GUIDE.md

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Login.tsx ✅ (Integrated)
│   │   ├── Register.tsx ✅ (Integrated)
│   │   ├── UserSettings.tsx ✅ (Integrated)
│   │   ├── AdminSettings.tsx ✅ (Integrated)
│   │   ├── SubmitPickup.tsx ✅ (Integrated)
│   │   ├── MyPickupRequests.tsx ✅ (Integrated)
│   │   ├── ProtectedRoute.tsx ✅ (New)
│   │   └── ... (other components)
│   └── App.tsx ✅ (Updated with protected routes)
├── context/
│   └── AuthContext.tsx ✅ (Integrated)
├── services/
│   ├── api.ts ✅ (Axios instance)
│   ├── authService.ts ✅ (Auth API calls)
│   ├── pickupService.ts ✅ (Pickup API calls)
│   └── adminService.ts ✅ (Admin API calls)
└── main.tsx ✅ (Added Toaster)

backend/
├── src/
│   ├── config/
│   │   ├── database.js ✅
│   │   └── setupDatabase.js ✅
│   ├── controllers/
│   │   ├── authController.js ✅
│   │   ├── pickupController.js ✅
│   │   └── adminController.js ✅
│   ├── middleware/
│   │   ├── auth.js ✅
│   │   └── upload.js ✅
│   ├── routes/
│   │   ├── authRoutes.js ✅
│   │   ├── pickupRoutes.js ✅
│   │   └── adminRoutes.js ✅
│   └── server.js ✅
└── package.json ✅
```

## Support

For detailed documentation, see:
- `SQL_SETUP_GUIDE.md` - **PostgreSQL database setup and SQL queries**
- `backend/README.md` - Backend API documentation
- `API_INTEGRATION_GUIDE.md` - Integration guide
- `SETUP_GUIDE.md` - Detailed setup instructions

## Summary

Your e-waste management system now has:
- ✅ **PostgreSQL (SQL) Database** - 6 tables with proper relationships
- ✅ Full authentication system with JWT
- ✅ User registration and login
- ✅ Protected routes with role-based access
- ✅ User profile management
- ✅ Pickup request submission with multiple devices
- ✅ Pickup request viewing and cancellation
- ✅ Admin inactive user management
- ✅ Toast notifications for all actions
- ✅ Loading states and error handling
- ✅ RESTful API with Express.js
- ✅ SQL queries with parameterized statements (SQL injection prevention)
- ✅ Database indexes for performance
- ✅ Foreign keys for data integrity

**Database**: PostgreSQL with normalized schema, indexes, and triggers.

The foundation is solid and ready for the remaining components to be integrated!
