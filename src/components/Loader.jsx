import React from 'react';
import '../css/Loader.css'; // ✅ go one level up, then into css folder


const Loader = () => {
    return (
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      );      
};

export default Loader;
