import React from 'react';

function SimpleTest() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Simple Test App</h1>
      <p>If you can see this, the basic React app is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default SimpleTest;
