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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/submit-pickup" element={<SubmitPickup />} />
        <Route path="/my-requests" element={<MyPickupRequests />} />
        <Route path="/request-details/:id" element={<PickupDetails />} />
        <Route path="/settings" element={<UserSettings />} />
        
        {/* Recycler Routes */}
        <Route path="/recycler-dashboard" element={<RecyclerDashboard />} />
        <Route path="/processing-center" element={<ProcessingCenter />} />
        <Route path="/recycling-records" element={<RecyclingRecords />} />
        <Route path="/recycler-materials" element={<RecoveryMaterials userType="recycler" />} />
        <Route path="/recycler-settings" element={<UserSettings />} />
        
        {/* Collector Routes */}
        <Route path="/collector-dashboard" element={<CollectorDashboard />} />
        <Route path="/collection-routes" element={<CollectionRoutes />} />
        <Route path="/my-collections" element={<MyCollections />} />
        <Route path="/collector-settings" element={<UserSettings />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/pickup-assignments" element={<PickupAssignmentManagement />} />
        <Route path="/admin-materials" element={<RecoveryMaterials userType="admin" />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}