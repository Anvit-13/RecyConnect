# API Integration Guide

This document provides a complete guide for the REST API integration between the frontend and backend.

## Overview

The e-waste management system now has a fully integrated REST API connecting the React frontend with the Node.js/Express/PostgreSQL backend.

## What Has Been Integrated

### 1. Authentication System
- **Login Component** (`src/app/components/Login.tsx`)
  - Uses `authService.login()` to authenticate users
  - Stores JWT token and user data in localStorage
  - Redirects to appropriate dashboard based on user role
  - Shows loading state and error messages via toast notifications

- **Register Component** (`src/app/components/Register.tsx`)
  - Uses `authService.register()` to create new user accounts
  - Validates password confirmation
  - Automatically logs in user after successful registration
  - Shows success/error messages via toast notifications

### 2. User Settings
- **UserSettings Component** (`src/app/components/UserSettings.tsx`)
  - Fetches current user profile on mount
  - Uses `authService.updateProfile()` to update user information
  - Uses `authService.changePassword()` to change password
  - Validates password confirmation before submission
  - Shows loading states and toast notifications

### 3. Admin Settings
- **AdminSettings Component** (`src/app/components/AdminSettings.tsx`)
  - Fetches inactive users using `adminService.getInactiveUsers(90)`
  - Displays users inactive for 90+ days
  - Uses `adminService.deleteUser()` to delete users
  - Shows statistics for inactive users
  - Real-time search and filtering

### 4. Pickup Requests
- **SubmitPickup Component** (`src/app/components/SubmitPickup.tsx`)
  - Uses `pickupService.createPickupRequest()` to submit new requests
  - Supports multiple devices in a single request
  - Calculates estimated value for each device
  - Shows loading state during submission
  - Redirects to My Requests page after successful submission

- **MyPickupRequests Component** (`src/app/components/MyPickupRequests.tsx`)
  - Fetches user's pickup requests using `pickupService.getUserPickupRequests()`
  - Displays all requests with status, devices, and dates
  - Allows cancellation of pending requests
  - Shows loading state while fetching data

## API Services

### Authentication Service (`src/services/authService.ts`)
```typescript
- register(data): Create new user account
- login(data): Authenticate user
- getProfile(): Fetch current user profile
- updateProfile(data): Update user information
- changePassword(currentPassword, newPassword): Change password
- logout(): Clear auth data and redirect to login
- getCurrentUser(): Get user from localStorage
- getToken(): Get JWT token from localStorage
- isAuthenticated(): Check if user is logged in
```

### Pickup Service (`src/services/pickupService.ts`)
```typescript
- createPickupRequest(data): Submit new pickup request
- getUserPickupRequests(): Get user's pickup requests
- getAllPickupRequests(params): Get all requests (admin/collector)
- getPickupRequestById(id): Get single request details
- updatePickupStatus(id, data): Update request status
- deletePickupRequest(id): Delete request
```

### Admin Service (`src/services/adminService.ts`)
```typescript
- getAllUsers(params): Get all users with filters
- getInactiveUsers(days): Get users inactive for X days
- deleteUser(id): Delete user account
- toggleUserStatus(id): Activate/deactivate user
- getDashboardStats(): Get admin dashboard statistics
```

## Authentication Flow

1. User enters credentials in Login component
2. `authService.login()` sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token + user data
4. Token and user data stored in localStorage
5. AuthContext updates with user information
6. User redirected to appropriate dashboard based on role
7. All subsequent API requests include JWT token in Authorization header

## Protected Routes

All routes except `/login` and `/register` are protected using the `ProtectedRoute` component:

```typescript
<ProtectedRoute allowedRoles={['user']}>
  <UserDashboard />
</ProtectedRoute>
```

- Checks if user is authenticated
- Verifies user has required role
- Shows loading spinner while checking auth
- Redirects to login if not authenticated
- Redirects to dashboard if wrong role

## Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/ewaste_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Toast Notifications

All user actions show toast notifications using Sonner:
- Success messages (green)
- Error messages (red)
- Info messages (blue)

The Toaster component is configured in `src/main.tsx`:
```typescript
<Toaster position="top-right" richColors />
```

## Error Handling

All API calls are wrapped in try-catch blocks:
```typescript
try {
  const response = await authService.login(email, password);
  toast.success('Login successful!');
  navigate('/dashboard');
} catch (error: any) {
  toast.error(error.response?.data?.message || 'Login failed');
}
```

## Loading States

All components show loading states during API calls:
- Buttons show "Loading..." text and are disabled
- Tables show "Loading..." message
- Forms prevent submission during loading

## Next Steps for Full Integration

### Components Still Using Mock Data:
1. **AdminDashboard** - Update to use `adminService.getDashboardStats()`
2. **UserManagement** - Update to use `adminService.getAllUsers()`
3. **PickupAssignmentManagement** - Update to use pickup and admin services
4. **RecyclerDashboard** - Create recycler service and integrate
5. **CollectorDashboard** - Create collector service and integrate
6. **ProcessingCenter** - Integrate with recycling records API
7. **RecyclingRecords** - Create recycling service and integrate
8. **CollectionRoutes** - Integrate with collector routes API
9. **MyCollections** - Integrate with collector collections API
10. **PickupDetails** - Update to use `pickupService.getPickupRequestById()`

### Additional Features to Implement:
1. File upload for device images
2. Real-time notifications
3. Email notifications
4. Password reset functionality
5. User profile pictures
6. Advanced search and filtering
7. Export data to CSV/PDF
8. Analytics and reporting
9. Audit logs
10. Rate limiting and security enhancements

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

### 3. Test Authentication
1. Go to http://localhost:5173/register
2. Create a new user account
3. Login with the credentials
4. Verify redirect to dashboard

### 4. Test Pickup Request
1. Navigate to Submit Pickup
2. Add multiple devices
3. Fill in pickup information
4. Submit the request
5. Check My Requests page

### 5. Test Admin Features (if admin user)
1. Navigate to Admin Settings
2. View inactive users
3. Test delete functionality

## Common Issues and Solutions

### Issue: CORS Errors
**Solution**: Ensure backend CORS is configured correctly in `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: 401 Unauthorized
**Solution**: Check if JWT token is being sent in requests. Verify token in localStorage.

### Issue: Network Error
**Solution**: Ensure backend is running and `VITE_API_URL` is correct in `.env`.

### Issue: Token Expired
**Solution**: Logout and login again. Consider implementing token refresh.

## API Documentation

Full API documentation is available in `backend/README.md`.

## Security Considerations

1. JWT tokens stored in localStorage (consider httpOnly cookies for production)
2. All passwords hashed with bcrypt
3. Input validation on both frontend and backend
4. SQL injection prevention using parameterized queries
5. XSS prevention through React's built-in escaping
6. CSRF protection needed for production
7. Rate limiting recommended for production
8. HTTPS required for production

## Deployment Checklist

- [ ] Update API URL to production backend
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure production database
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production domain
- [ ] Set up automated backups
- [ ] Enable error tracking (e.g., Sentry)
- [ ] Set up CI/CD pipeline
