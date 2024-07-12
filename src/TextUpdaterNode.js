import { memo, useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

const handleStyle = { top: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const nodeRef = useRef(null);
  const [nodeWidth, setNodeWidth] = useState(100);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    data.label = evt.target.value;
  }, [data]);

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
      <div>
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag"
          style={{ width: nodeWidth - 20 }} // Adjust the width minus padding/margins if necessary
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default memo(TextUpdaterNode);
