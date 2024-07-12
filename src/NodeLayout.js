// NodeLayout.js

import { useRef, useEffect, useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import './text-updater-node.css';

const handleStyle = { top: 10 };

function NodeLayout({ data, isConnectable, onChangeLabel, onChangeDescription }) {
  const nodeRef = useRef(null);
  const [nodeWidth, setNodeWidth] = useState(100);

  useEffect(() => {
    const updateNodeWidth = () => {
      if (nodeRef.current) {
        setNodeWidth(nodeRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(updateNodeWidth);
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, []);

  return (
    <div ref={nodeRef} className="text-updater-node">
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
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          value={data.label}
          onChange={onChangeLabel}
          className="nodrag"
          style={{ width: nodeWidth - 20 }}
        />
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          name="description"
          value={data.description}
          onChange={onChangeDescription}
          className="nodrag"
          style={{ width: nodeWidth - 20 }}
        />
      </div>
    </div>
  );
}

export default NodeLayout;
