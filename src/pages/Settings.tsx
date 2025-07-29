import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Download, Upload, Trash2, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: true,
    largeTransactions: false,
    monthlyInsights: true
  });
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('USD');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Download }
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('finance_budgets') || '[]'),
      exportDate: new Date().toISOString()
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

  const handleDeleteAllData = () => {
    localStorage.removeItem('finance_transactions');
    localStorage.removeItem('finance_budgets');
    localStorage.removeItem('finance_user');
    setIsDeleteModalOpen(false);
    window.location.reload();
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
              onClick={() => handleNotificationChange(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
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
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Receipt Storage</h4>
              <p className="text-sm text-gray-500">Store receipt images locally for future reference</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
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
                onClick={() => setTheme(themeOption)}
                className={`p-4 border-2 rounded-lg text-center capitalize transition-colors ${
                  theme === themeOption
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
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Date Format</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
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
          
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Transactions</span>
            <span className="text-sm font-medium">2.3 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Receipt Images</span>
            <span className="text-sm font-medium">15.7 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Budgets & Settings</span>
            <span className="text-sm font-medium">0.1 MB</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center font-medium">
            <span>Total Usage</span>
            <span>18.1 MB</span>
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
    </div>
  );
};