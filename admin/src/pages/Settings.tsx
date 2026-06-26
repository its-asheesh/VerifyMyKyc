import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Check,
  Server
} from 'lucide-react'
import systemApi from '../services/api/systemApi'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  // Maintenance Settings State
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    maintenanceMode: false,
    maintenanceTitle: 'Scheduled Maintenance',
    maintenanceMessage: 'We are currently upgrading our systems. Please check back shortly.',
    estimatedEndTime: '',
    showCountdown: false
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (activeTab === 'maintenance') {
      const fetchSettings = async () => {
        setIsLoadingSettings(true)
        setSettingsMessage(null)
        try {
          const settings = await systemApi.getSettings()
          let formattedTime = ''
          if (settings.estimatedEndTime) {
            const date = new Date(settings.estimatedEndTime)
            const offset = date.getTimezoneOffset()
            const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
            formattedTime = adjustedDate.toISOString().slice(0, 16)
          }
          
          setMaintenanceSettings({
            maintenanceMode: settings.maintenanceMode,
            maintenanceTitle: settings.maintenanceTitle,
            maintenanceMessage: settings.maintenanceMessage,
            estimatedEndTime: formattedTime,
            showCountdown: settings.showCountdown
          })
        } catch (error) {
          console.error('Failed to load settings:', error)
        } finally {
          setIsLoadingSettings(false)
        }
      }
      fetchSettings()
    }
  }, [activeTab])

  const handleSaveMaintenance = async () => {
    setIsSavingSettings(true)
    setSettingsMessage(null)
    try {
      const payload = {
        ...maintenanceSettings,
        estimatedEndTime: maintenanceSettings.estimatedEndTime ? new Date(maintenanceSettings.estimatedEndTime).toISOString() : null
      }
      await systemApi.updateSettings(payload)
      setSettingsMessage({ text: 'Maintenance mode settings saved successfully.', type: 'success' })
    } catch (error: any) {
      setSettingsMessage({ text: error.message || 'Failed to save maintenance settings.', type: 'error' })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'maintenance', name: 'Maintenance Mode', icon: Server }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="User"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="admin@verifymykyc.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Update Security
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'integrations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Digilocker Integration</h3>
                    <p className="text-sm text-gray-500">Connect with Digilocker for document verification</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Mode Settings</h2>
            
            {isLoadingSettings ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {settingsMessage && (
                  <div className={`p-4 rounded-lg border ${
                    settingsMessage.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {settingsMessage.text}
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable Maintenance Mode</h3>
                    <p className="text-sm text-gray-500">
                      When active, blocks all public users and client-facing API requests with an HTTP 503 response.
                    </p>
                  </div>
                  <button
                    onClick={() => setMaintenanceSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      maintenanceSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      maintenanceSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Title</label>
                    <input
                      type="text"
                      value={maintenanceSettings.maintenanceTitle}
                      onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, maintenanceTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      placeholder="e.g. Scheduled Maintenance"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                    <textarea
                      rows={3}
                      value={maintenanceSettings.maintenanceMessage}
                      onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      placeholder="Explain to users why the site is offline and when it will be back."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Restoration Time (Local Time)</label>
                      <input
                        type="datetime-local"
                        value={maintenanceSettings.estimatedEndTime}
                        onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, estimatedEndTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      />
                    </div>

                    <div className="flex items-end pb-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={maintenanceSettings.showCountdown}
                          onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, showCountdown: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Show Countdown Clock to Users</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveMaintenance}
                    disabled={isSavingSettings}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSavingSettings ? 'Saving...' : 'Save Maintenance Settings'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Settings 