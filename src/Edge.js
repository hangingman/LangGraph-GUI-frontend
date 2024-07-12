// Edge.js

import { addEdge } from 'reactflow';

export const createEdge = (edges, setEdges, params) => {
  setEdges((eds) => addEdge({ ...params, id: `e${params.source}-${params.target}`, animated: true }, eds));
};

export const deleteEdge = (edges, setEdges, edgeId) => {
  setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
};
