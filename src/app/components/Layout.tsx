import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package, 
  Truck, 
  Recycle, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Leaf,
  Wrench
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  userType?: 'user' | 'recycler' | 'admin' | 'collector';
}

export function Layout({ children, userType = 'user' }: LayoutProps) {
  const location = useLocation();

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit-pickup', icon: PackagePlus, label: 'Submit Pickup' },
    { to: '/my-requests', icon: Package, label: 'My Requests' },
  ];

  const recyclerLinks = [
    { to: '/recycler-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/processing-center', icon: Wrench, label: 'Processing' },
    { to: '/recycling-records', icon: Recycle, label: 'Records' },
    { to: '/recycler-materials', icon: BarChart3, label: 'Materials' },
  ];

  const collectorLinks = [
    { to: '/collector-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/collection-routes', icon: Truck, label: 'Routes' },
    { to: '/my-collections', icon: Package, label: 'Collections' },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user-management', icon: Users, label: 'Users' },
    { to: '/pickup-assignments', icon: Truck, label: 'Assignments' },
    { to: '/admin-materials', icon: BarChart3, label: 'Materials' },
  ];

  const links = userType === 'admin' ? adminLinks : userType === 'recycler' ? recyclerLinks : userType === 'collector' ? collectorLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border fixed left-0 top-0 bottom-0 flex flex-col shadow-sm">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-foreground">E-Waste</h2>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link
            to={
              userType === 'admin' 
                ? '/admin-settings' 
                : userType === 'recycler' 
                ? '/recycler-settings'
                : userType === 'collector'
                ? '/collector-settings'
                : '/settings'
            }
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}