
import React, { useState } from 'react';

function Footer() {

  const initialCount = 0
  
  const [count, setCount] = useState(initialCount)

  const increaseReview = () => {
    setCount((prev) => prev + 1)
  }

  const decreaseReview = () => {
    setCount((prev) => prev - 1)
  }
  return (
    <footer className="bottom">
      
        <div className="center">
            All rights reserved &copy; Sharanya Garipally
        </div>
        <div className="center">
          <h1>
            review: <h4 data-testid="count">{count}</h4>
          </h1>
            
          
        </div>
        <div className="center">
          <button onClick={increaseReview}>Like</button>
          <button onClick={decreaseReview}>disLike</button>
        </div>
    </footer>
  );
  
}

export default Footer;
