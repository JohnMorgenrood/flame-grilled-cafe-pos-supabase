import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  // Mock gallery images - in a real app, these would come from Firebase Storage
  const galleryImages = [
    { id: 1, title: 'Signature Grilled Burger', category: 'food' },
    { id: 2, title: 'Restaurant Interior', category: 'ambiance' },
    { id: 3, title: 'Grilled Salmon', category: 'food' },
    { id: 4, title: 'Outdoor Seating', category: 'ambiance' },
    { id: 5, title: 'Chef at Work', category: 'behind-scenes' },
    { id: 6, title: 'Grilled Vegetables', category: 'food' },
    { id: 7, title: 'Bar Area', category: 'ambiance' },
    { id: 8, title: 'Team Photo', category: 'behind-scenes' },
    { id: 9, title: 'Dessert Platter', category: 'food' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-600">
            A visual journey through our culinary world
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
                <div className="aspect-square bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-center px-4">
                    {image.title}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                    <span className="text-sm bg-primary-500 px-3 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Explore by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['All', 'Food', 'Ambiance', 'Behind Scenes'].map((category) => (
              <button
                key={category}
                className="px-6 py-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-primary-500 hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to be featured in our gallery?
          </h2>
          <p className="text-gray-600 mb-6">
            Share your dining experience with us using #FlammedGrilledCafe
          </p>
          <button className="btn-primary">
            Share Your Photo
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
