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

  return (
    <NodeLayout
      data={data}
      isConnectable={isConnectable}
      onChangeLabel={onChangeLabel}
      onChangeDescription={onChangeDescription}
      prevs={prevs}
    />
  );
}

export const addNode = (nodes, setNodes, nodeIdCounter, setNodeIdCounter, newPosition) => {
  const newNode = {
    id: nodeIdCounter.toString(),
    type: 'textUpdater',
    data: { label: `Node ${nodeIdCounter}`, description: '', nexts: [] },
    position: newPosition,
    prevs: []
  };
  setNodes((nds) => nds.concat(newNode));
  setNodeIdCounter(nodeIdCounter + 1);
};

export const deleteNode = (nodes, setNodes, edges, setEdges, nodeId) => {
  setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
};

export default memo(Node);
