// NodeLayout.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

const handleStyle = { top: 10 };

function NodeLayout({ data, isConnectable, onChangeLabel, onChangeDescription, onChangeType, onResize, onChangeTool }) {
  const nodeRef = useRef(null);
  const [nodeWidth, setNodeWidth] = useState(data.width || 100);
  const [nodeHeight, setNodeHeight] = useState(data.height || 30);

  const updateNodeSize = useCallback(() => {
    if (nodeRef.current) {
      const newWidth = nodeRef.current.offsetWidth;
      const newHeight = nodeRef.current.offsetHeight;
      setNodeWidth(newWidth);
      setNodeHeight(newHeight);
      onResize(newWidth, newHeight);
    }
  }, [onResize]);

  useEffect(() => {
    const observer = new ResizeObserver(updateNodeSize);
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, [updateNodeSize]);

  useEffect(() => {
    updateNodeSize();
  }, [data.label, data.description, data.type]);

  return (
    <div ref={nodeRef} style={{ border: '1px solid #eee', padding: '5px', borderRadius: '5px', background: 'white' }}>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="true"
        style={{ background: 'green' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ background: 'red' }}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="type" style={{ display: 'block', fontSize: '12px' }}>Type:</label>
        <select
          id="type"
          name="type"
          value={data.type}
          onChange={onChangeType}
          className="nodrag"
          style={{ width: nodeWidth - 20 }}
        >
          <option value="START">START</option>
          <option value="STEP">STEP</option>
          <option value="TOOL">TOOL</option>
          <option value="CONDITION">CONDITION</option>
        </select>
      </div>
      {data.type !== 'START' && (
        <>
          {['STEP', 'CONDITION'].includes(data.type) && (
            <div>
              <label htmlFor="text" style={{ display: 'block', fontSize: '12px' }}>Name:</label>
              <input
                id="text"
                name="text"
                value={data.label}
                onChange={onChangeLabel}
                className="nodrag"
                style={{ width: nodeWidth - 20 }}
              />
            </div>
          )}
          {['STEP', 'TOOL', 'CONDITION'].includes(data.type) && (
            <div>
              <label htmlFor="description" style={{ display: 'block', fontSize: '12px' }}>Description:</label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={onChangeDescription}
                className="nodrag"
                style={{ width: nodeWidth - 20, resize: 'none' }}
              />
            </div>
          )}
          {data.type === 'STEP' && (
            <div>
              <label htmlFor="tool" style={{ display: 'block', fontSize: '12px' }}>Tool:</label>
              <input
                id="tool"
                name="tool"
                value={data.tool}
                onChange={(evt) => onChangeTool(evt.target.value)}
                className="nodrag"
                style={{ width: nodeWidth - 20 }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NodeLayout;
