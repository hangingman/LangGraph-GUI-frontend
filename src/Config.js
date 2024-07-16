// Config.js
import React, { useState } from 'react';

function Config({ onClose }) {
  const [setting1, setSetting1] = useState('');
  const [setting2, setSetting2] = useState(false);

  const handleSave = () => {
    // Save settings logic here
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <h2>Settings</h2>
        <div>
          <label>
            Setting 1:
            <input 
              type="text" 
              value={setting1} 
              onChange={(e) => setSetting1(e.target.value)} 
            />
          </label>
        </div>
        <div>
          <label>
            Setting 2:
            <input 
              type="checkbox" 
              checked={setting2} 
              onChange={(e) => setSetting2(e.target.checked)} 
            />
          </label>
        </div>
        <button onClick={handleSave}>Save</button>
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

export default Config;
