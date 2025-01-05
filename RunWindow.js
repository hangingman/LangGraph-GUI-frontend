import React, { useState, useEffect } from 'react';
import SERVER_URL from '../config';
import { useGraphManager } from './GraphManager';
import { convertFlowToJson } from './JsonUtils';
import ConfigManager from '../ConfigManager';

function RunWindow({ onClose }) {
    const [responseMessage, setResponseMessage] = useState('');
    const [running, setRunning] = useState(false);
    const { username, llmModel, apiKey } = ConfigManager.getSettings();
    const { nodes, nodeIdCounter } = useGraphManager();

    const saveGraphData = async () => {
        try {
            const flowData = convertFlowToJson(nodes, nodeIdCounter);
            const response = await fetch(`${SERVER_URL}/save-graph/${encodeURIComponent(username)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flowData),
            });

            if (!response.ok) {
                throw new Error('Failed to save graph data on the server.');
            }

            console.log('Graph data successfully saved to server.');
            setResponseMessage(prev => prev + '\nGraph data successfully saved to server.');
        } catch (error) {
            console.error('Error saving graph data:', error);
            setResponseMessage(prev => prev + '\nError saving graph data: ' + error.message);
            throw error;
        }
    };

    const handleRun = async () => {
        if (running) return;
        setRunning(true);
        setResponseMessage('');

        try {
            await saveGraphData();

            console.log("Attempting to send request to Flask server...");
            const response = await fetch(`${SERVER_URL}/run/${encodeURIComponent(username)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    llm_model: llmModel,
                    api_key: apiKey,
                }),
            });

            if (!response.body) {
                throw new Error('ReadableStream not yet supported in this browser.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: streamDone } = await reader.read();
                done = streamDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: !done });
                    console.log("Received chunk:", chunk);
                    setResponseMessage(prev => prev + chunk);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage(prev => prev + '\nError: ' + error.message);
            alert('Error: ' + error.message);
        } finally {
            setRunning(false);
        }
    };

    const handleStop = async () => {
        if (!running) return;

        try {
            const response = await fetch(`${SERVER_URL}/stop/${encodeURIComponent(username)}`, {
                method: 'POST',
            });
            const message = await response.text();
            console.log(message);
            setResponseMessage(prev => prev + '\n' + message);
            if (response.ok) {
                setRunning(false);
            } else {
                console.error('Failed to stop script:', message);
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage(prev => prev + '\nError: ' + error.message);
            alert('Error: ' + error.message);
        }
    };

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/status/${encodeURIComponent(username)}`, {
                    method: 'GET',
                });
                const status = await response.json();
                setRunning(status.running);
            } catch (error) {
                console.error('Error checking status:', error);
            }
        };

        const interval = setInterval(checkStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleTest = async () => {
        console.log("handleTest started, url is:", `${SERVER_URL}/test/`); // Log before fetch
        try {
            const response = await fetch(`${SERVER_URL}/test/`, {
                method: 'GET',
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Response not ok:", response.status, errorText);
              throw new Error(`Failed to fetch from the /test/ endpoint. Status: ${response.status}. Message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Test endpoint response:', data);
            setResponseMessage(prev => prev + '\nTest Response: ' + data.message);
        } catch (error) {
            console.error('Error during test request:', error); // More context
            setResponseMessage(prev => prev + '\nError during test request: ' + error.message);
        }
    };

    const handleCancel = async () => {
        onClose();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-1000">
            <div className="bg-white p-5 rounded shadow-md w-4/5 h-4/5 flex flex-col">
                <h2 className="text-lg font-bold mb-4">Run Script</h2>
                <div className="flex mb-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleRun}
                        disabled={running}
                    >
                        Run
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleCancel}
                        disabled={running}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleTest}
                        disabled={running}
                    >
                        Test
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded mt-4">
                    <pre>{responseMessage}</pre>
                </div>
            </div>
        </div>
    );
}

export default RunWindow;