import { useState, useEffect } from 'react';

export interface AppSettings {
  // Profile
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  
  // Notifications
  notifications: {
    budgetAlerts: boolean;
    weeklyReports: boolean;
    largeTransactions: boolean;
    monthlyInsights: boolean;
  };
  
  // Privacy
  privacy: {
    dataAnalytics: boolean;
    receiptStorage: boolean;
  };
  
  // Appearance
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  };
  
  // API Keys
  apiKeys: {
    gemini: string;
  };
}

const defaultSettings: AppSettings = {
  profile: {
    name: 'John Doe',
    email: 'john@example.com',
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

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('finance_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('finance_settings', JSON.stringify(updatedSettings));
  };

  const updateProfile = (profile: Partial<AppSettings['profile']>) => {
    updateSettings({
      profile: { ...settings.profile, ...profile }
    });
  };

  const updateNotifications = (notifications: Partial<AppSettings['notifications']>) => {
    updateSettings({
      notifications: { ...settings.notifications, ...notifications }
    });
  };

  const updatePrivacy = (privacy: Partial<AppSettings['privacy']>) => {
    updateSettings({
      privacy: { ...settings.privacy, ...privacy }
    });
  };

  const updateAppearance = (appearance: Partial<AppSettings['appearance']>) => {
    updateSettings({
      appearance: { ...settings.appearance, ...appearance }
    });
    
    // Apply theme changes immediately
    if (appearance.theme) {
      applyTheme(appearance.theme);
    }
  };

  const updateApiKeys = (apiKeys: Partial<AppSettings['apiKeys']>) => {
    updateSettings({
      apiKeys: { ...settings.apiKeys, ...apiKeys }
    });
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('finance_settings');
  };

  return {
    settings,
    isLoading,
    updateProfile,
    updateNotifications,
    updatePrivacy,
    updateAppearance,
    updateApiKeys,
    resetSettings,
  };
};