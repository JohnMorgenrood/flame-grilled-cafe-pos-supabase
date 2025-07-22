import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Users, 
  Clock, 
  Store, 
  Shield, 
  Bell,
  Save,
  Plus,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsManagement = () => {
  const {
    settings,
    staff,
    availableCurrencies,
    roles,
    updateSettings,
    setCurrency,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    toggleStaffDuty,
    clockIn,
    clockOut,
    getStaffOnDuty
  } = useSettings();

  const [activeTab, setActiveTab] = useState('general');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPins, setShowPins] = useState({});
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'cashier',
    email: '',
    phone: '',
    pin: '',
    hourlyRate: '',
    schedule: []
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'currency', label: 'Currency', icon: Globe },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'restaurant', label: 'Restaurant Info', icon: Store },
    { id: 'system', label: 'System', icon: Shield }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        ...newStaff,
        hourlyRate: parseFloat(newStaff.hourlyRate)
      });
      setEditingStaff(null);
    } else {
      addStaffMember({
        ...newStaff,
        hourlyRate: parseFloat(newStaff.hourlyRate),
        dateHired: new Date().toISOString().split('T')[0]
      });
    }
    setNewStaff({
      name: '',
      role: 'cashier',
      email: '',
      phone: '',
      pin: '',
      hourlyRate: '',
      schedule: []
    });
    setShowAddStaffModal(false);
  };

  const startEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setNewStaff({
      name: staffMember.name,
      role: staffMember.role,
      email: staffMember.email,
      phone: staffMember.phone,
      pin: staffMember.pin,
      hourlyRate: staffMember.hourlyRate.toString(),
      schedule: staffMember.shift.schedule
    });
    setShowAddStaffModal(true);
  };

  const toggleScheduleDay = (day) => {
    setNewStaff(prev => ({
      ...prev,
      schedule: prev.schedule.includes(day)
        ? prev.schedule.filter(d => d !== day)
        : [...prev.schedule, day]
    }));
  };

  const updateOperatingHours = (day, field, value) => {
    updateSettings('operatingHours', {
      [day]: {
        ...settings.operatingHours[day],
        [field]: value
      }
    });
  };

  const staffOnDuty = getStaffOnDuty();

  const GeneralTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">General Settings</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-medium text-gray-800 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-800">Staff on Duty</p>
            <p className="text-2xl font-bold text-blue-900">{staffOnDuty.length}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Store className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800">Restaurant Status</p>
            <p className="text-sm font-bold text-green-900">OPEN</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-800">Currency</p>
            <p className="text-sm font-bold text-purple-900">{settings.currency.code}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-medium text-gray-800 mb-4">Staff Quick Status</h4>
        <div className="space-y-2">
          {staff.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${member.isOnDuty ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{member.name}</span>
                <span className="text-sm text-gray-500 ml-2 capitalize">({member.role})</span>
              </div>
              <button
                onClick={() => toggleStaffDuty(member.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.isOnDuty 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {member.isOnDuty ? 'Clock Out' : 'Clock In'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CurrencyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Currency Settings</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-medium text-gray-800 mb-4">Select Currency</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCurrencies.map(currency => (
            <button
              key={currency.code}
              onClick={() => setCurrency(currency.code)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                settings.currency.code === currency.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{currency.symbol} {currency.code}</p>
                  <p className="text-sm text-gray-600">{currency.name}</p>
                </div>
                {settings.currency.code === currency.code && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-medium text-gray-800 mb-4">Currency Display</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symbol Position</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={settings.currency.position === 'before'}
                  onChange={() => updateSettings('currency', { position: 'before' })}
                  className="mr-2"
                />
                Before amount ({settings.currency.symbol}100.00)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={settings.currency.position === 'after'}
                  onChange={() => updateSettings('currency', { position: 'after' })}
                  className="mr-2"
                />
                After amount (100.00{settings.currency.symbol})
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StaffTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Staff Management</h3>
        <button
          onClick={() => setShowAddStaffModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${member.isOnDuty ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.isOnDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.isOnDuty ? 'On Duty' : 'Off Duty'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-mono">
                        {showPins[member.id] ? member.pin : '••••'}
                      </span>
                      <button
                        onClick={() => setShowPins(prev => ({...prev, [member.id]: !prev[member.id]}))}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPins[member.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R{member.hourlyRate}/hr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleStaffDuty(member.id)}
                      className={`p-1 rounded ${
                        member.isOnDuty ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                      title={member.isOnDuty ? 'Clock Out' : 'Clock In'}
                    >
                      {member.isOnDuty ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEditStaff(member)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStaffMember(member.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const HoursTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Operating Hours</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-24">
                <span className="font-medium capitalize">{dayNames[day]}</span>
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!settings.operatingHours[day].closed}
                  onChange={(e) => updateOperatingHours(day, 'closed', !e.target.checked)}
                  className="mr-2"
                />
                Open
              </label>

              {!settings.operatingHours[day].closed && (
                <>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Open:</label>
                    <input
                      type="time"
                      value={settings.operatingHours[day].open}
                      onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Close:</label>
                    <input
                      type="time"
                      value={settings.operatingHours[day].close}
                      onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    />
                  </div>
                </>
              )}

              {settings.operatingHours[day].closed && (
                <span className="text-red-600 font-medium">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <SettingsIcon className="mr-3" />
          Restaurant Settings
        </h2>
        <p className="text-gray-600 mt-1">Manage your restaurant configuration and staff</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'currency' && <CurrencyTab />}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'hours' && <HoursTab />}
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  {Object.entries(roles).map(([key, role]) => (
                    <option key={key} value={key}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN (4 digits)</label>
                  <input
                    type="password"
                    value={newStaff.pin}
                    onChange={(e) => setNewStaff({...newStaff, pin: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    maxLength="4"
                    pattern="[0-9]{4}"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStaff.hourlyRate}
                    onChange={(e) => setNewStaff({...newStaff, hourlyRate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                <div className="grid grid-cols-2 gap-2">
                  {days.map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newStaff.schedule.includes(day)}
                        onChange={() => toggleScheduleDay(day)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{dayNames[day]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStaffModal(false);
                    setEditingStaff(null);
                    setNewStaff({
                      name: '',
                      role: 'cashier',
                      email: '',
                      phone: '',
                      pin: '',
                      hourlyRate: '',
                      schedule: []
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
