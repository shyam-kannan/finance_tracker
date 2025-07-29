import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Simulate checking for stored auth
    const storedUser = localStorage.getItem('finance_user');
    const storedSettings = localStorage.getItem('finance_settings');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract name from email (before @)
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const user = {
      id: '1',
      email,
      name: nameFromEmail,
    };
    setUser(user);
    localStorage.setItem('finance_user', JSON.stringify(user));
    
    // Auto-fill settings with user info
    const defaultSettings = {
      profile: {
        name: nameFromEmail,
        email: email,
        phone: '',
      },
      notifications: {
        budgetAlerts: true,
        weeklyReports: true,
        largeTransactions: false,
        monthlyInsights: true,
      },
      privacy: {
        dataAnalytics: true,
        receiptStorage: true,
      },
      appearance: {
        theme: 'light',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
      },
      apiKeys: {
        gemini: '',
      },
    };
    
    // Only set default settings if none exist
    if (!localStorage.getItem('finance_settings')) {
      localStorage.setItem('finance_settings', JSON.stringify(defaultSettings));
    }
    
    return user;
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = {
      id: '1',
      email,
      name,
    };
    setUser(user);
    localStorage.setItem('finance_user', JSON.stringify(user));
    
    // Auto-fill settings with registration info
    const defaultSettings = {
      profile: {
        name: name,
        email: email,
        phone: '',
      },
      notifications: {
        budgetAlerts: true,
        weeklyReports: true,
        largeTransactions: false,
        monthlyInsights: true,
      },
      privacy: {
        dataAnalytics: true,
        receiptStorage: true,
      },
      appearance: {
        theme: 'light',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
      },
      apiKeys: {
        gemini: '',
      },
    };
    
    localStorage.setItem('finance_settings', JSON.stringify(defaultSettings));
    
    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_user');
  };

  return { user, loading, login, register, logout };
};