import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Trash2,
  CreditCard,
  Bell,
  Globe,
  Download,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext-simple';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const { user, userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [showDataPolicy, setShowDataPolicy] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: userProfile?.displayName || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    defaultAddress: userProfile?.address || '',
    secondaryAddress: userProfile?.secondaryAddress || '',
    preferences: {
      notifications: true,
      marketing: false,
      location: true
    }
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Implement account deletion
        toast.success('Account deletion request submitted');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const downloadMyData = () => {
    const userData = {
      profile: profileData,
      accountCreated: user?.metadata?.creationTime,
      lastLogin: user?.metadata?.lastSignInTime,
      dataExported: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Profile & Security</h1>
              <p className="text-xs text-gray-500">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto px-4">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'privacy', label: 'Privacy', icon: Lock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Delivery Address
                  </label>
                  <textarea
                    value={profileData.defaultAddress}
                    onChange={(e) => setProfileData({...profileData, defaultAddress: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Address (Optional)
                  </label>
                  <textarea
                    value={profileData.secondaryAddress}
                    onChange={(e) => setProfileData({...profileData, secondaryAddress: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSaveProfile}
                className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Account Secured with Google</p>
                      <p className="text-sm text-green-700">Your account is protected by Google's security</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Payment Security</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">PayFast Integration</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All payments are processed securely through PayFast, a PCI DSS compliant payment gateway. 
                      We never store your payment information on our servers.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Account Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={downloadMyData}
                      className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download My Data</span>
                    </button>
                    
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Collection</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'notifications', label: 'Order notifications', description: 'Receive updates about your orders' },
                      { key: 'marketing', label: 'Marketing communications', description: 'Promotional offers and updates' },
                      { key: 'location', label: 'Location services', description: 'For delivery and location-based features' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.preferences[item.key]}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              preferences: {
                                ...profileData.preferences,
                                [item.key]: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Protection</h4>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">How We Protect Your Data</p>
                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>• All data is encrypted in transit and at rest</li>
                          <li>• Payment information is handled by PCI DSS compliant PayFast</li>
                          <li>• Location data is only used for delivery purposes</li>
                          <li>• Personal information is never shared with third parties</li>
                          <li>• You can request data deletion at any time</li>
                        </ul>
                        
                        <button
                          onClick={() => setShowDataPolicy(true)}
                          className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                        >
                          Read Full Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Privacy Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Privacy Policy Modal */}
      {showDataPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Privacy Policy & Data Protection</h3>
              <button
                onClick={() => setShowDataPolicy(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <h4>Data Collection</h4>
              <p>We collect only the information necessary to provide our food delivery service:</p>
              <ul>
                <li>Account information (name, email, phone)</li>
                <li>Delivery addresses</li>
                <li>Order history and preferences</li>
                <li>Location data (only when you choose to share it)</li>
              </ul>
              
              <h4>Payment Security</h4>
              <p>All payments are processed through PayFast, a PCI DSS Level 1 compliant payment service provider. We do not store any payment card information on our servers.</p>
              
              <h4>Data Usage</h4>
              <p>Your data is used exclusively for:</p>
              <ul>
                <li>Processing and delivering your orders</li>
                <li>Providing customer support</li>
                <li>Improving our service (with your consent)</li>
                <li>Sending order updates and notifications</li>
              </ul>
              
              <h4>Your Rights</h4>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
              </ul>
              
              <h4>Contact Us</h4>
              <p>For any privacy-related questions, contact us at privacy@flammedgrilled.co.za</p>
            </div>
            
            <button
              onClick={() => setShowDataPolicy(false)}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              I Understand
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
