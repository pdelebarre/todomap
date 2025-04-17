import React, { useState } from 'react';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NodeManager = ({ nodes, setNodes, onAddNode = null }) => {
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Create a new node
  const handleAddNode = useCallback(() => {
    if (!nodeName.trim()) return;
    
    const newNode = {
      id: uuidv4(),
      data: { 
        label: nodeName,
        description: nodeDescription 
      },
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      type: 'custom', // Use our custom node type
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
    setNodeDescription('');
    
    if (onAddNode) {
      onAddNode(newNode);
    }
  }, [nodeName, setNodes, onAddNode]);

  // Update an existing node
  const handleUpdateNode = useCallback(() => {
    if (!selectedNode || !nodeName.trim()) return;
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                label: nodeName,
                description: nodeDescription 
              } 
            }
          : node
      )
    );
    
    setNodeName('');
    setNodeDescription('');
    setSelectedNode(null);
    setIsEditing(false);
  }, [selectedNode, nodeName, setNodes]);

  // Delete a node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
      setNodeName('');
      setIsEditing(false);
    }
  }, [selectedNode, setNodes]);

  // Select a node for editing
  const handleSelectNode = useCallback((node) => {
    setSelectedNode(node);
    setNodeName(node.data.label);
    setNodeDescription(node.data.description || '');
    setIsEditing(true);
  }, []);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setSelectedNode(null);
    setNodeName('');
    setNodeDescription('');
    setIsEditing(false);
  }, []);

  return (
    <div className="node-manager">
      <h3>Node Manager</h3>
      <div className="node-form">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Enter node name"
          className="node-input"
        />
        <textarea
          value={nodeDescription}
          onChange={(e) => setNodeDescription(e.target.value)}
          placeholder="Enter node description (optional)"
          className="node-textarea"
          rows="3"
        />
        {isEditing ? (
          <div className="button-group">
            <button onClick={handleUpdateNode} className="update-btn">
              Update
            </button>
            <button onClick={handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleAddNode} className="add-btn">
            Add Node
          </button>
        )}
      </div>

      <div className="node-list">
        <h4>Existing Nodes</h4>
        {nodes.length === 0 ? (
          <p>No nodes available</p>
        ) : (
          <ul>
            {nodes.map((node) => (
              <li key={node.id} className="node-item">
                <span className="node-label">{node.data.label}</span>
                <div className="node-actions">
                  <button
                    onClick={() => handleSelectNode(node)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NodeManager;
