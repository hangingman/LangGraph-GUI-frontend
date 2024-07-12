// FileUtils.js

import NodeData from './NodeData';
import { createEdge } from './Edge';

export const saveFlow = async (nodes, nodeIdCounter) => {
  const nodesData = nodes.map((node) => NodeData.fromReactFlowNode(node));

  const flowData = {
    nodes: nodesData.map((node) => node.toDict()),
    node_counter: nodeIdCounter,
  };

  const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: 'flow.json',
    types: [
      {
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] },
      },
    ],
  });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  alert('Flow saved!');
};

export const loadFlow = async (setEdges, setNodes) => {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] },
      },
    ],
    multiple: false,
  });
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const flowData = JSON.parse(contents);

  const loadedNodes = (flowData.nodes || []).map((nodeData) => NodeData.fromDict(nodeData).toReactFlowNode());
  const loadedEdges = [];

  // Recreate edges based on nexts attribute of nodes
  loadedNodes.forEach((node) => {
    const nodeData = NodeData.fromDict(node.data);
    nodeData.nexts.forEach((nextId) => {
      createEdge(loadedEdges, setEdges, { source: node.id, target: nextId }, loadedNodes, setNodes);
    });
  });

  setNodes(loadedNodes);
  setEdges(loadedEdges);

  return { loadedNodes, loadedEdges, nodeCounter: flowData.node_counter || 1 };
};
