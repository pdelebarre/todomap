import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

const CustomNode = ({ id, data, isConnectable }) => {
  const { setNodes, getNode, getNodes, setEdges, getEdges } = useReactFlow();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Toggle collapse/expand state
  const toggleCollapsed = useCallback(() => {
    setNodes((nodes) => 
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              collapsed: !node.data.collapsed
            }
          };
        }
        return node;
      })
    );

    // Hide/show child nodes based on collapsed state
    const currentNode = getNode(id);
    const isCollapsing = !currentNode.data.collapsed;
    const allNodes = getNodes();
    const allEdges = getEdges();
    
    // Find all descendant nodes that should be hidden/shown
    const descendants = findDescendants(id, allNodes, allEdges, isCollapsing);
    
    if (isCollapsing) {
      // Hide descendants when collapsing
      setNodes((nodes) =>
        nodes.map((node) =>
          descendants.includes(node.id)
            ? { ...node, hidden: true }
            : node
        )
      );
    } else {
      // Show direct children when expanding
      const directChildren = findDirectChildren(id, allNodes, allEdges);
      setNodes((nodes) =>
        nodes.map((node) =>
          directChildren.includes(node.id)
            ? { ...node, hidden: false }
            : node
        )
      );
    }
  }, [id, setNodes, getNode, getNodes, getEdges, setEdges]);

  // Find all descendant nodes recursively
  const findDescendants = (nodeId, nodes, edges, includeCollapsed = false) => {
    const childEdges = edges.filter(e => e.source === nodeId);
    const childIds = childEdges.map(e => e.target);
    
    let descendants = [...childIds];
    
    for (const childId of childIds) {
      const childNode = nodes.find(n => n.id === childId);
      if (!childNode) continue;
      
      // Only traverse further if the child is not collapsed or we're including all descendants
      if (includeCollapsed || !childNode.data.collapsed) {
        const childDescendants = findDescendants(childId, nodes, edges, includeCollapsed);
        descendants = [...descendants, ...childDescendants];
      }
    }
    
    return descendants;
  };

  // Find direct children of a node
  const findDirectChildren = (nodeId, nodes, edges) => {
    const childEdges = edges.filter(e => e.source === nodeId);
    return childEdges.map(e => e.target);
  };

  // Determine node type class
  const nodeTypeClass = data.nodeType === 'project' ? 'project-node' : 'task-node';
  const hasChildren = data.hasChildren || false;
  
  return (
    <div className={`custom-node ${nodeTypeClass} ${data.completed ? 'completed-node' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="custom-node-content">
        <div className="custom-node-header">
          {hasChildren && (
            <div 
              className={`collapse-icon ${data.collapsed ? 'collapsed' : 'expanded'}`}
              onClick={toggleCollapsed}
            >
              {data.collapsed ? '▶' : '▼'}
            </div>
          )}
          <div className="custom-node-label">{data.label}</div>
          {data.nodeType === 'project' && <div className="node-type-badge">Project</div>}
        </div>
        
        <div className="custom-node-metadata">
          {data.dateOpened && (
            <div className="metadata-item">
              <span className="metadata-label">Opened:</span> 
              <span className="metadata-value">{formatDate(data.dateOpened)}</span>
            </div>
          )}
          {data.targetDate && (
            <div className="metadata-item">
              <span className="metadata-label">Target:</span> 
              <span className="metadata-value">{formatDate(data.targetDate)}</span>
            </div>
          )}
          {data.completionDate && (
            <div className="metadata-item">
              <span className="metadata-label">Completed:</span> 
              <span className="metadata-value">{formatDate(data.completionDate)}</span>
            </div>
          )}
        </div>
        
        {data.description && (
          <div className="custom-node-description">{data.description}</div>
        )}
        
        {data.comment && (
          <div className="custom-node-comment">
            <div className="comment-label">Comment:</div>
            <div className="comment-text">{data.comment}</div>
          </div>
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
