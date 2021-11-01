import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  const sessionId = location.search.replace('?session_id=', '');

  useEffect(() => {
    async function fetchSession() {
      setSession(
        await fetch('/checkout-session?sessionId=' + sessionId).then((res) =>
          res.json()
        )
      );
    }
    fetchSession();
  }, [sessionId]);

  return (
    <div className="sr-root">
      <div className="sr-main">
        <div className="sr-payment-summary completed-view">
          <h1>Your payment succeeded</h1>
        </div>
        <div className="completed-view-section">
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <Link 
                to="/"
                style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    borderTop: '1px solid rgba(0, 0, 0, 0.15)',
                    paddingTop: '10px'
                }}>
                Restart demo
            </Link>
        </div>
      </div>
      <div className="sr-content">
      </div>
    </div>
  );
};

export default Success;