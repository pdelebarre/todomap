# React Mindmap with Node Management

A React-based mindmap application with advanced node management capabilities built using React Flow.

## Features

### Node Management
- **Add Nodes**: Create new nodes with custom labels and descriptions
- **Edit Nodes**: Modify existing node content
- **Delete Nodes**: Remove nodes from the mindmap
- **Node Listing**: View all nodes in a convenient sidebar

### Layout Controls
- **Arrange Nodes**: Automatically arrange nodes in circle or grid layouts
- **Focus Node**: Center the view on a specific node
- **Zoom Controls**: Zoom in/out and fit view to see all nodes

### Custom Node Types
- **Styled Nodes**: Custom-styled nodes with descriptions
- **Connection Points**: Nodes have connection points for creating relationships

## Components

### NodeManager
The NodeManager component provides a user interface for adding, editing, and deleting nodes. It includes:
- Input field for node name
- Textarea for node description
- Add/Update/Cancel buttons
- List of existing nodes with edit/delete options

### NodeControls
The NodeControls component provides layout and view management features:
- Fit view button to see all nodes
- Zoom in/out buttons
- Layout arrangement options (circle, grid)
- Node focus list for quick navigation

### CustomNode
A custom node component that displays:
- Node label
- Optional node description
- Connection handles for creating edges

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the URL shown in the terminal

## Usage

1. **Adding Nodes**: Enter a name and optional description in the Node Manager panel, then click "Add Node"
2. **Editing Nodes**: Click "Edit" next to a node in the list, make changes, then click "Update"
3. **Deleting Nodes**: Click "Delete" next to a node in the list
4. **Connecting Nodes**: Drag from a node's bottom handle to another node's top handle
5. **Arranging Layout**: Use the Layout Controls panel to arrange nodes in different patterns
6. **Focusing on Nodes**: Click a node name in the Focus Node list to center the view on that node

## Technologies Used

- React
- TypeScript
- React Flow (@xyflow/react)
- UUID for unique identifiers
