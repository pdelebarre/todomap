import React, { useState, useEffect, useCallback } from "react";

import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from '@xyflow/react';

const NodeManager = ({ nodes, setNodes, api }) => {
  const { addEdges, getEdges, setEdges } = useReactFlow();
  
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeComment, setNodeComment] = useState('');
  const [nodeType, setNodeType] = useState('task');
  const [parentNode, setParentNode] = useState('');
  const [dateOpened, setDateOpened] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Get potential parent nodes (only projects can be parents)
  const potentialParents = nodes.filter(node => 
    node.data.nodeType === 'project' || 
    // Tasks can be parents of subtasks
    (node.data.nodeType === 'task' && nodeType === 'task')
  );
  
  // Reset form when switching between add/edit modes
  useEffect(() => {
    if (!isEditing) {
      setNodeType('task');
      setParentNode('');
      setDateOpened(new Date().toISOString().split('T')[0]);
      setTargetDate('');
      setCompletionDate('');
      setCompleted(false);
      setNodeComment('');
    }
  }, [isEditing]);

  // Reset form fields
  const resetForm = useCallback(() => {
    setNodeName('');
    setNodeDescription('');
    setNodeComment('');
    setNodeType('task');
    setParentNode('');
    setDateOpened(new Date().toISOString().split('T')[0]);
    setTargetDate('');
    setCompletionDate('');
    setCompleted(false);
    setShowAdvanced(false);
  }, []);

  // Create a new node
  const handleAddNode = useCallback(async () => {
    if (!nodeName.trim()) return;

    // Calculate position based on current nodes count
    const nodeIndex = nodes.length;
    const nodeSpacingY = 120; // vertical space between nodes
    const position = {
      x: 100, // fixed horizontal position for all nodes
      y: 100 + nodeIndex * nodeSpacingY,
    };

    const newNode = {
      id: uuidv4(),
      data: { 
        label: nodeName,
        description: nodeDescription,
        nodeType: nodeType,
        dateOpened: dateOpened,
        targetDate: targetDate,
        completionDate: completionDate,
        completed: completed,
        collapsed: false,
        hasChildren: false,
        comment: nodeComment
      },
      position,
      type: 'custom',
    };
    
    try {
      const createdNode = await api.createNode(newNode);
      setNodes((nds) => [...nds, createdNode]);
      
      if (parentNode) {
        const newEdge = {
          id: `e${parentNode}-${createdNode.id}`,
          source: parentNode,
          target: createdNode.id,
          animated: true,
          type: 'custom',
          label: nodeType === 'task' ? 'Task' : 'Subtask',
        };
        
        await api.createEdge(newEdge);
        addEdges([newEdge]);
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Failed to create node:', error);
    }
  }, [
    nodeName, 
    nodeDescription, 
    nodeComment, 
    nodeType, 
    parentNode, 
    dateOpened, 
    targetDate, 
    completionDate, 
    completed, 
    setNodes, 
    api, 
    addEdges,
    resetForm  // Add this dependency
  ]);

  // Update an existing node
  const handleUpdateNode = useCallback(() => {
    if (!selectedNode || !nodeName.trim()) return;
    
    const wasCompleted = selectedNode.data.completed;
    const nowCompleted = completed;
    const completionDateValue = nowCompleted && !wasCompleted 
      ? new Date().toISOString().split('T')[0] 
      : completionDate;
    
    // Check if parent has changed
    const edges = getEdges();
    const currentParentEdge = edges.find(e => e.target === selectedNode.id);
    const currentParentId = currentParentEdge ? currentParentEdge.source : null;
    
    // If parent has changed, update edges
    if (parentNode !== currentParentId) {
      // Remove old parent edge if it exists
      if (currentParentId) {
        setEdges(edges.filter(e => !(e.source === currentParentId && e.target === selectedNode.id)));
        
        // Update old parent's hasChildren status if needed
        const remainingChildEdges = edges.filter(e => 
          e.source === currentParentId && 
          e.target !== selectedNode.id
        );
        
        if (remainingChildEdges.length === 0) {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === currentParentId
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      hasChildren: false
                    } 
                  }
                : node
            )
          );
        }
      }
      
      // Add new parent edge if selected
      if (parentNode) {
        const newEdge = {
          id: `e${parentNode}-${selectedNode.id}`,
          source: parentNode,
          target: selectedNode.id,
          animated: true,
          type: 'custom',
          label: 'Subtask'
        };
        
        addEdges([newEdge]);
        
        // Update new parent's hasChildren status
        setNodes((nds) =>
          nds.map((node) =>
            node.id === parentNode
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    hasChildren: true
                  } 
                }
              : node
          )
        );
      }
    }
    
    // Update node data
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                label: nodeName,
                description: nodeDescription,
                comment: nodeComment,
                nodeType: nodeType,
                dateOpened: dateOpened,
                targetDate: targetDate,
                completionDate: completionDateValue,
                completed: completed
              } 
            }
          : node
      )
    );
    
    // Reset form
    setNodeName('');
    setNodeDescription('');
    setNodeComment('');
    setNodeType('task');
    setParentNode('');
    setDateOpened(new Date().toISOString().split('T')[0]);
    setTargetDate('');
    setCompletionDate('');
    setCompleted(false);
    setSelectedNode(null);
    setIsEditing(false);
    setShowAdvanced(false);
  }, [
    selectedNode, 
    nodeName, 
    nodeDescription, 
    nodeComment, 
    nodeType, 
    dateOpened, 
    targetDate, 
    completionDate, 
    completed,
    parentNode,
    getEdges,
    setEdges,
    addEdges,
    setNodes
  ]);

  // Delete a node and its children
  const handleDeleteNode = useCallback((nodeId) => {
    const edges = getEdges();
    
    // Find all child nodes recursively
    const findAllChildren = (id) => {
      const childEdges = edges.filter(e => e.source === id);
      const childIds = childEdges.map(e => e.target);
      
      let allChildren = [...childIds];
      
      for (const childId of childIds) {
        const grandChildren = findAllChildren(childId);
        allChildren = [...allChildren, ...grandChildren];
      }
      
      return allChildren;
    };
    
    const childrenIds = findAllChildren(nodeId);
    const allNodesToDelete = [nodeId, ...childrenIds];
    
    // Delete all edges connected to these nodes
    setEdges(edges.filter(edge => 
      !allNodesToDelete.includes(edge.source) && 
      !allNodesToDelete.includes(edge.target)
    ));
    
    // Delete all nodes
    setNodes((nds) => nds.filter((node) => !allNodesToDelete.includes(node.id)));
    
    // Update parent's hasChildren status if needed
    const parentEdges = edges.filter(e => e.target === nodeId);
    if (parentEdges.length > 0) {
      const parentId = parentEdges[0].source;
      const remainingChildEdges = edges.filter(e => 
        e.source === parentId && 
        e.target !== nodeId && 
        !childrenIds.includes(e.target)
      );
      
      if (remainingChildEdges.length === 0) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === parentId
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    hasChildren: false
                  } 
                }
              : node
          )
        );
      }
    }
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
      setNodeName('');
      setNodeDescription('');
      setNodeComment('');
      setIsEditing(false);
      setShowAdvanced(false);
    }
  }, [selectedNode, setNodes, getEdges, setEdges]);

  // Select a node for editing
  const handleSelectNode = useCallback((node) => {
    setSelectedNode(node);
    setNodeName(node.data.label);
    setNodeDescription(node.data.description || '');
    setNodeComment(node.data.comment || '');
    setNodeType(node.data.nodeType || 'task');
    setDateOpened(node.data.dateOpened || new Date().toISOString().split('T')[0]);
    setTargetDate(node.data.targetDate || '');
    setCompletionDate(node.data.completionDate || '');
    setCompleted(node.data.completed || false);
    
    // Find current parent
    const edges = getEdges();
    const currentParentEdge = edges.find(e => e.target === node.id);
    if (currentParentEdge) {
      setParentNode(currentParentEdge.source);
    } else {
      setParentNode('');
    }
    
    setIsEditing(true);
  }, [getEdges]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setSelectedNode(null);
    setNodeName('');
    setNodeDescription('');
    setNodeComment('');
    setNodeType('task');
    setParentNode('');
    setDateOpened(new Date().toISOString().split('T')[0]);
    setTargetDate('');
    setCompletionDate('');
    setCompleted(false);
    setIsEditing(false);
    setShowAdvanced(false);
  }, []);

  // Toggle completion status
  const handleToggleComplete = useCallback((node) => {
    const newCompletedState = !node.data.completed;
    const newCompletionDate = newCompletedState ? new Date().toISOString().split('T')[0] : '';
    
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? { 
              ...n, 
              data: { 
                ...n.data, 
                completed: newCompletedState,
                completionDate: newCompletionDate
              } 
            }
          : n
      )
    );
  }, [setNodes]);

  // Add a subtask to a node
  const handleAddSubtask = useCallback((parentNodeId) => {
    setNodeName('');
    setNodeDescription('');
    setNodeComment('');
    setNodeType('task');
    setParentNode(parentNodeId);
    setDateOpened(new Date().toISOString().split('T')[0]);
    setTargetDate('');
    setCompletionDate('');
    setCompleted(false);
    setIsEditing(false);
    setShowAdvanced(false);
  }, []);

  return (
    <div className="node-manager">
      <h3>Task Manager</h3>
      <div className="node-form">
        <div className="form-row">
          <select 
            value={nodeType} 
            onChange={(e) => setNodeType(e.target.value)}
            className="node-select"
          >
            <option value="project">Project</option>
            <option value="task">Task</option>
          </select>
          
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter title"
            className="node-input"
          />
        </div>
        
        <div className="form-row">
          <select 
            value={parentNode} 
            onChange={(e) => setParentNode(e.target.value)}
            className="node-select"
            disabled={isEditing && selectedNode && selectedNode.data.nodeType === 'project'}
          >
            <option value="">No Parent</option>
            {potentialParents
              .filter(node => !isEditing || node.id !== selectedNode?.id)
              .map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data.label} ({node.data.nodeType})
                </option>
              ))
            }
          </select>
        </div>
        
        <textarea
          value={nodeDescription}
          onChange={(e) => setNodeDescription(e.target.value)}
          placeholder="Enter description (optional)"
          className="node-textarea"
          rows="2"
        />
        
        <div className="form-row dates-row">
          <div className="date-field">
            <label>Opened:</label>
            <input 
              type="date" 
              value={dateOpened} 
              onChange={(e) => setDateOpened(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="date-field">
            <label>Target:</label>
            <input 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
        
        <div className="form-row">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={completed} 
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>
          
          {completed && (
            <div className="date-field completion-date">
              <label>Completion:</label>
              <input 
                type="date" 
                value={completionDate} 
                onChange={(e) => setCompletionDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}
        </div>
        
        <div className="advanced-toggle">
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="toggle-btn"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>
        
        {showAdvanced && (
          <textarea
            value={nodeComment}
            onChange={(e) => setNodeComment(e.target.value)}
            placeholder="Enter comments (optional)"
            className="node-textarea"
            rows="2"
          />
        )}
        
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
            Add {nodeType === 'project' ? 'Project' : 'Task'}
          </button>
        )}
      </div>

      <div className="node-list">
        <h4>Projects & Tasks</h4>
        {nodes.length === 0 ? (
          <p>No items available</p>
        ) : (
          <ul>
            {nodes.map((node) => (
              <li key={node.id} className={`node-item ${node.data.nodeType}-item ${node.data.completed ? 'completed-item' : ''}`}>
                <div className="node-item-header">
                  <span className="node-label">{node.data.label}</span>
                  <div className="node-actions">
                    <button
                      onClick={() => handleToggleComplete(node)}
                      className={`complete-btn ${node.data.completed ? 'uncomplete-btn' : ''}`}
                      title={node.data.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {node.data.completed ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleSelectNode(node)}
                      className="edit-btn"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleAddSubtask(node.id)}
                      className="subtask-btn"
                      title="Add subtask"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="delete-btn"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {node.data.targetDate && (
                  <div className="node-item-date">
                    Target: {new Date(node.data.targetDate).toLocaleDateString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NodeManager;
