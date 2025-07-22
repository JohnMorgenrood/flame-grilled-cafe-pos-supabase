import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-500 mb-4">Flammed Grilled Cafe</h3>
            <p className="text-gray-300 mb-4">
              Experience the finest grilled cuisine in a cozy, modern atmosphere. 
              Fresh ingredients, bold flavors, and exceptional service.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/menu" className="text-gray-300 hover:text-primary-500 transition-colors">Menu</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary-500 transition-colors">About</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-primary-500 transition-colors">Gallery</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>123 Restaurant Street</p>
              <p>City, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@flammedgrilled.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            © 2025 Flammed Grilled Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
