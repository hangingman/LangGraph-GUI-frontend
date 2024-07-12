// Edge.js

import { addEdge } from 'reactflow';

export const createEdge = (edges, setEdges, params) => {
  setEdges((eds) => addEdge({
    ...params,
    id: `e${params.source}-${params.target}`,
    animated: true,
    style: { stroke: '#f6ab6c', strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      width: 20,  // Increase the width of the arrow
      height: 20, // Increase the height of the arrow
    },
  }, eds));
};

export const deleteEdge = (edges, setEdges, edgeId) => {
  setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
};
