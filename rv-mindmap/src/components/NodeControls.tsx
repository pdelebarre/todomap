// src/components/NodeControls.tsx
import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import "./NodeControls.css";
import { Edge } from "@xyflow/react";

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

const NODE_WIDTH = 180;
const NODE_HEIGHT = 100;
const PADDING = 40;

const NodeControls = ({ nodes, setNodes }: NodeControlsProps) => {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();

  const centerNode = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setCenter(node.position.x, node.position.y, {
          duration: 800,
          zoom: 1.5,
        });
      }
    },
    [nodes, setCenter]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  const arrangeCircle = useCallback(() => {
    if (nodes.length <= 1) return;

    const radius = Math.max(
      ((NODE_WIDTH + PADDING) * nodes.length) / (2 * Math.PI),
      200
    );
    const angleStep = (2 * Math.PI) / nodes.length;

    const updatedNodes = nodes.map((node, index) => {
      const angle = index * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      return {
        ...node,
        position: { x, y },
      };
    });

    setNodes(updatedNodes);
    setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 50);
  }, [nodes, setNodes, fitView]);

  const arrangeGrid = useCallback(() => {
    if (nodes.length <= 1) return;

    const cols = Math.ceil(Math.sqrt(nodes.length));
    const cellWidth = NODE_WIDTH + PADDING;
    const cellHeight = NODE_HEIGHT + PADDING;

    const updatedNodes = nodes.map((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      return {
        ...node,
        position: { x: col * cellWidth, y: row * cellHeight },
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
        <button onClick={arrangeCircle} className="layout-btn circle-layout">
          Circle Layout
        </button>
        <button onClick={arrangeGrid} className="layout-btn grid-layout">
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
                title={node.data.description || ""}
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
