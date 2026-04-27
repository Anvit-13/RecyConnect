import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { UserDashboard } from './components/UserDashboard';
import { SubmitPickup } from './components/SubmitPickup';
import { MyPickupRequests } from './components/MyPickupRequests';
import { PickupDetails } from './components/PickupDetails';
import { RecyclerDashboard } from './components/RecyclerDashboard';
import { ProcessingCenter } from './components/ProcessingCenter';
import { PickupAssignmentManagement } from './components/PickupAssignmentManagement';
import { RecyclingRecords } from './components/RecyclingRecords';
import { RecoveryMaterials } from './components/RecoveryMaterials';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { CollectorDashboard } from './components/CollectorDashboard';
import { CollectionRoutes } from './components/CollectionRoutes';
import { MyCollections } from './components/MyCollections';
import { UserSettings } from './components/UserSettings';
import { AdminSettings } from './components/AdminSettings';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/submit-pickup" element={<ProtectedRoute allowedRoles={['user']}><SubmitPickup /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute allowedRoles={['user']}><MyPickupRequests /></ProtectedRoute>} />
        <Route path="/request-details/:id" element={<ProtectedRoute><PickupDetails /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['user']}><UserSettings /></ProtectedRoute>} />
        
        {/* Recycler Routes */}
        <Route path="/recycler-dashboard" element={<ProtectedRoute allowedRoles={['recycler']}><RecyclerDashboard /></ProtectedRoute>} />
        <Route path="/processing-center" element={<ProtectedRoute allowedRoles={['recycler']}><ProcessingCenter /></ProtectedRoute>} />
        <Route path="/recycling-records" element={<ProtectedRoute allowedRoles={['recycler']}><RecyclingRecords /></ProtectedRoute>} />
        <Route path="/recycler-materials" element={<ProtectedRoute allowedRoles={['recycler']}><RecoveryMaterials userType="recycler" /></ProtectedRoute>} />
        <Route path="/recycler-settings" element={<ProtectedRoute allowedRoles={['recycler']}><UserSettings /></ProtectedRoute>} />
        
        {/* Collector Routes */}
        <Route path="/collector-dashboard" element={<ProtectedRoute allowedRoles={['collector']}><CollectorDashboard /></ProtectedRoute>} />
        <Route path="/collection-routes" element={<ProtectedRoute allowedRoles={['collector']}><CollectionRoutes /></ProtectedRoute>} />
        <Route path="/my-collections" element={<ProtectedRoute allowedRoles={['collector']}><MyCollections /></ProtectedRoute>} />
        <Route path="/collector-settings" element={<ProtectedRoute allowedRoles={['collector']}><UserSettings /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/pickup-assignments" element={<ProtectedRoute allowedRoles={['admin']}><PickupAssignmentManagement /></ProtectedRoute>} />
        <Route path="/admin-materials" element={<ProtectedRoute allowedRoles={['admin']}><RecoveryMaterials userType="admin" /></ProtectedRoute>} />
        <Route path="/admin-settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}