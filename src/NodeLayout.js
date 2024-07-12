import React, { useCallback } from 'react';
import { Handle, Position, NodeResizeControl } from 'reactflow';

const handleStyle = { top: 10 };

function NodeLayout({ data, isConnectable, onChangeLabel, onChangeDescription, onChangeType, onResize, onChangeTool }) {
  const handleTypeChange = useCallback((evt) => {
    const newType = evt.target.value;
    onChangeType(evt);
    // Update the node data type
    data.type = newType;
  }, [onChangeType, data]);

  const handleResize = useCallback((evt, { width, height }) => {
    onResize(width, height);
  }, [onResize]);

  return (
    <div 
      style={{ 
        border: '1px solid #eee', 
        padding: '5px', 
        borderRadius: '5px', 
        background: 'white',
        width: data.width || 200,
        height: data.height || 200,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <NodeResizeControl 
        style={{ position: 'absolute', right: 5, bottom: 5 }} 
        minWidth={200} 
        minHeight={200} 
        onResize={handleResize}
      >
        <ResizeIcon />
      </NodeResizeControl>
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div>
          <label htmlFor="type" style={{ display: 'block', fontSize: '12px' }}>Type:</label>
          <select
            id="type"
            name="type"
            value={data.type}
            onChange={handleTypeChange}
            className="nodrag"
            style={{ width: 'calc(100% - 20px)' }}
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
                  style={{ width: 'calc(100% - 20px)' }}
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
                  style={{ width: 'calc(100% - 20px)' }}
                />
              </div>
            )}
            {['STEP', 'TOOL', 'CONDITION'].includes(data.type) && (
              <div style={{ flex: 1 }}>
                <label htmlFor="description" style={{ display: 'block', fontSize: '12px' }}>Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={onChangeDescription}
                  className="nodrag"
                  style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 30px)', resize: 'none' }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 0, bottom: 0 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

export default React.memo(NodeLayout);
