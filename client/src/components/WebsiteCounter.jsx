import React, { useEffect } from "react";

const WebsiteCounter = () => {
  useEffect(() => {
    // Add the counter script to the DOM
    const img = new Image();
    <img src="https://www.coolseotools.com/website-visitor-counter/count/&style=style4&show=p&num=6&uid=bh1"  title="Web Counter" alt="AtoZSEOTools Web Counter" />
    document.body.appendChild(img);

    // Clean up the script when the component is unmounted
    return () => {
      document.body.removeChild(img);
    };
  }, []);
  return (
    <div>
      <a href="https://www.coolseotools.com/website-visitor-counter" target="_blank" title="Web Counter">
        <img 
          src="https://www.coolseotools.com/website-visitor-counter/count/&style=style1&show=u&num=6&uid=bh3" 
          title="Web Counter" 
          alt="AtoZSEOTools Web Counter" 
        />
      </a>
    </div>
  );
};

export default WebsiteCounter;
