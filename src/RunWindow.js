// RunWindow.js

import React from 'react';

function RunWindow({ onClose }) {
  const handleRun = async () => {
    try {
      console.log("Attempting to send request to Flask server...");
      const response = await fetch('http://127.0.0.1:5000/run', {
        method: 'POST',
      });
      console.log("Received response from Flask server...");
      const text = await response.text();
      console.log("Response text:", text);
      alert(text); // Display the response in an alert for simplicity
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <h2>Run Script</h2>
        <button onClick={handleRun}>Run</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  window: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
};

export default RunWindow;
