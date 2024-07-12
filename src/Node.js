// Node.js

import { memo, useCallback } from 'react';
import NodeLayout from './NodeLayout';

function Node({ data, isConnectable }) {
  const onChangeLabel = useCallback((evt) => {
    data.label = evt.target.value;
  }, [data]);

  const onChangeDescription = useCallback((evt) => {
    data.description = evt.target.value;
  }, [data]);

  return (
    <NodeLayout
      data={data}
      isConnectable={isConnectable}
      onChangeLabel={onChangeLabel}
      onChangeDescription={onChangeDescription}
    />
  );
}

export default memo(Node);
