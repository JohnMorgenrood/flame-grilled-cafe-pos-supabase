// Location and Address Services
import { toast } from 'react-hot-toast';

class LocationService {
  constructor() {
    this.isGeolocationSupported = 'geolocation' in navigator;
  }

  // Get current location coordinates
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Reverse geocoding using Google Places API
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.warn('Google Maps API key not configured, using fallback service');
        return this.getFallbackAddressFromCoordinates(latitude, longitude);
      }

      // Using Google Geocoding API for accurate South African addresses
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&region=za&language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address from Google API');
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK' || !data.results.length) {
        throw new Error('No address found for this location');
      }

      const result = data.results[0];
      const components = result.address_components;
      
      // Parse Google's address components for South African format
      let street = '';
      let streetNumber = '';
      let route = '';
      let city = '';
      let province = '';
      let postalCode = '';
      let country = '';

      components.forEach(component => {
        const types = component.types;
        
        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          route = component.long_name;
        }
        if (types.includes('locality') || types.includes('sublocality')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          province = component.long_name;
        }
        if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
        if (types.includes('country')) {
          country = component.long_name;
        }
      });

      // Construct street address
      street = [streetNumber, route].filter(Boolean).join(' ');
      
      return {
        street: street || result.formatted_address.split(',')[0],
        city: city || 'Johannesburg',
        province: province || 'Gauteng',
        postalCode: postalCode || '',
        country: country || 'South Africa',
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } catch (error) {
      console.error('Google Geocoding error:', error);
      // Fallback to free service
      return this.getFallbackAddressFromCoordinates(latitude, longitude);
    }
  }

  // Fallback geocoding service when Google API is not available
  async getFallbackAddressFromCoordinates(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address');
      }
      
      const data = await response.json();
      
      return {
        street: `${data.localityInfo?.administrative?.[3]?.name || ''} ${data.localityInfo?.administrative?.[4]?.name || ''}`.trim() || 'Address not available',
        city: data.city || data.locality || 'Johannesburg',
        province: data.principalSubdivision || 'Gauteng',
        postalCode: data.postcode || '',
        country: data.countryName || 'South Africa',
        formattedAddress: data.locality ? 
          `${data.locality}, ${data.principalSubdivision}, ${data.countryName}` : 
          'Address not found'
      };
    } catch (error) {
      console.error('Fallback geocoding error:', error);
      throw new Error('Unable to get address from location');
    }
  }

  // Search addresses using Google Places API Autocomplete
  async searchAddresses(query, sessionToken = null) {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.warn('Google Maps API key not configured, autocomplete not available');
        return [];
      }

      const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
      url.searchParams.append('input', query);
      url.searchParams.append('key', apiKey);
      url.searchParams.append('components', 'country:za'); // Restrict to South Africa
      url.searchParams.append('types', 'address');
      if (sessionToken) {
        url.searchParams.append('sessiontoken', sessionToken);
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions.map(prediction => ({
          placeId: prediction.place_id,
          description: prediction.description,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text
        }));
      }

      return [];
    } catch (error) {
      console.error('Places autocomplete error:', error);
      return [];
    }
  }

  // Get detailed address from place ID
  async getAddressFromPlaceId(placeId) {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        throw new Error('Google Maps API key not configured');
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=address_components,formatted_address,geometry`
      );
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error('Failed to get place details');
      }

      const result = data.result;
      const components = result.address_components;
      
      let street = '';
      let streetNumber = '';
      let route = '';
      let city = '';
      let province = '';
      let postalCode = '';
      let country = '';

      components.forEach(component => {
        const types = component.types;
        
        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          route = component.long_name;
        }
        if (types.includes('locality') || types.includes('sublocality')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          province = component.long_name;
        }
        if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
        if (types.includes('country')) {
          country = component.long_name;
        }
      });

      street = [streetNumber, route].filter(Boolean).join(' ');
      
      return {
        street: street || result.formatted_address.split(',')[0],
        city: city || 'Johannesburg',
        province: province || 'Gauteng', 
        postalCode: postalCode || '',
        country: country || 'South Africa',
        formattedAddress: result.formatted_address,
        coordinates: {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng
        },
        placeId: placeId
      };
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Unable to get address details');
    }
  }
  async getCurrentLocationAddress() {
    try {
      toast.loading('Getting your location...', { id: 'location' });
      
      const position = await this.getCurrentPosition();
      const address = await this.getAddressFromCoordinates(
        position.latitude, 
        position.longitude
      );
      
      toast.success('Location found!', { id: 'location' });
      
      return {
        ...address,
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude
        }
      };
    } catch (error) {
      toast.error(error.message, { id: 'location' });
      throw error;
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance; // Distance in kilometers
  }

  toRadians(degrees) {
    return degrees * (Math.PI/180);
  }

  // Check if delivery is available to location
  isDeliveryAvailable(customerLat, customerLon) {
    // Flame Grilled Cafe location (you can update these coordinates)
    const restaurantLat = -26.2041; // Johannesburg coordinates (example)
    const restaurantLon = 28.0473;
    const maxDeliveryDistance = 15; // 15km delivery radius
    
    const distance = this.calculateDistance(
      restaurantLat, 
      restaurantLon, 
      customerLat, 
      customerLon
    );
    
    return {
      available: distance <= maxDeliveryDistance,
      distance: distance,
      estimatedTime: Math.ceil(distance * 3) + 15 // 3 min per km + 15 min prep
    };
  }

  // South African address validation
  validateSouthAfricanAddress(address) {
    const errors = {};
    
    // Province validation
    const validProvinces = [
      'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
      'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Free State'
    ];
    
    if (!address.street || address.street.trim().length < 5) {
      errors.street = 'Please enter a valid street address';
    }
    
    if (!address.city || address.city.trim().length < 2) {
      errors.city = 'Please enter a valid city';
    }
    
    if (address.province && !validProvinces.includes(address.province)) {
      errors.province = 'Please select a valid South African province';
    }
    
    // South African postal code validation (4 digits)
    if (address.postalCode && !/^\d{4}$/.test(address.postalCode)) {
      errors.postalCode = 'Postal code must be 4 digits';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format address for display
  formatAddress(address) {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.province) parts.push(address.province);
    if (address.postalCode) parts.push(address.postalCode);
    
    return parts.join(', ');
  }

  // Get saved addresses from localStorage
  getSavedAddresses() {
    try {
      const saved = localStorage.getItem('flame_grilled_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      return [];
    }
  }

  // Save address to localStorage
  saveAddress(address, label = 'Home') {
    try {
      const saved = this.getSavedAddresses();
      const newAddress = {
        id: Date.now().toString(),
        label,
        ...address,
        createdAt: new Date().toISOString()
      };
      
      saved.unshift(newAddress);
      
      // Keep only last 5 addresses
      if (saved.length > 5) {
        saved.splice(5);
      }
      
      localStorage.setItem('flame_grilled_addresses', JSON.stringify(saved));
      
      return newAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      throw new Error('Unable to save address');
    }
  }

  // Remove saved address
  removeSavedAddress(addressId) {
    try {
      const saved = this.getSavedAddresses();
      const filtered = saved.filter(addr => addr.id !== addressId);
      localStorage.setItem('flame_grilled_addresses', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing address:', error);
      return false;
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default LocationService;
