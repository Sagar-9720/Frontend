import React, { useState } from 'react';
import { Bell, Search, ChevronDown, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { NAVIGATION_STRINGS, BUTTON_STRINGS, PLACEHOLDER_STRINGS, stringHelpers } from '../../utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/settings');
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
  };

  const userInitials = user?.name ? stringHelpers.initials(user.name) : 'U';

  return (
    <div className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-4 h-4" />
            <input
              type="text"
              placeholder={PLACEHOLDER_STRINGS.SEARCH}
              className="pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-[var(--radius-md)] hover:bg-[var(--color-surface)]"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-[var(--radius-md)] hover:bg-[var(--color-surface)]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userInitials}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-lg ring-1 ring-[var(--color-border)] z-50">
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    {NAVIGATION_STRINGS.PROFILE}
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    {NAVIGATION_STRINGS.SETTINGS}
                  </button>
                  <hr className="my-1 border-[var(--color-border)]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    {BUTTON_STRINGS.SIGN_OUT}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};