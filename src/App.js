import React, { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from './TextUpdaterNode';
import './text-updater-node.css';

const initialNodes = [
  { id: '1', type: 'textUpdater', data: { label: 'Node 1' }, position: { x: 50, y: 150 } },
  { id: '2', type: 'textUpdater', data: { label: 'Node 2' }, position: { x: 300, y: 100 } },
  { id: '3', type: 'textUpdater', data: { label: 'Node 3' }, position: { x: 300, y: 400 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(nodes.length + 1);
  const { screenToFlowPosition } = useReactFlow();

  const handleAddNode = useCallback((event) => {
    const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
    const newNode = {
      id: nodeIdCounter.toString(),
      type: 'textUpdater',
      data: { label: `Node ${nodeIdCounter}` },
      position: newPosition,
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter(nodeIdCounter + 1);
    setContextMenu(null);
  }, [contextMenu, nodeIdCounter, setNodes, screenToFlowPosition]);

  const handleDeleteNode = useCallback(() => {
    if (contextMenu && contextMenu.nodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== contextMenu.nodeId && edge.target !== contextMenu.nodeId));
    }
    setContextMenu(null);
  }, [contextMenu, setNodes, setEdges]);

  const handleDeleteEdge = useCallback(() => {
    if (contextMenu && contextMenu.edgeId) {
      console.log('Deleting edge with ID:', contextMenu.edgeId);
      setEdges((eds) => eds.filter((edge) => edge.id !== contextMenu.edgeId));
    }
    setContextMenu(null);
  }, [contextMenu, setEdges]);

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
    console.log('Right-clicked edge ID:', edge.id);
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

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, id: `e${params.source}-${params.target}`, animated: true }, eds)), [setEdges]);

  const handleNew = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleSave = () => {
    const flowData = {
      nodes,
      edges,
    };
    localStorage.setItem('flowData', JSON.stringify(flowData));
    alert('Flow saved!');
  };

  const handleLoad = () => {
    const flowData = JSON.parse(localStorage.getItem('flowData'));
    if (flowData) {
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
    } else {
      alert('No saved flow found');
    }
  };

  const handleRun = () => {
    alert('No Imp this buttom');
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
        <button onClick={handleNew}>New</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={handleRun}>Run</button>
      </nav>
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
