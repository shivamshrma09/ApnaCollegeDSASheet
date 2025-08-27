import React from 'react';
import './SideImages.css';

const SideImages = () => {
  return (
    <>
      <div className="left-image" onClick={() => window.open('https://www.geeksforgeeks.org/', '_blank')}>
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvC_5uXl98v9QVTj6v0X_KY23cIzTkt2uWDA&s" 
          alt="Left decoration"
        />
      </div>
      
      <div className="right-image" onClick={() => window.open('https://www.geeksforgeeks.org/', '_blank')}>
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-MukCkP9cLARmuCMw_vo_oK6HTSDXiXxxwOdoftZJmn4ZfA3atHWsBusuVTD8oOws_44&usqp=CAU" 
          alt="Right decoration"
        />
      </div>
    </>
  );
};

export default SideImages;