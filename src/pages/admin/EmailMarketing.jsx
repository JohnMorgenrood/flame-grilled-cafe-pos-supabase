import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaUsers, 
  FaPaperPlane,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/supabase';

const EmailMarketing = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    template: 'custom'
  });

  const [templates] = useState([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Flame Grilled Cafe!',
      message: `Dear {{name}},

Welcome to Flame Grilled Cafe! We're excited to have you as part of our family.

As a welcome gift, enjoy 15% off your next order with code: WELCOME15

Visit us at: {{address}}
Order online: {{website}}

Best regards,
The Flame Grilled Cafe Team`
    },
    {
      id: 'promotion',
      name: 'Promotional Email',
      subject: '🔥 Special Offer Just for You!',
      message: `Hi {{name}},

Don't miss out on our amazing offer!

🍔 Get 20% off all burgers this week
🍟 Free fries with any meal
🥤 Buy 2 drinks, get 1 free

Use code: SAVE20

Order now: {{website}}
Valid until: {{date}}

Flame Grilled Cafe Team`
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      subject: 'What\'s New at Flame Grilled Cafe',
      message: `Hello {{name}},

Here's what's happening at Flame Grilled Cafe:

✨ NEW MENU ITEMS
Try our new signature burgers and loaded fries

📅 UPCOMING EVENTS
Family BBQ Day - This Saturday
Live Music Night - Every Friday

🎁 LOYALTY REWARDS
Earn points with every order and get free meals

Stay connected: {{social}}

Best regards,
Flame Grilled Cafe`
    }
  ]);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, filter, searchTerm]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const customerList = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email) {
          customerList.push({
            id: doc.id,
            ...userData,
            lastOrder: userData.lastOrderDate || null,
            totalOrders: userData.totalOrders || 0
          });
        }
      });

      setCustomers(customerList);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(customer => {
          const lastOrder = customer.lastOrder;
          if (!lastOrder) return false;
          const daysSinceLastOrder = (Date.now() - new Date(lastOrder).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceLastOrder <= 30;
        });
        break;
      case 'inactive':
        filtered = filtered.filter(customer => {
          const lastOrder = customer.lastOrder;
          if (!lastOrder) return true;
          const daysSinceLastOrder = (Date.now() - new Date(lastOrder).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceLastOrder > 30;
        });
        break;
      case 'loyal':
        filtered = filtered.filter(customer => customer.totalOrders >= 5);
        break;
      case 'new':
        filtered = filtered.filter(customer => customer.totalOrders <= 1);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    setFilteredCustomers(filtered);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const handleTemplateSelect = (template) => {
    setEmailData({
      subject: template.subject,
      message: template.message,
      template: template.id
    });
  };

  const previewEmail = (customer) => {
    let preview = emailData.message;
    preview = preview.replace(/{{name}}/g, customer.displayName || 'Valued Customer');
    preview = preview.replace(/{{email}}/g, customer.email);
    preview = preview.replace(/{{address}}/g, '123 Main Street, Johannesburg');
    preview = preview.replace(/{{website}}/g, 'https://flame-grilled-cafe-pos.web.app');
    preview = preview.replace(/{{social}}/g, '@flamegrilledcafe');
    preview = preview.replace(/{{date}}/g, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString());
    
    return preview;
  };

  const sendBulkEmail = async () => {
    if (!emailData.subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }
    if (!emailData.message.trim()) {
      toast.error('Please enter an email message');
      return;
    }
    if (selectedCustomers.length === 0) {
      toast.error('Please select at least one customer');
      return;
    }

    setSending(true);
    try {
      const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id));
      
      // In a real implementation, you would integrate with an email service like SendGrid, Mailgun, etc.
      // For now, we'll simulate the email sending and store the campaign in Firestore
      
      const campaign = {
        subject: emailData.subject,
        message: emailData.message,
        recipients: selectedCustomerData.map(c => ({
          id: c.id,
          email: c.email,
          name: c.displayName || 'Customer'
        })),
        recipientCount: selectedCustomers.length,
        sentAt: new Date().toISOString(),
        status: 'sent',
        template: emailData.template
      };

      await addDoc(collection(db, 'email_campaigns'), campaign);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Email sent to ${selectedCustomers.length} customers!`);
      
      // Reset form
      setEmailData({
        subject: '',
        message: '',
        template: 'custom'
      });
      setSelectedCustomers([]);
      
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaEnvelope className="h-8 w-8 mr-3 text-orange-600" />
          Email Marketing
        </h1>
        <div className="text-sm text-gray-600">
          {filteredCustomers.length} customers • {selectedCustomers.length} selected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Select Customers</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Customers</option>
                <option value="active">Active (30 days)</option>
                <option value="inactive">Inactive (30+ days)</option>
                <option value="loyal">Loyal (5+ orders)</option>
                <option value="new">New (1 order)</option>
              </select>
              
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm w-48 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium">Select All ({filteredCustomers.length})</span>
                </label>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCustomers.includes(customer.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectCustomer(customer.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {customer.displayName || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{customer.totalOrders} orders</span>
                          {customer.lastOrder && (
                            <span>Last order: {new Date(customer.lastOrder).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Email Composer */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Compose Email</h2>

          {/* Templates */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Templates</label>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left p-2 border rounded-md text-sm hover:bg-gray-50 ${
                    emailData.template === template.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              rows={10}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your message..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {{name}}, {{email}}, {{address}}, {{website}} for personalization
            </p>
          </div>

          {/* Preview */}
          {emailData.message && filteredCustomers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50 text-sm max-h-32 overflow-y-auto">
                {previewEmail(filteredCustomers[0])}
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={sendBulkEmail}
            disabled={sending || selectedCustomers.length === 0}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {sending ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <FaPaperPlane className="h-4 w-4" />
                <span>Send to {selectedCustomers.length} customers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailMarketing;
