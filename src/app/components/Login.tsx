import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Leaf, ArrowRight, User, Recycle, Shield, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type UserType = 'user' | 'recycler' | 'admin' | 'collector';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<UserType>('user');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to appropriate dashboard based on user type
    switch (activeTab) {
      case 'user':
        navigate('/dashboard');
        break;
      case 'recycler':
        navigate('/recycler-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'collector':
        navigate('/collector-dashboard');
        break;
    }
  };

  const tabs = [
    { type: 'user' as UserType, label: 'User', icon: User },
    { type: 'recycler' as UserType, label: 'Recycler', icon: Recycle },
    { type: 'collector' as UserType, label: 'Collector', icon: Truck },
    { type: 'admin' as UserType, label: 'Admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Tabs for User Type Selection */}
          <div className="flex flex-wrap gap-2 mb-6 bg-muted p-1 rounded-lg">
            {tabs.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all ${
                  activeTab === type
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input-background"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}