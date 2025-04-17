import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="custom-node-content">
        <div className="custom-node-header">
          <div className="custom-node-label">{data.label}</div>
        </div>
        {data.description && (
          <div className="custom-node-description">{data.description}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(CustomNode);
