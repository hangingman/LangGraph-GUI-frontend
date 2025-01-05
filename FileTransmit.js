// FileTransmit.js

import React, { useRef } from 'react';
import SERVER_URL from '../config';
import ConfigManager from '../ConfigManager';

function FileTransmit({ onUploadComplete }) {
  const fileInputRef = useRef();

  // Get the username from ConfigManager
  const { username } = ConfigManager.getSettings();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      try {
        // Use the username in the API path
        const response = await fetch(`${SERVER_URL}/upload/${encodeURIComponent(username)}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Files successfully uploaded');
          if (onUploadComplete) {
            onUploadComplete();
          }
        } else {
          const errorData = await response.json();
          alert('Upload failed: ' + errorData.error);
        }
      } catch (error) {
        alert('Upload failed: ' + error.message);
      } finally {
        event.target.value = null;
      }
    }
  };

  const handleDownloadClick = async () => {
    try {
      // Send GET request to the backend to download the zip file
      const response = await fetch(`${SERVER_URL}/download/${encodeURIComponent(username)}`);
  
      if (response.ok) {
        // Create a Blob from the response data (the zip file)
        const blob = await response.blob();
  
        // Create a download link and simulate a click to trigger the download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username}_workspace.zip`; // Set the default file name
        a.click();
  
        // Clean up the object URL
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert('Download failed: ' + errorData.error);
      }
    } catch (error) {
      alert('Download failed: ' + error.message);
    }
  };

  // function to handle cache cleanup with username
  const handleCleanCacheClick = async () => {
    try {
      // Use the username in the API path
      const response = await fetch(`${SERVER_URL}/clean-cache/${encodeURIComponent(username)}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Cache successfully cleaned');
      } else {
        const errorData = await response.json();
        alert('Clean cache failed: ' + errorData.error);
      }
    } catch (error) {
      alert('Clean cache failed: ' + error.message);
    }
  };

  // Check if username is valid
  const isUsernameValid = username && username.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 mb-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <button onClick={handleUploadClick} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-1 rounded focus:outline-none focus:shadow-outline text-sm">
            Upload Files to Server
        </button>
        <button onClick={handleDownloadClick} className="bg-green-500 hover:bg-green-700 text-white font-semibold px-1 rounded focus:outline-none focus:shadow-outline text-sm">
            Get Files from Server
        </button>
        <button onClick={handleCleanCacheClick} className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold px-1 rounded focus:outline-none focus:shadow-outline text-sm">
            Clean Server Cache
        </button>

        <div
          className={`font-bold ${isUsernameValid ? 'text-green-500' : 'text-red-500'}`}
        >
          {isUsernameValid ? `User: ${username}` : 'User: undefined'}
        </div>
      </div>
    </div>
  );
}

export default FileTransmit;