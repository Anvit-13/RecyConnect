import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Phone, MapPin, Building2, Lock, Leaf, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join us in making a sustainable impact</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-foreground">City</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-foreground">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 bg-input-background"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-input-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-border" required />
              <label className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
