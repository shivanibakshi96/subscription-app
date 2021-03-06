import React from 'react';
import { Link } from 'react-router-dom';

const Canceled = () => {
  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
        </header>
        <div className="sr-payment-summary completed-view">
          <h1>Your payment was canceled</h1>
          <Link to="/">Restart demo</Link>
        </div>
      </div>
      <div className="sr-content">
      </div>
    </div>
  );
};

export default Canceled;