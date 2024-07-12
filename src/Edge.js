// Edge.js

import { addEdge } from 'reactflow';

export const createEdge = (edges, setEdges, params, nodes, setNodes) => {
  const { source, target } = params;

  setEdges((eds) => addEdge({
    ...params,
    id: `e${source}-${target}`,
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
    },
  }, eds));

  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === source) {
        const newData = { ...node.data, nexts: [...node.data.nexts, target] };
        return { ...node, data: newData };
      } else if (node.id === target) {
        const newData = { ...node.data, prev: [...node.data.prev || [], source] };
        return { ...node, data: newData };
      }
      return node;
    })
  );
};

export const deleteEdge = (edges, setEdges, edgeId, nodes, setNodes) => {
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));

  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === edge.source) {
        const newData = { ...node.data, nexts: node.data.nexts.filter((id) => id !== edge.target) };
        return { ...node, data: newData };
      } else if (node.id === edge.target) {
        const newData = { ...node.data, prev: node.data.prev.filter((id) => id !== edge.source) };
        return { ...node, data: newData };
      }
      return node;
    })
  );
};
