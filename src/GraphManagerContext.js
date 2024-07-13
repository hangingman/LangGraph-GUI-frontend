// GraphManagerContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNodesState } from 'reactflow';
import { saveJson, loadJson } from './FileUtils';

const GraphManagerContext = createContext(null);

export const useGraphManager = () => {
  return useContext(GraphManagerContext);
};

export const GraphManagerProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const value = {
    nodes,
    setNodes,
    onNodesChange,
    nodeIdCounter,
    setNodeIdCounter,
  };

  return (
    <GraphManagerContext.Provider value={value}>
      {children}
    </GraphManagerContext.Provider>
  );
};
