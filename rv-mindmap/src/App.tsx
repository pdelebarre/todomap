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
  EdgeTypes,
  ReactFlowProvider,
} from "@xyflow/react";
import CustomEdge from "./components/CustomEdge";
import "@xyflow/react/dist/style.css";
import NodeManager from "./components/NodeManager";
import "./components/NodeManager.css";
import CustomNode from "./components/CustomNode";
import "./components/CustomNode.css";
import NodeControls from "./components/NodeControls";
import "./components/NodeControls.css";

// Define node and edge types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  {
    id: "1",
    data: { 
      label: "My Project", 
      description: "This is a sample project",
      nodeType: "project",
      dateOpened: new Date().toISOString().split('T')[0],
      targetDate: "",
      completionDate: "",
      completed: false,
      collapsed: false,
      hasChildren: true,
      comment: "This is the main project node"
    },
    position: { x: 0, y: 0 },
    type: "custom",
  },
  {
    id: "2",
    data: { 
      label: "Task 1", 
      description: "First task to complete",
      nodeType: "task",
      dateOpened: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completionDate: "",
      completed: false,
      collapsed: false,
      hasChildren: true,
      comment: ""
    },
    position: { x: 100, y: 100 },
    type: "custom",
  },
  {
    id: "3",
    data: { 
      label: "Subtask 1.1", 
      description: "Subtask of Task 1",
      nodeType: "task",
      dateOpened: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completionDate: "",
      completed: false,
      collapsed: false,
      hasChildren: false,
      comment: ""
    },
    position: { x: 150, y: 200 },
    type: "custom",
  },
  {
    id: "4",
    data: { 
      label: "Task 2", 
      description: "Second task to complete",
      nodeType: "task",
      dateOpened: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completionDate: "",
      completed: false,
      collapsed: false,
      hasChildren: false,
      comment: ""
    },
    position: { x: -100, y: 100 },
    type: "custom",
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    type: 'custom',
    label: 'Task',
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    animated: true,
    type: 'custom',
    label: 'Task',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    type: 'custom',
    label: 'Subtask',
  }
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
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'custom',
        animated: true,
        label: 'Connection'
      };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
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
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{ 
            animated: true,
            style: { strokeWidth: 2 },
            type: 'custom'
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
