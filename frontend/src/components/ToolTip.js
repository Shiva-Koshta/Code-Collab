import React, { useState } from 'react'

const Tooltip = ({ children, text }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
  
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
  
    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible && (
                <div 
                    className="absolute left-full top-3/4 transform delay-200 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap"
                    style={{zIndex: '60'}}
                >
                    {text}
                </div>
            )}
        </div>
    );
  };

export default Tooltip;