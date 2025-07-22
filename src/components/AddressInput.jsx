import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaMapMarkerAlt, 
  FaLocationArrow, 
  FaClock, 
  FaSave,
  FaTrash,
  FaHome,
  FaBuilding,
  FaHeart,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { locationService } from '../services/LocationService';

const AddressInput = ({ 
  value = {}, 
  onChange, 
  required = false,
  showSaveOption = true,
  showCurrentLocation = true,
  className = ""
}) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    ...value
  });

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Google Places Autocomplete states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // South African provinces
  const provinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Free State'
  ];

  // Address type options
  const addressTypes = [
    { value: 'Home', icon: FaHome, color: 'text-green-600' },
    { value: 'Work', icon: FaBuilding, color: 'text-blue-600' },
    { value: 'Other', icon: FaHeart, color: 'text-purple-600' }
  ];

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(address);
    }
    validateAddress();
  }, [address]);

  const loadSavedAddresses = () => {
    const saved = locationService.getSavedAddresses();
    setSavedAddresses(saved);
  };

  const validateAddress = () => {
    const validation = locationService.validateSouthAfricanAddress(address);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Debounced search for Google Places
  const debouncedSearch = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await locationService.searchAddresses(query);
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(query);
    }, 300);
  };

  // Select address from search results
  const selectSearchResult = async (result) => {
    setLoading(true);
    setShowSearchResults(false);
    setSearchQuery(result.description);

    try {
      const addressData = await locationService.getAddressFromPlaceId(result.placeId);
      setAddress(addressData);

      // Check delivery availability
      if (addressData.coordinates) {
        const delivery = await locationService.isDeliveryAvailable(
          addressData.coordinates.latitude,
          addressData.coordinates.longitude
        );
        setDeliveryInfo(delivery);
      }

      // Call onChange with the formatted address
      if (onChange) {
        onChange(addressData.formattedAddress);
      }

      toast.success('Address selected!');
    } catch (error) {
      console.error('Error selecting address:', error);
      toast.error('Failed to load address details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const updatedAddress = {
      ...address,
      [field]: value
    };
    
    setAddress(updatedAddress);
    
    // Create formatted address string for MobileOrderingApp
    const formattedAddress = [
      updatedAddress.street,
      updatedAddress.city,
      updatedAddress.province,
      updatedAddress.postalCode,
      updatedAddress.country
    ].filter(Boolean).join(', ');
    
    // Call onChange with formatted address string
    if (onChange && formattedAddress.trim()) {
      onChange(formattedAddress);
    }
  };

  const getCurrentLocation = async () => {
    if (!showCurrentLocation) return;

    setLoading(true);
    try {
      const locationData = await locationService.getCurrentLocationAddress();
      
      if (locationData && locationData.formattedAddress) {
        const newAddress = {
          street: locationData.street || '',
          city: locationData.city || '',
          province: locationData.province || 'Gauteng',
          postalCode: locationData.postalCode || '',
          country: locationData.country || 'South Africa',
          coordinates: locationData.coordinates,
          formattedAddress: locationData.formattedAddress
        };

        setAddress(newAddress);

        // Check delivery availability
        if (locationData.coordinates) {
          const delivery = await locationService.isDeliveryAvailable(
            locationData.coordinates.latitude,
            locationData.coordinates.longitude
          );
          setDeliveryInfo(delivery);
        }

        // Call onChange with the formatted address string that MobileOrderingApp expects
        if (onChange) {
          onChange(locationData.formattedAddress);
        }

        toast.success('Location detected successfully!');
      } else {
        toast.error('Could not detect your location. Please enter address manually.');
      }
    } catch (error) {
      console.error('Location error:', error);
      toast.error(error.message || 'Failed to get location. Please enter address manually.');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentAddress = () => {
    if (!validateAddress()) {
      toast.error('Please fix address errors before saving');
      return;
    }

    try {
      locationService.saveAddress(address, addressLabel);
      loadSavedAddresses();
      toast.success(`Address saved as "${addressLabel}"`);
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const selectSavedAddress = (savedAddress) => {
    setAddress({
      street: savedAddress.street || '',
      city: savedAddress.city || '',
      province: savedAddress.province || '',
      postalCode: savedAddress.postalCode || '',
      country: savedAddress.country || 'South Africa'
    });
    setShowSaved(false);
    toast.success(`Selected ${savedAddress.label} address`);
  };

  const removeSavedAddress = (addressId) => {
    locationService.removeSavedAddress(addressId);
    loadSavedAddresses();
    toast.success('Address removed');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FaMapMarkerAlt className="h-5 w-5 mr-2 text-orange-600" />
          Delivery Address
        </h3>
        
        <div className="flex space-x-2">
          {showCurrentLocation && (
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              <FaLocationArrow className="h-4 w-4" />
              <span>{loading ? 'Locating...' : 'Use Current Location'}</span>
            </button>
          )}
          
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSaved(!showSaved)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <FaHome className="h-4 w-4" />
              <span>Saved Addresses</span>
            </button>
          )}
        </div>
      </div>

      {/* Address Search with Google Places Autocomplete */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaSearch className="inline h-4 w-4 mr-2" />
          Search Address
        </label>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="Start typing your address..."
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.placeId}
                type="button"
                onClick={() => selectSearchResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-start">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{result.mainText}</p>
                    <p className="text-sm text-gray-500">{result.secondaryText}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or enter manually</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Saved addresses dropdown */}
      {showSaved && savedAddresses.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Select Saved Address:</h4>
          <div className="space-y-2">
            {savedAddresses.map((savedAddr) => {
              const TypeIcon = addressTypes.find(t => t.value === savedAddr.label)?.icon || FaHome;
              const typeColor = addressTypes.find(t => t.value === savedAddr.label)?.color || 'text-green-600';
              
              return (
                <div key={savedAddr.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <TypeIcon className={`h-5 w-5 ${typeColor}`} />
                    <div>
                      <p className="font-medium text-gray-900">{savedAddr.label}</p>
                      <p className="text-sm text-gray-500">
                        {locationService.formatAddress(savedAddr)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => selectSavedAddress(savedAddr)}
                      className="text-orange-600 hover:text-orange-500"
                    >
                      Select
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSavedAddress(savedAddr.id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Address form */}
      <div className="grid grid-cols-1 gap-4">
        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Street Address {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
              errors.street ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 123 Main Street, Sandton"
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        {/* City and Province */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Johannesburg"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <select
              value={address.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.province ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province}</p>
            )}
          </div>
        </div>

        {/* Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              value={address.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                errors.postalCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 2196"
              maxLength="4"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={address.country}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery information */}
      {deliveryInfo && (
        <div className={`p-4 rounded-md ${
          deliveryInfo.available 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <FaClock className={`h-5 w-5 mr-2 ${
              deliveryInfo.available ? 'text-green-600' : 'text-red-600'
            }`} />
            <div>
              {deliveryInfo.available ? (
                <>
                  <p className="text-green-800 font-medium">
                    Delivery available! 
                  </p>
                  <p className="text-green-700 text-sm">
                    Distance: {deliveryInfo.distance.toFixed(1)}km • 
                    Estimated delivery: {deliveryInfo.estimatedTime} minutes
                  </p>
                </>
              ) : (
                <>
                  <p className="text-red-800 font-medium">
                    Sorry, this location is outside our delivery area
                  </p>
                  <p className="text-red-700 text-sm">
                    Distance: {deliveryInfo.distance.toFixed(1)}km (max 15km)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save address option */}
      {showSaveOption && address.street && address.city && (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <select
              value={addressLabel}
              onChange={(e) => setAddressLabel(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              {addressTypes.map(type => (
                <option key={type.value} value={type.value}>{type.value}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveCurrentAddress}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <FaSave className="h-4 w-4" />
              <span>Save Address</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
