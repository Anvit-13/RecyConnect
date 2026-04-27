import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Layout } from './Layout';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { toast } from 'sonner';

export function UserSettings() {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  
  // Determine user type based on current route
  const getUserType = () => {
    if (location.pathname.includes('recycler')) return 'recycler';
    if (location.pathname.includes('collector')) return 'collector';
    if (location.pathname.includes('admin')) return 'admin';
    return 'user';
  };

  const userType = getUserType();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    setLoading(true);
    
    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      toast.success('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout userType={userType}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="max-w-4xl">
          {/* Profile Information */}
          <Card className="border border-border shadow-sm mb-6">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground">Profile Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-input-background"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-input-background"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-input-background"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-input-background"
                    disabled={!isEditing}
                    required
                  />
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-foreground">
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="bg-input-background"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-foreground">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="bg-input-background"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-foreground">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-input-background"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
