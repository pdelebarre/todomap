import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

const CustomNode = ({ id, data, isConnectable }) => {
  const { setNodes, getNode, getNodes, setEdges, getEdges } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [potentialParent, setPotentialParent] = useState(null);
  const nodeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const focusCounter = useRef(0);

  const [editFields, setEditFields] = useState({
    label: data.label,
    description: data.description || "",
    comment: data.comment || "",
    nodeType: data.nodeType || "task",
    dateOpened: data.dateOpened || "",
    targetDate: data.targetDate || "",
    completionDate: data.completionDate || "",
    completed: data.completed || false,
  });

  const inputRefs = {
    label: useRef(null),
    description: useRef(null),
    comment: useRef(null),
    dateOpened: useRef(null),
    targetDate: useRef(null),
    completionDate: useRef(null),
    nodeType: useRef(null),
    completed: useRef(null),
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const toggleCollapsed = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              collapsed: !node.data.collapsed,
            },
          };
        }
        return node;
      })
    );

    const currentNode = getNode(id);
    const isCollapsing = !currentNode.data.collapsed;
    const allNodes = getNodes();
    const allEdges = getEdges();
    const descendants = findDescendants(id, allNodes, allEdges, isCollapsing);

    if (isCollapsing) {
      setNodes((nodes) =>
        nodes.map((node) =>
          descendants.includes(node.id) ? { ...node, hidden: true } : node
        )
      );
    } else {
      const directChildren = findDirectChildren(id, allNodes, allEdges);
      setNodes((nodes) =>
        nodes.map((node) =>
          directChildren.includes(node.id) ? { ...node, hidden: false } : node
        )
      );
    }
  }, [id, setNodes, getNode, getNodes, getEdges, setEdges]);

  const findDescendants = (nodeId, nodes, edges, includeCollapsed = false) => {
    const childEdges = edges.filter((e) => e.source === nodeId);
    const childIds = childEdges.map((e) => e.target);
    let descendants = [...childIds];
    for (const childId of childIds) {
      const childNode = nodes.find((n) => n.id === childId);
      if (!childNode) continue;
      if (includeCollapsed || !childNode.data.collapsed) {
        const childDescendants = findDescendants(
          childId,
          nodes,
          edges,
          includeCollapsed
        );
        descendants = [...descendants, ...childDescendants];
      }
    }
    return descendants;
  };

  const findDirectChildren = (nodeId, nodes, edges) => {
    const childEdges = edges.filter((e) => e.source === nodeId);
    return childEdges.map((e) => e.target);
  };

  const nodeTypeClass =
    data.nodeType === "project" ? "project-node" : "task-node";
  const hasChildren = data.hasChildren || false;

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      setIsEditing(true);
      setEditFields({
        label: data.label,
        description: data.description || "",
        comment: data.comment || "",
        nodeType: data.nodeType || "task",
        dateOpened: data.dateOpened || "",
        targetDate: data.targetDate || "",
        completionDate: data.completionDate || "",
        completed: data.completed || false,
      });
      setTimeout(() => {
        if (inputRefs.label.current) {
          inputRefs.label.current.focus();
          inputRefs.label.current.select();
        }
      }, 10);
    },
    [data, inputRefs.label]
  );

  const handleFieldChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditFields((fields) => ({
      ...fields,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleEditComplete = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...editFields,
              },
            }
          : node
      )
    );
    setIsEditing(false);
  }, [id, editFields, setNodes]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleEditComplete();
      } else if (event.key === "Escape") {
        setIsEditing(false);
      }
    },
    [handleEditComplete]
  );

  const handleFocus = () => {
    focusCounter.current++;
  };

  const handleBlur = () => {
    focusCounter.current--;
    setTimeout(() => {
      if (focusCounter.current <= 0) {
        handleEditComplete();
      }
    }, 10);
  };

  return (
    <div
      className={`custom-node ${nodeTypeClass} ${
        data.completed ? "completed-node" : ""
      } ${isDragging ? "dragging" : ""} ${potentialParent ? "can-drop" : ""}`}
      style={{
        background: data.completed ? "#e0e0e0" : undefined, // grey background if completed
        // ...other styles...
      }}
      onMouseDown={() => {}}
      ref={nodeRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1} // required to capture blur/focus events on div
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="custom-node-content">
        {isDragging && <div className="drag-indicator">Reassigning...</div>}
        <div className="custom-node-header">
          {hasChildren && (
            <div
              className={`collapse-icon ${
                data.collapsed ? "collapsed" : "expanded"
              }`}
              onClick={toggleCollapsed}
            >
              {data.collapsed ? "▶" : "▼"}
            </div>
          )}
          {isEditing ? (
            <div style={{ width: "100%" }}>
              <input
                ref={inputRefs.label}
                className="node-edit-input"
                name="label"
                value={editFields.label}
                onChange={handleFieldChange}
                onKeyDown={handleKeyPress}
                placeholder="Title"
                style={{ marginBottom: 4, width: "100%" }}
              />
              <textarea
                ref={inputRefs.description}
                className="node-edit-input"
                name="description"
                value={editFields.description}
                onChange={handleFieldChange}
                placeholder="Description"
                style={{ marginBottom: 4, width: "100%" }}
                rows={2}
              />
              <textarea
                ref={inputRefs.comment}
                className="node-edit-input"
                name="comment"
                value={editFields.comment}
                onChange={handleFieldChange}
                placeholder="Comment"
                style={{ marginBottom: 4, width: "100%" }}
                rows={2}
              />
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <select
                  ref={inputRefs.nodeType}
                  name="nodeType"
                  value={editFields.nodeType}
                  onChange={handleFieldChange}
                  className="node-edit-input"
                  style={{ flex: 1 }}
                >
                  <option value="project">Project</option>
                  <option value="task">Task</option>
                </select>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <input
                    ref={inputRefs.completed}
                    type="checkbox"
                    name="completed"
                    checked={editFields.completed}
                    onChange={handleFieldChange}
                  />
                  Completed
                </label>
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <input
                  ref={inputRefs.dateOpened}
                  className="node-edit-input"
                  name="dateOpened"
                  type="date"
                  value={editFields.dateOpened}
                  onChange={handleFieldChange}
                  style={{ flex: 1 }}
                />
                <input
                  ref={inputRefs.targetDate}
                  className="node-edit-input"
                  name="targetDate"
                  type="date"
                  value={editFields.targetDate}
                  onChange={handleFieldChange}
                  style={{ flex: 1 }}
                />
                {editFields.completed && (
                  <input
                    ref={inputRefs.completionDate}
                    className="node-edit-input"
                    name="completionDate"
                    type="date"
                    value={editFields.completionDate}
                    onChange={handleFieldChange}
                    style={{ flex: 1 }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              className="custom-node-label"
              onClick={handleClick}
              title="Click to edit"
            >
              {data.label}
              <span style={{ marginLeft: 6, fontSize: 12, color: "#aaa" }}>
                ✎
              </span>
            </div>
          )}
          {data.nodeType === "project" && (
            <div className="node-type-badge">Project</div>
          )}
        </div>

        <div className="custom-node-metadata">
          {data.dateOpened && (
            <div className="metadata-item">
              <span className="metadata-label">Opened:</span>
              <span className="metadata-value">
                {formatDate(data.dateOpened)}
              </span>
            </div>
          )}
          {data.targetDate && (
            <div className="metadata-item">
              <span className="metadata-label">Target:</span>
              <span className="metadata-value">
                {formatDate(data.targetDate)}
              </span>
            </div>
          )}
        </div>

        {isEditing && (
          <>
            {editFields.completionDate && (
              <div className="metadata-item">
                <span className="metadata-label">Completed:</span>
                <span className="metadata-value">
                  {formatDate(editFields.completionDate)}
                </span>
              </div>
            )}
            {editFields.description && (
              <div className="custom-node-description">
                {editFields.description}
              </div>
            )}
            {editFields.comment && (
              <div className="custom-node-comment">
                <div className="comment-label">Comment:</div>
                <div className="comment-text">{editFields.comment}</div>
              </div>
            )}
          </>
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
