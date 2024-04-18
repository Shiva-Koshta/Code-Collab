import React, { useState } from 'react'

const Tooltip = ({ children, text, isVisible, setIsVisible, i}) => {

    const handleMouseEnter = () => {
        let updateIsVisible = [false, false, false]
        updateIsVisible[i] = true
        setIsVisible(updateIsVisible)
    };
  
    const handleMouseLeave = () => {
        setIsVisible([false, false, false])
    };
  
    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible[i] && (
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