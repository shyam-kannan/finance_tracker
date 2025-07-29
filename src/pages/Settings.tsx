import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Download, Upload, Trash2, Eye, EyeOff, Save, RefreshCw, Camera, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useSettings } from '../hooks/useSettings';

export const Settings: React.FC = () => {
  const { settings, updateProfile, updateNotifications, updatePrivacy, updateAppearance, updateApiKeys, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('profile');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Download }
  ];

  const handleSave = async (updateFn: () => void) => {
    setSaveStatus('saving');
    updateFn();
    
    // Simulate save delay for better UX
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    updateNotifications({
      [key]: !settings.notifications[key]
    });
  };

  const handlePrivacyToggle = (key: keyof typeof settings.privacy) => {
    updatePrivacy({
      [key]: !settings.privacy[key]
    });
  };

  const handleExportData = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('finance_budgets') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.transactions) {
          localStorage.setItem('finance_transactions', JSON.stringify(data.transactions));
        }
        if (data.budgets) {
          localStorage.setItem('finance_budgets', JSON.stringify(data.budgets));
        }
        if (data.settings) {
          localStorage.setItem('finance_settings', JSON.stringify(data.settings));
        }
        
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    localStorage.removeItem('finance_transactions');
    localStorage.removeItem('finance_budgets');
    localStorage.removeItem('finance_settings');
    localStorage.removeItem('finance_user');
    setIsDeleteModalOpen(false);
    window.location.reload();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile({ avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$'
    };
    return symbols[currency as keyof typeof symbols] || '$';
  };

  const formatDate = (date: Date, format: string) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {settings.profile.avatar ? (
                <img
                  src={settings.profile.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Full Name"
                value={settings.profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => updateProfile({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <Button
            onClick={() => handleSave(() => {})}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKeys.gemini}
                onChange={(e) => updateApiKeys({ gemini: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Gemini API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Get your free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {[
          { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Get notified when approaching budget limits' },
          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly spending summaries' },
          { key: 'largeTransactions', label: 'Large Transaction Alerts', description: 'Alert for transactions over $100' },
          { key: 'monthlyInsights', label: 'Monthly AI Insights', description: 'Get monthly AI-powered financial insights' }
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{label}</h4>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
              onClick={() => handleNotificationToggle(key as keyof typeof settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications[key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications[key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Data Analytics</h4>
              <p className="text-sm text-gray-500">Allow anonymous usage analytics to improve the app</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle('dataAnalytics')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.dataAnalytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy.dataAnalytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Receipt Storage</h4>
              <p className="text-sm text-gray-500">Store receipt images locally for future reference</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle('receiptStorage')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.receiptStorage ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy.receiptStorage ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <Shield className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Enable Two-Factor Authentication
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSection = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'auto'].map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => updateAppearance({ theme: themeOption as any })}
                className={`p-4 border-2 rounded-lg text-center capitalize transition-colors ${
                  settings.appearance.theme === themeOption
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
          <select
            value={settings.appearance.currency}
            onChange={(e) => updateAppearance({ currency: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Preview: {getCurrencySymbol(settings.appearance.currency)}123.45
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Date Format</label>
          <select
            value={settings.appearance.dateFormat}
            onChange={(e) => updateAppearance({ dateFormat: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Preview: {formatDate(new Date(), settings.appearance.dateFormat)}
          </p>
        </div>
      </div>
    </Card>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          
          <div className="relative">
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsResetModalOpen(true)}
            className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset All Settings
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Transactions</span>
            <span className="text-sm font-medium">
              {JSON.parse(localStorage.getItem('finance_transactions') || '[]').length} items
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Budgets</span>
            <span className="text-sm font-medium">
              {JSON.parse(localStorage.getItem('finance_budgets') || '[]').length} items
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Settings</span>
            <span className="text-sm font-medium">
              {localStorage.getItem('finance_settings') ? '1 profile' : '0 profiles'}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center font-medium">
            <span>Total Items</span>
            <span>
              {JSON.parse(localStorage.getItem('finance_transactions') || '[]').length + 
               JSON.parse(localStorage.getItem('finance_budgets') || '[]').length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Card padding="none">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>
          <nav className="p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeSection === 'profile' && renderProfileSection()}
        {activeSection === 'notifications' && renderNotificationsSection()}
        {activeSection === 'privacy' && renderPrivacySection()}
        {activeSection === 'appearance' && renderAppearanceSection()}
        {activeSection === 'data' && renderDataSection()}
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This will export all your transactions, budgets, and settings as a JSON file.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete All Data"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">⚠️ This action cannot be undone!</p>
            <p className="text-red-700 text-sm mt-1">
              All your transactions, budgets, and settings will be permanently deleted.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAllData}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Settings Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Settings"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 font-medium">⚠️ Reset all settings to default</p>
            <p className="text-orange-700 text-sm mt-1">
              This will reset your profile, notifications, privacy, and appearance settings to their default values.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                resetSettings();
                setIsResetModalOpen(false);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};