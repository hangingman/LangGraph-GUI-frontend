// App.js

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import Node, { addNode, deleteNode } from './Node';
import { createEdge, deleteEdge } from './Edge';
import { saveFlow, loadFlow } from './FileUtils';

const nodeTypes = { textUpdater: Node };

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const { screenToFlowPosition } = useReactFlow();
  const menuBarRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      if (menuBarRef.current) {
        const menuBarHeight = menuBarRef.current.offsetHeight;
        setCanvasHeight(window.innerHeight - menuBarHeight - 10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // call once to set initial height

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddNode = useCallback((event) => {
    const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
    addNode(nodes, setNodes, nodeIdCounter, setNodeIdCounter, newPosition);
    setContextMenu(null);
  }, [contextMenu, nodeIdCounter, setNodes, screenToFlowPosition]);

  const handleDeleteNode = useCallback(() => {
    if (contextMenu && contextMenu.nodeId) {
      deleteNode(nodes, setNodes, edges, setEdges, contextMenu.nodeId);
    }
    setContextMenu(null);
  }, [contextMenu, setNodes, setEdges, nodes, edges]);

  const handleDeleteEdge = useCallback(() => {
    if (contextMenu && contextMenu.edgeId) {
      deleteEdge(edges, setEdges, contextMenu.edgeId);
    }
    setContextMenu(null);
  }, [contextMenu, setEdges, edges]);

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId: node.id,
      isNode: true,
      isEdge: false,
    });
  }, []);

  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      isNode: false,
      isEdge: false,
    });
  }, []);

  const handleEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      edgeId: edge.id,
      isNode: false,
      isEdge: true,
    });
  }, []);

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const onConnect = useCallback((params) => createEdge(edges, setEdges, params), [setEdges, edges]);

  const handleNew = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleSave = async () => {
    await saveFlow(nodes, edges, nodeIdCounter);
  };

  const handleLoad = async () => {
    const { loadedNodes, nodeCounter } = await loadFlow(setEdges);
    setNodes(loadedNodes);
    setNodeIdCounter(nodeCounter);
  };

  const handleRun = () => {
    alert('No Imp this button');
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <nav ref={menuBarRef} style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
        <button onClick={handleNew}>New</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={handleRun}>Run</button>
      </nav>
      <div style={{ height: `${canvasHeight}px`, width: '100%' }}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneContextMenu={handlePaneContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onClick={handleCloseContextMenu}
          onConnect={onConnect}
          connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
          connectOnClick={false}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
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
          ) : contextMenu.isEdge ? (
            <button onClick={handleDeleteEdge}>Delete Edge</button>
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
