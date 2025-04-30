import { Node, Edge } from '@xyflow/react';

const API_BASE_URL = 'http://localhost:8080/api'; // adjust to your API URL

export const api = {
  // Nodes
  async fetchNodes(): Promise<Node[]> {
    const response = await fetch(`${API_BASE_URL}/nodes`);
    return response.json();
  },

  async createNode(node: Partial<Node>): Promise<Node> {
    const response = await fetch(`${API_BASE_URL}/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    return response.json();
  },

  async updateNode(id: string, updates: Partial<Node>): Promise<Node> {
    const response = await fetch(`${API_BASE_URL}/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  async deleteNode(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/nodes/${id}`, {
      method: 'DELETE',
    });
  },

  // Edges
  async fetchEdges(): Promise<Edge[]> {
    const response = await fetch(`${API_BASE_URL}/edges`);
    return response.json();
  },

  async createEdge(edge: Edge): Promise<Edge> {
    const response = await fetch(`${API_BASE_URL}/edges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edge),
    });
    return response.json();
  },

  async updateEdge(id: string, updates: Partial<Edge>): Promise<Edge> {
    const response = await fetch(`${API_BASE_URL}/edges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  async deleteEdge(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/edges/${id}`, {
      method: 'DELETE',
    });
  }
};