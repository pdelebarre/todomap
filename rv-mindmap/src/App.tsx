import React, { useEffect,useState, useCallback } from "react";
import "./App.css";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node as XYNode,
  Connection,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
} from "@xyflow/react";

// Alias the Node type from @xyflow/react to avoid conflicts with the global Node type
type FlowNode = XYNode;
type FlowEdge = Edge;
import CustomEdge from "./components/CustomEdge";
import "@xyflow/react/dist/style.css";
import NodeManager from "./components/NodeManager";
import "./components/NodeManager.css";
import CustomNode from "./components/CustomNode";
import "./components/CustomNode.css";
import NodeControls from "./components/NodeControls";
import "./components/NodeControls.css";
import { api } from './services/api';

// Define node and edge types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const FlowWithProvider = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

function Flow() {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [nodesData, edgesData] = await Promise.all([
          api.fetchNodes(),
          api.fetchEdges()
        ]);
        setNodes(nodesData);
        setEdges(edgesData);
      } catch (error) {
        console.error('Failed to load flow data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const onNodesChange = useCallback(async (changes: any) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodes(updatedNodes);

    // Sync position changes with backend
    for (const change of changes) {
      if (change.type === 'position' && change.positionAbsolute) {
        try {
          await api.updateNode(change.id, {
            position: change.position
          });
        } catch (error) {
          console.error('Failed to update node position:', error);
        }
      }
    }
  }, [nodes]);

  const onEdgesChange = useCallback(async (changes: any) => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    setEdges(updatedEdges);

    // Sync edge changes with backend
    for (const change of changes) {
      if (change.type === 'remove') {
        try {
          await api.deleteEdge(change.id);
        } catch (error) {
          console.error('Failed to delete edge:', error);
        }
      }
    }
  }, [edges]);

  const onConnect = useCallback(async (params: Connection) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      type: 'custom',
      animated: true,
      label: 'Connection'
    };

    try {
      const createdEdge = await api.createEdge(newEdge);
      setEdges((eds) => addEdge(createdEdge, eds));
    } catch (error) {
      console.error('Failed to create edge:', error);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          api={api}
        />
        <NodeControls 
          nodes={nodes} 
          setNodes={setNodes}
          api={api}
        />
        
        {/* Help tooltip */}
        <div className="help-tooltip">
          <h4>Node Editing</h4>
          <p>
            <span className="shortcut">Click</span> Edit node label directly
          </p>
        </div>
      </div>
    </div>
  );
}

export default FlowWithProvider;
