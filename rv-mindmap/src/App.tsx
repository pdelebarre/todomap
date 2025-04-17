import React from "react";
import { useState, useCallback } from "react";
import "./App.css";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
  Connection,
  NodeTypes,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeManager from "./components/NodeManager";
import "./components/NodeManager.css";
import CustomNode from "./components/CustomNode";
import "./components/CustomNode.css";
import NodeControls from "./components/NodeControls";
import "./components/NodeControls.css";

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Hello", description: "This is the root node" },
    position: { x: 0, y: 0 },
    type: "custom",
  },
  {
    id: "2",
    data: { label: "World", description: "Connected to the root node" },
    position: { x: 100, y: 100 },
    type: "custom",
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Connection',
  },
];

const FlowWithProvider = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="app-container">
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{ 
            animated: true,
            style: { strokeWidth: 2 }
          }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
        <NodeManager 
          nodes={nodes} 
          setNodes={setNodes} 
        />
        <NodeControls 
          nodes={nodes} 
          setNodes={setNodes} 
        />
      </div>
    </div>
  );
}

export default FlowWithProvider;
