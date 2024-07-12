// Node.js

import { memo, useCallback, useState, useEffect } from 'react';
import NodeLayout from './NodeLayout';

function Node({ data, isConnectable, id, prevs }) {
  const [nodeData, setNodeData] = useState(data);

  useEffect(() => {
    setNodeData(data);
  }, [data]);

  const onChangeName = useCallback((evt) => {
    setNodeData((prevData) => ({ ...prevData, name: evt.target.value }));
  }, []);

  const onChangeDescription = useCallback((evt) => {
    setNodeData((prevData) => ({ ...prevData, description: evt.target.value }));
  }, []);

  const onChangeType = useCallback((evt) => {
    setNodeData((prevData) => ({ ...prevData, type: evt.target.value }));
  }, []);

  const onChangeTool = useCallback((tool) => {
    setNodeData((prevData) => ({ ...prevData, tool }));
  }, []);

  const onResize = useCallback((width, height) => {
    setNodeData((prevData) => ({ ...prevData, width, height }));
  }, []);

  return (
    <NodeLayout
      data={nodeData}
      isConnectable={isConnectable}
      onChangeName={onChangeName}
      onChangeDescription={onChangeDescription}
      onChangeType={onChangeType}
      onChangeTool={onChangeTool}
      onResize={onResize}
      prevs={prevs}
    />
  );
}

export const addNode = (nodes, setNodes, nodeIdCounter, setNodeIdCounter, newPosition) => {
  const newNode = {
    id: nodeIdCounter.toString(),
    type: 'textUpdater',
    data: { name: `Node ${nodeIdCounter}`, description: '', type: 'STEP', nexts: [], true_next: null, false_next: null, width: 200, height: 200 },
    position: newPosition,
    prevs: []
  };
  setNodes((nds) => nds.concat(newNode));
  setNodeIdCounter(nodeIdCounter + 1);
};

export const deleteNode = (nodes, setNodes, edges, setEdges, nodeId) => {
  const nodeToDelete = nodes.find((node) => node.id === nodeId);
  if (!nodeToDelete) return;

  // Remove the node itself
  setNodes((nds) => nds.filter((node) => node.id !== nodeId));

  // Remove edges connected to this node
  setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

  // Remove references from other nodes
  setNodes((nds) =>
    nds.map((node) => {
      if (node.data.nexts.includes(nodeId)) {
        return { ...node, data: { ...node.data, nexts: node.data.nexts.filter((id) => id !== nodeId) } };
      }
      if (node.prevs.includes(nodeId)) {
        return { ...node, prevs: node.prevs.filter((id) => id !== nodeId) };
      }
      if (node.data.true_next === nodeId) {
        return { ...node, data: { ...node.data, true_next: null } };
      }
      if (node.data.false_next === nodeId) {
        return { ...node, data: { ...node.data, false_next: null } };
      }
      return node;
    })
  );
};

export default memo(Node);
