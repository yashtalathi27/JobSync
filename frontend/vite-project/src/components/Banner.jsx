import React, { useState, useEffect } from 'react';

const Banner = () => {
  // Sample texts to rotate through
  const texts = [
    {
      title: "Welcome to JobSync",
      subtitle: "Discover our amazing products and services"
    },
    {
      title: "Spring Sale",
      subtitle: "Get up to 50% off on selected items"
    },
    {
      title: "New Arrivals",
      subtitle: "Check out our latest collection"
    },
    {
      title: "Join Our Community",
      subtitle: "Connect with like-minded people"
    }
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rotate text every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTransitioning(false);
      }, 500);
      
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-64 bg-gray-100 overflow-hidden rounded-lg shadow-md">
      {/* Left image container */}
      <div className="absolute left-0 top-0 h-full w-1/3 flex items-center justify-center">
        <img 
          src="/api/placeholder/300/400" 
          alt="Left banner image" 
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Right image container */}
      <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center">
        <img 
          src="/api/placeholder/300/400" 
          alt="Right banner image" 
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Center text container - now using full available center space */}
      <div className="absolute left-1/3 right-1/3 top-0 bottom-0 flex items-center justify-center">
        <div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 w-full h-4/5 flex flex-col items-center justify-center p-4" 
          style={{ 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -2px 6px -1px rgba(0, 0, 0, 0.02)",
            transform: "perspective(1000px) rotateX(2deg)"
          }}
        >
          <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} text-center`}>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{texts[currentTextIndex].title}</h2>
            <p className="text-lg text-gray-700 mb-4">{texts[currentTextIndex].subtitle}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transform transition hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;