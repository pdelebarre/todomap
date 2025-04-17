import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from '@xyflow/react';

const CustomEdge = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
    label
  } = props;
  
  const { setEdges } = useReactFlow();
  const [edgeLabel, setEdgeLabel] = useState(label || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDoubleClick = (evt) => {
    evt.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateEdgeLabel();
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      setIsEditing(false);
      updateEdgeLabel();
    } else if (evt.key === 'Escape') {
      setIsEditing(false);
    }
  };
  
  const updateEdgeLabel = () => {
    setEdges((edges) => 
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: edgeLabel
          };
        }
        return edge;
      })
    );
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            backgroundColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.75)',
            padding: '2px 4px',
            borderRadius: 4,
            border: selected ? '1px solid #1a192b' : 'none',
            cursor: isEditing ? 'text' : 'pointer',
          }}
          className="nodrag nopan"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              type="text"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 12,
                width: '100%',
                minWidth: '50px',
              }}
            />
          ) : (
            edgeLabel || 'Click to edit'
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
