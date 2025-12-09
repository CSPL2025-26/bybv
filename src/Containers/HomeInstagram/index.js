import React, { useState, useEffect, useContext } from 'react';

function HomeInstagram() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//widget.tagembed.com/embed.min.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    setTimeout(() => {
      const element = document.querySelector('.tb_theme_container > div:first-child');
      if (element) {
        element.style.display = 'none';
      }
    }, 1500);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
    {/* {contextValues.settingData.instagram_url ? <a href={contextValues.settingData.instagram_url} className="explorebutton" target='_blank'>Follow Now</a> : ''} */}
    <div className="tagembed-widget" style={{ width: '100%', height: '100%' }} data-widget-id="157997" view-url="https://widget.tagembed.com/157997"></div> 
    
    </>
  )
}

export default HomeInstagram