import React from 'react';

const UltraSimpleTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '2rem'
        }}>
          🔥 React is Working!
        </h1>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          This proves your React setup is functioning correctly.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #d4edda'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#155724' }}>✅ React</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#155724' }}>Working perfectly</p>
          </div>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #d4edda'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#155724' }}>✅ Router</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#155724' }}>Navigation ready</p>
          </div>
        </div>
        <a 
          href="/dashboard"
          style={{
            display: 'inline-block',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Test Dashboard
        </a>
        <a 
          href="/test-dashboard"
          style={{
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Alternative Test
        </a>
      </div>
    </div>
  );
};

export default UltraSimpleTest;
