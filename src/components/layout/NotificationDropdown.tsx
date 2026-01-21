import React, { useState } from 'react';
import { Bell, X, Check, AlertTriangle, TrendingUp, Target, Brain } from 'lucide-react';
import { Notification } from '../../hooks/useNotifications';
import { Button } from '../ui/Button';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
}

/**
 * NotificationDropdown component that displays a bell icon with notification count
 * and shows a dropdown with all notifications when clicked
 * @param notifications - Array of notification objects to display
 * @param unreadCount - Number of unread notifications for badge display
 * @param onMarkAsRead - Function to mark a specific notification as read
 * @param onMarkAllAsRead - Function to mark all notifications as read
 * @param onClearNotification - Function to remove a specific notification
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification
}) => {
  // Track dropdown open/closed state
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Returns the appropriate icon component based on notification type
   * @param type - The type of notification (budget, large_transaction, etc.)
   * @returns JSX element with the corresponding icon
   */
  const getIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <Target className="w-4 h-4" />;
      case 'large_transaction':
        return <AlertTriangle className="w-4 h-4" />;
      case 'weekly_report':
        return <TrendingUp className="w-4 h-4" />;
      case 'insight':
        return <Brain className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  /**
   * Returns CSS classes for text and background color based on notification priority
   * @param priority - The priority level (high, medium, low)
   * @returns String of CSS classes for styling
   */
  const getColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  /**
   * Formats a date into a human-readable relative time string
   * @param date - The date to format
   * @returns Formatted time string (e.g., "Just now", "2h ago", "3d ago")
   */
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="relative">
      {/* Bell icon button with notification badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {/* Red badge showing unread count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Invisible overlay to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown container */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Dropdown header with title and "Mark all read" button */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {/* Only show "Mark all read" if there are unread notifications */}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {/* Scrollable notifications list */}
            <div className="max-h-80 overflow-y-auto">
              {/* Show empty state if no notifications */}
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                // Render each notification
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Notification icon with priority-based styling */}
                      <div className={`p-2 rounded-lg ${getColor(notification.priority)}`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Notification title and clear button */}
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => onClearNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Notification message */}
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        {/* Footer with timestamp and mark as read button */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          {/* Only show "Mark as read" for unread notifications */}
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};