import React, { useState, useEffect } from 'react';

const Banner = () => {
  const texts = [
    {
      title: "Find Your Dream Job",
      subtitle: "Connecting students with the best part-time opportunities"
    },
    {
      title: "Join JobSync Today",
      subtitle: "Explore top job listings tailored for you"
    },
    {
      title: "Build Your Career",
      subtitle: "Gain experience while studying with flexible job options"
    },
    {
      title: "Grow Your Network",
      subtitle: "Meet recruiters and employers looking for talent like you"
    }
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    <div className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow-md">
      <div className="absolute left-0 top-0 h-full w-1/3 flex items-center justify-center">
        <img 
          src="/api/placeholder/400/500" 
          alt="Left banner image" 
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center">
        <img 
          src="/api/placeholder/400/500" 
          alt="Right banner image" 
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="absolute left-1/3 right-1/3 top-0 bottom-0 flex items-center justify-center">
        <div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 w-full h-4/5 flex flex-col items-center justify-center p-6" 
          style={{ 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -2px 6px -1px rgba(0, 0, 0, 0.02)",
            transform: "perspective(1000px) rotateX(2deg)"
          }}
        >
          <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} text-center`}>
            <h2 className="text-3xl font-bold text-blue-800 mb-3">{texts[currentTextIndex].title}</h2>
            <p className="text-xl text-gray-700 mb-5">{texts[currentTextIndex].subtitle}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transform transition hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;