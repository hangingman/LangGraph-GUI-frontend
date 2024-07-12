import React, { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(nodes.length + 1); // Counter for node IDs
  const { project } = useReactFlow();

  const handleAddNode = useCallback((event) => {
    const newPosition = project({ x: contextMenu.mouseX, y: contextMenu.mouseY });
    const newNode = {
      id: nodeIdCounter.toString(), // Use the counter for the new node ID
      data: { label: `Node ${nodeIdCounter}` },
      position: newPosition,
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter(nodeIdCounter + 1); // Increment the counter
    setContextMenu(null);
  }, [contextMenu, nodeIdCounter, setNodes, project]);

  const handleDeleteNode = useCallback(() => {
    if (contextMenu && contextMenu.nodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== contextMenu.nodeId && edge.target !== contextMenu.nodeId));
    }
    setContextMenu(null);
  }, [contextMenu, setNodes, setEdges]);

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId: node.id,
      isNode: true,
    });
  }, []);

  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      isNode: false,
    });
  }, []);

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
        onClick={handleCloseContextMenu}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 1000,
            padding: '10px',
          }}
        >
          {contextMenu.isNode ? (
            <button onClick={handleDeleteNode}>Delete Node</button>
          ) : (
            <button onClick={handleAddNode}>Add Node</button>
          )}
          <button onClick={handleCloseContextMenu}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
