import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Currency Settings
    currency: {
      code: 'ZAR',
      symbol: 'R',
      name: 'South African Rand',
      position: 'before' // before or after the amount
    },
    
    // Restaurant Info
    restaurant: {
      name: 'Flame Grilled Cafe',
      address: '123 Main Street, Cape Town, South Africa',
      phone: '+27 21 123 4567',
      email: 'info@flamegrilledcafe.co.za',
      timezone: 'Africa/Johannesburg',
      vatNumber: '4123456789',
      vatRate: 15 // 15% VAT for South Africa
    },

    // Operating Hours
    operatingHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '09:00', close: '21:00', closed: false }
    },

    // System Settings
    system: {
      autoLogoutTime: 30, // minutes
      lowStockThreshold: 10, // percentage
      enableNotifications: true,
      enableSounds: true,
      theme: 'light',
      language: 'en'
    }
  });

  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'John Morgenrood',
      role: 'manager',
      email: 'john@flamegrilledcafe.co.za',
      phone: '+27 82 123 4567',
      pin: '1234',
      permissions: ['orders', 'inventory', 'staff', 'reports', 'settings'],
      status: 'active',
      shift: {
        current: null,
        schedule: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      dateHired: '2025-01-15',
      hourlyRate: 150,
      isOnDuty: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'cashier',
      email: 'sarah@flamegrilledcafe.co.za',
      phone: '+27 83 987 6543',
      pin: '5678',
      permissions: ['orders'],
      status: 'active',
      shift: {
        current: null,
        schedule: ['monday', 'wednesday', 'friday', 'saturday', 'sunday']
      },
      dateHired: '2025-02-01',
      hourlyRate: 85,
      isOnDuty: true
    },
    {
      id: '3',
      name: 'Mike Williams',
      role: 'kitchen',
      email: 'mike@flamegrilledcafe.co.za',
      phone: '+27 84 555 1234',
      pin: '9012',
      permissions: ['orders'],
      status: 'active',
      shift: {
        current: null,
        schedule: ['tuesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      dateHired: '2025-01-20',
      hourlyRate: 95,
      isOnDuty: true
    }
  ]);

  const [shifts, setShifts] = useState([]);

  // Available currencies
  const availableCurrencies = [
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' }
  ];

  // Staff roles and permissions
  const roles = {
    manager: {
      name: 'Manager',
      permissions: ['orders', 'inventory', 'staff', 'reports', 'settings'],
      description: 'Full access to all system features'
    },
    supervisor: {
      name: 'Supervisor',
      permissions: ['orders', 'inventory', 'reports'],
      description: 'Can manage orders, inventory and view reports'
    },
    cashier: {
      name: 'Cashier',
      permissions: ['orders'],
      description: 'Can process orders and payments'
    },
    kitchen: {
      name: 'Kitchen Staff',
      permissions: ['orders'],
      description: 'Can view and update order status'
    },
    server: {
      name: 'Server',
      permissions: ['orders'],
      description: 'Can take orders and serve customers'
    }
  };

  // Update settings
  const updateSettings = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  // Currency functions
  const formatCurrency = (amount) => {
    const { symbol, position } = settings.currency;
    const formattedAmount = amount.toFixed(2);
    return position === 'before' ? `${symbol}${formattedAmount}` : `${formattedAmount}${symbol}`;
  };

  const setCurrency = (currencyCode) => {
    const currency = availableCurrencies.find(c => c.code === currencyCode);
    if (currency) {
      updateSettings('currency', {
        code: currency.code,
        symbol: currency.symbol,
        name: currency.name
      });
    }
  };

  // Staff management functions
  const addStaffMember = (staffData) => {
    const newStaff = {
      ...staffData,
      id: Date.now().toString(),
      status: 'active',
      isOnDuty: false,
      shift: {
        current: null,
        schedule: staffData.schedule || []
      }
    };
    setStaff(prev => [...prev, newStaff]);
    return newStaff;
  };

  const updateStaffMember = (id, updates) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteStaffMember = (id) => {
    setStaff(prev => prev.filter(member => member.id !== id));
  };

  const toggleStaffDuty = (id) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, isOnDuty: !member.isOnDuty } : member
    ));
  };

  const clockIn = (staffId) => {
    const now = new Date();
    const shift = {
      id: Date.now().toString(),
      staffId,
      clockIn: now.toISOString(),
      clockOut: null,
      date: now.toISOString().split('T')[0]
    };
    
    setShifts(prev => [...prev, shift]);
    updateStaffMember(staffId, { 
      isOnDuty: true,
      'shift.current': shift.id
    });
    
    return shift;
  };

  const clockOut = (staffId) => {
    const now = new Date();
    const staffMember = staff.find(s => s.id === staffId);
    
    if (staffMember?.shift.current) {
      setShifts(prev => prev.map(shift => 
        shift.id === staffMember.shift.current 
          ? { ...shift, clockOut: now.toISOString() }
          : shift
      ));
      
      updateStaffMember(staffId, { 
        isOnDuty: false,
        'shift.current': null
      });
    }
  };

  // Get staff on duty
  const getStaffOnDuty = () => {
    return staff.filter(member => member.isOnDuty);
  };

  // Get staff by role
  const getStaffByRole = (role) => {
    return staff.filter(member => member.role === role);
  };

  // Validate staff PIN
  const validateStaffPin = (pin) => {
    return staff.find(member => member.pin === pin && member.status === 'active');
  };

  const value = {
    settings,
    staff,
    shifts,
    availableCurrencies,
    roles,
    updateSettings,
    formatCurrency,
    setCurrency,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    toggleStaffDuty,
    clockIn,
    clockOut,
    getStaffOnDuty,
    getStaffByRole,
    validateStaffPin
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
