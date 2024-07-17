// FileTransmit.js

import React, { useRef } from 'react';

function FileTransmit({ onUploadComplete }) {
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('File successfully uploaded');
          if (onUploadComplete) {
            onUploadComplete();
          }
        } else {
          const errorData = await response.json();
          alert('Upload failed: ' + errorData.error);
        }
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    }
  };

  const handleDownloadClick = async () => {
    const filename = prompt('Enter the filename to download:');
    if (filename) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/download/${filename}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          const errorData = await response.json();
          alert('Download failed: ' + errorData.error);
        }
      } catch (error) {
        alert('Download failed: ' + error.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button onClick={handleUploadClick}>Upload</button>
      <button onClick={handleDownloadClick}>Download</button>
    </div>
  );
}

export default FileTransmit;
