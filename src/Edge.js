// Edge.js

import { addEdge } from 'reactflow';

export const createEdge = (edges, setEdges, params) => {
  setEdges((eds) => addEdge({
    ...params,
    id: `e${params.source}-${params.target}`,
    animated: false, // Set to false for solid stroke
    style: { stroke: '#000000', strokeWidth: 2 }, // Change stroke color to black
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
