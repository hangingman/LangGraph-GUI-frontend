// FileUtils.js

import NodeData from './NodeData';

export const saveFlow = async (nodes, edges, nodeIdCounter) => {
  const nodesData = nodes.map((node) => NodeData.fromReactFlowNode(node));
  const edgesData = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: edge.animated,
  }));

  const flowData = {
    nodes: nodesData.map(node => node.toDict()),
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

export const loadFlow = async () => {
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

  const loadedNodes = flowData.nodes.map(nodeData => NodeData.fromDict(nodeData).toReactFlowNode());
  const loadedEdges = [];

  flowData.nodes.forEach(nodeData => {
    nodeData.nexts.forEach(nextId => {
      loadedEdges.push({
        id: `e${nodeData.uniq_id}-${nextId}`,
        source: nodeData.uniq_id.toString(),
        target: nextId.toString(),
        animated: true,
      });
    });
  });

  return { loadedNodes, loadedEdges, nodeCounter: flowData.node_counter };
};
