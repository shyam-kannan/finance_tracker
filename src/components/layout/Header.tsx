import React from 'react';
import { Search, User } from 'lucide-react';
import { User as UserType } from '../../types';
import { useSettings } from '../../hooks/useSettings';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';
import { Transaction, Budget } from '../../types';

interface HeaderProps {
  user: UserType;
  title: string;
  transactions: Transaction[];
  budgets: Budget[];
}

/**
 * Header component that displays the main navigation bar
 * @param user - User object containing basic user information
 * @param title - Page title to display in the header
 * @param transactions - Array of transactions for notification processing
 * @param budgets - Array of budgets for notification processing
 * @returns JSX element representing the application header
 */
export const Header: React.FC<HeaderProps> = ({ user, title, transactions, budgets }) => {
  const { settings } = useSettings();
  // Get notifications data and handlers from custom hook
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications(transactions, budgets);
  
  // Use settings profile info if available, fallback to user
  const displayName = settings.profile.name || user.name;
  const displayEmail = settings.profile.email || user.email;
  const displayAvatar = settings.profile.avatar || user.avatar;
  
  /**
   * Returns the appropriate currency symbol based on user settings
   * @returns Currency symbol string
   */
  const getCurrencySymbol = () => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$'
    };
    return symbols[settings.appearance.currency] || '$';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: Page title and welcome message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">Welcome back, {displayName}!</p>
        </div>

        {/* Right side: Search, notifications, and user profile */}
        <div className="flex items-center space-x-4">
          {/* Search input with icon */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors w-64"
            />
          </div>

          {/* Notification dropdown component */}
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClearNotification={clearNotification}
          />

          {/* User profile section with avatar and info */}
          <div className="flex items-center space-x-3">
            {/* Display custom avatar or default user icon */}
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            {/* User name and email - hidden on mobile */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{displayEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};