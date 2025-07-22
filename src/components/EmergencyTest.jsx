import React from 'react';

function EmergencyTest() {
  return React.createElement('div', {
    style: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '50px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: 'Arial'
    }
  }, 'EMERGENCY TEST - IF YOU SEE THIS, REACT IS WORKING!');
}

export default EmergencyTest;
