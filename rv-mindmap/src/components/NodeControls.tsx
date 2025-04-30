import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import './NodeControls.css';

// Assuming Edge is part of the @xyflow/react library
import { Edge } from '@xyflow/react';

interface NodeControlsProps {
  nodes: any;
  setNodes: any;
  api: {
    fetchNodes(): Promise<Node[]>;
    createNode(node: Partial<Node>): Promise<Node>;
    updateNode(id: string, data: Partial<Node>): Promise<void>;
    deleteNode(id: string): Promise<void>;
    fetchEdges(): Promise<Edge[]>;
    createEdge(edge: Partial<Edge>): Promise<Edge>;
    deleteEdge(id: string): Promise<void>;
  };
}

const NodeControls = ({ nodes, setNodes }: NodeControlsProps) => {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();

  // Center the view on a specific node
  const centerNode = useCallback((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.5 });
    }
  }, [nodes, setCenter]);

  // Fit view to see all nodes
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  // Arrange nodes in a circle layout
  const arrangeCircle = useCallback(() => {
    if (nodes.length <= 1) return;

    const centerX = 0;
    const centerY = 0;
    const radius = Math.max(nodes.length * 30, 200);
    const angleStep = (2 * Math.PI) / nodes.length;

    const updatedNodes = nodes.map((node, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        position: { x, y },
      };
    });

    setNodes(updatedNodes);
    setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 50);
  }, [nodes, setNodes, fitView]);

  // Arrange nodes in a grid layout
  const arrangeGrid = useCallback(() => {
    if (nodes.length <= 1) return;

    const nodeCount = nodes.length;
    const cols = Math.ceil(Math.sqrt(nodeCount));
    const gridSize = 200;

    const updatedNodes = nodes.map((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      return {
        ...node,
        position: { x: col * gridSize, y: row * gridSize },
      };
    });

    setNodes(updatedNodes);
    setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 50);
  }, [nodes, setNodes, fitView]);

  return (
    <div className="node-controls">
      <h3>Layout Controls</h3>
      <div className="control-buttons">
        <button onClick={handleFitView} className="control-btn">
          Fit View
        </button>
        <button onClick={() => zoomIn()} className="control-btn">
          Zoom In
        </button>
        <button onClick={() => zoomOut()} className="control-btn">
          Zoom Out
        </button>
      </div>

      <h4>Arrange Nodes</h4>
      <div className="control-buttons">
        <button 
          onClick={arrangeCircle} 
          className="layout-btn circle-layout"
        >
          Circle Layout
        </button>
        <button 
          onClick={arrangeGrid} 
          className="layout-btn grid-layout"
        >
          Grid Layout
        </button>
      </div>

      {nodes.length > 0 && (
        <div className="node-focus">
          <h4>Focus Node</h4>
          <div className="node-focus-list">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => centerNode(node.id)}
                className="focus-btn"
                title={node.data.description || ''}
              >
                {node.data.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeControls;
