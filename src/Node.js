// Node.js

import { memo, useCallback } from 'react';
import NodeLayout from './NodeLayout';

function Node({ data, isConnectable, id, prevs }) {
  const onChangeLabel = useCallback((evt) => {
    data.label = evt.target.value;
  }, [data]);

  const onChangeDescription = useCallback((evt) => {
    data.description = evt.target.value;
  }, [data]);

  const onChangeType = useCallback((evt) => {
    data.type = evt.target.value;
  }, [data]);

  const onChangeTool = useCallback((tool) => {
    data.tool = tool;
  }, [data]);

  const onResize = useCallback((width, height) => {
    data.width = width;
    data.height = height;
  }, [data]);

  return (
    <NodeLayout
      data={data}
      isConnectable={isConnectable}
      onChangeLabel={onChangeLabel}
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
    data: { label: `Node ${nodeIdCounter}`, description: '', type: 'STEP', nexts: [], true_next: null, false_next: null, width: 200, height: 200 },
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
