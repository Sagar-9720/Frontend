import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  MapPin,
  Route, 
  Calendar, 
  BookOpen,
  Globe,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_STRINGS, NAVIGATION_STRINGS, BUTTON_STRINGS } from '../../utils';
import ROUTES from '../../routes/routes';

const navigation = [
  { name: NAVIGATION_STRINGS.DASHBOARD, href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: NAVIGATION_STRINGS.SUB_ADMINS, href: ROUTES.SUB_ADMINS, icon: UserCheck },
  { name: NAVIGATION_STRINGS.USERS, href: ROUTES.USERS, icon: Users },
  { name: NAVIGATION_STRINGS.REGIONS, href: ROUTES.REGIONS, icon: Globe },
  { name: NAVIGATION_STRINGS.DESTINATIONS, href: ROUTES.DESTINATIONS, icon: MapPin },
  { name: NAVIGATION_STRINGS.TRIPS, href: ROUTES.TRIPS, icon: Route },
  { name: NAVIGATION_STRINGS.ITINERARIES, href: ROUTES.ITINERARIES, icon: Calendar },
  { name: NAVIGATION_STRINGS.TRAVEL_JOURNALS, href: ROUTES.TRAVEL_JOURNALS, icon: BookOpen },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();
  const handleLogout = async () => {
    try {
      await auth?.logout?.();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col w-64 bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] h-full border-r border-[var(--color-border)]">
      <div className="flex items-center justify-center h-16 bg-[var(--color-sidebar-header)] border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-[var(--color-sidebar-text)]">{APP_STRINGS.APP_NAME}</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-sidebar-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-text)]'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-[var(--color-sidebar-text-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-text)] transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {BUTTON_STRINGS.LOGOUT}
        </button>
      </div>
    </div>
  );
};