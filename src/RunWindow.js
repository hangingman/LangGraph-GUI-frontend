// RunWindow.js

import React, { useState } from 'react';

function RunWindow({ onClose }) {
  const [runMode, setRunMode] = useState('default');
  const [logLevel, setLogLevel] = useState('info');

  const handleRun = () => {
    // Placeholder for running the Python script
    alert(`Running script with mode: ${runMode} and log level: ${logLevel}`);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <h2>Run Settings</h2>
        <div>
          <label>
            Run Mode:
            <input 
              type="text" 
              value={runMode} 
              onChange={(e) => setRunMode(e.target.value)} 
            />
          </label>
        </div>
        <div>
          <label>
            Log Level:
            <input 
              type="text" 
              value={logLevel} 
              onChange={(e) => setLogLevel(e.target.value)} 
            />
          </label>
        </div>
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
