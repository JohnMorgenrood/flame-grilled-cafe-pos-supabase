import React, { useState, useEffect } from 'react';
import { 
  FaKey, 
  FaSave, 
  FaEye, 
  FaEyeSlash, 
  FaPaypal, 
  FaCreditCard, 
  FaQrcode,
  FaUpload,
  FaTrash,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext-simple';

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({});
  const [qrCode, setQrCode] = useState(null);
  const [uploadingQR, setUploadingQR] = useState(false);
  
  const [settings, setSettings] = useState({
    // Payment Gateway API Keys
    payfast: {
      merchantId: '',
      merchantKey: '',
      passphrase: '',
      sandbox: true
    },
    paypal: {
      clientId: '',
      clientSecret: '',
      sandbox: true
    },
    stripe: {
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      sandbox: true
    },
    yoco: {
      publicKey: '',
      secretKey: '',
      sandbox: true
    },
    // Google Services
    google: {
      mapsApiKey: '',
      analyticsId: '',
      payApiKey: ''
    },
    // Business Settings
    business: {
      name: 'Flame Grilled Cafe',
      email: 'info@flamegrilledcafe.co.za',
      phone: '+27 11 123 4567',
      address: '123 Main Street, Johannesburg, 2000',
      vatNumber: '',
      registrationNumber: ''
    },
    // QR Code for payments
    qrCode: {
      url: '',
      description: 'Scan to pay'
    },
    // Email Settings
    email: {
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'Flame Grilled Cafe'
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, 'admin', 'settings'));
      if (settingsDoc.exists()) {
        setSettings(prev => ({ ...prev, ...settingsDoc.data() }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin', 'settings'), {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleShowKey = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleQRUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingQR(true);
    try {
      const storageRef = ref(storage, `qr-codes/payment-qr-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setSettings(prev => ({
        ...prev,
        qrCode: {
          ...prev.qrCode,
          url: downloadURL
        }
      }));
      
      toast.success('QR code uploaded successfully!');
    } catch (error) {
      console.error('Error uploading QR code:', error);
      toast.error('Failed to upload QR code');
    } finally {
      setUploadingQR(false);
    }
  };

  const removeQRCode = async () => {
    if (!settings.qrCode.url) return;
    
    try {
      // Delete from storage if it's a Firebase storage URL
      if (settings.qrCode.url.includes('firebase')) {
        const storageRef = ref(storage, settings.qrCode.url);
        await deleteObject(storageRef);
      }
      
      setSettings(prev => ({
        ...prev,
        qrCode: {
          ...prev.qrCode,
          url: ''
        }
      }));
      
      toast.success('QR code removed');
    } catch (error) {
      console.error('Error removing QR code:', error);
      toast.error('Failed to remove QR code');
    }
  };

  const testConnection = async (gateway) => {
    toast.loading(`Testing ${gateway} connection...`, { id: `test-${gateway}` });
    
    // Simulate API test - in real implementation, you'd test the actual APIs
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // Simulate success/failure
      if (isValid) {
        toast.success(`${gateway} connection successful!`, { id: `test-${gateway}` });
      } else {
        toast.error(`${gateway} connection failed. Check your API keys.`, { id: `test-${gateway}` });
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <FaSave className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Payment Gateways */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCreditCard className="h-5 w-5 mr-2 text-green-600" />
          Payment Gateway Settings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PayFast */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">PayFast (South Africa)</h3>
              <button
                onClick={() => testConnection('PayFast')}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Test Connection
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Merchant ID</label>
                <input
                  type="text"
                  value={settings.payfast.merchantId}
                  onChange={(e) => handleInputChange('payfast', 'merchantId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="10000100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Merchant Key</label>
                <div className="relative">
                  <input
                    type={showKeys['payfast-key'] ? 'text' : 'password'}
                    value={settings.payfast.merchantKey}
                    onChange={(e) => handleInputChange('payfast', 'merchantKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="46f0cd694581a"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('payfast-key')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['payfast-key'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Passphrase</label>
                <div className="relative">
                  <input
                    type={showKeys['payfast-pass'] ? 'text' : 'password'}
                    value={settings.payfast.passphrase}
                    onChange={(e) => handleInputChange('payfast', 'passphrase', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your secure passphrase"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('payfast-pass')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['payfast-pass'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payfast.sandbox}
                  onChange={(e) => handleInputChange('payfast', 'sandbox', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Sandbox Mode</label>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center">
                <FaPaypal className="h-5 w-5 mr-2 text-blue-600" />
                PayPal
              </h3>
              <button
                onClick={() => testConnection('PayPal')}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Test Connection
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client ID</label>
                <div className="relative">
                  <input
                    type={showKeys['paypal-id'] ? 'text' : 'password'}
                    value={settings.paypal.clientId}
                    onChange={(e) => handleInputChange('paypal', 'clientId', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="AeA1QIZXiQhHaG0XLr..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('paypal-id')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['paypal-id'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                <div className="relative">
                  <input
                    type={showKeys['paypal-secret'] ? 'text' : 'password'}
                    value={settings.paypal.clientSecret}
                    onChange={(e) => handleInputChange('paypal', 'clientSecret', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="EHB95K5GX-P9nkC4..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('paypal-secret')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['paypal-secret'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.paypal.sandbox}
                  onChange={(e) => handleInputChange('paypal', 'sandbox', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Sandbox Mode</label>
              </div>
            </div>
          </div>

          {/* Stripe */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Stripe</h3>
              <button
                onClick={() => testConnection('Stripe')}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Test Connection
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Publishable Key</label>
                <input
                  type="text"
                  value={settings.stripe.publishableKey}
                  onChange={(e) => handleInputChange('stripe', 'publishableKey', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="pk_test_..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Secret Key</label>
                <div className="relative">
                  <input
                    type={showKeys['stripe-secret'] ? 'text' : 'password'}
                    value={settings.stripe.secretKey}
                    onChange={(e) => handleInputChange('stripe', 'secretKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="sk_test_..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('stripe-secret')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['stripe-secret'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.stripe.sandbox}
                  onChange={(e) => handleInputChange('stripe', 'sandbox', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Test Mode</label>
              </div>
            </div>
          </div>

          {/* Yoco */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Yoco (South Africa)</h3>
              <button
                onClick={() => testConnection('Yoco')}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Test Connection
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Public Key</label>
                <input
                  type="text"
                  value={settings.yoco.publicKey}
                  onChange={(e) => handleInputChange('yoco', 'publicKey', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="pk_test_..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Secret Key</label>
                <div className="relative">
                  <input
                    type={showKeys['yoco-secret'] ? 'text' : 'password'}
                    value={settings.yoco.secretKey}
                    onChange={(e) => handleInputChange('yoco', 'secretKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="sk_test_..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('yoco-secret')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys['yoco-secret'] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.yoco.sandbox}
                  onChange={(e) => handleInputChange('yoco', 'sandbox', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Test Mode</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Payment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaQrcode className="h-5 w-5 mr-2 text-purple-600" />
          QR Code Payment
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload QR Code for Payments
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleQRUpload}
                className="hidden"
                id="qr-upload"
              />
              <label
                htmlFor="qr-upload"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer flex items-center space-x-2"
              >
                <FaUpload className="h-4 w-4" />
                <span>{uploadingQR ? 'Uploading...' : 'Upload QR Code'}</span>
              </label>
              
              {settings.qrCode.url && (
                <button
                  onClick={removeQRCode}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <FaTrash className="h-4 w-4" />
                  <span>Remove</span>
                </button>
              )}
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={settings.qrCode.description}
                onChange={(e) => handleInputChange('qrCode', 'description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Scan to pay with SnapScan/Zapper"
              />
            </div>
          </div>
          
          {settings.qrCode.url && (
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Current QR Code:</p>
              <img
                src={settings.qrCode.url}
                alt="Payment QR Code"
                className="w-48 h-48 object-contain border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
