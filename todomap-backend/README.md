# TodoMap Backend

This is the backend service for the TodoMap application, a mind mapping tool for managing projects and tasks.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **PostgreSQL 15**
- **Docker & Docker Compose** (for database)
- **Maven** (for dependency management)

## Prerequisites

- Java 17 or higher
- Docker and Docker Compose
- Maven

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todomap-backend
```

### 2. Start the PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the following configuration:
- Database: todomap
- Username: postgres
- Password: postgres
- Port: 5432

### 3. Build the Application

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

The application will start on port 8080 with the context path `/api`.

## API Endpoints

### Node Endpoints

- `GET /api/nodes` - Get all nodes
- `GET /api/nodes/{id}` - Get a node by ID
- `POST /api/nodes` - Create a new node
- `PUT /api/nodes/{id}` - Update a node
- `DELETE /api/nodes/{id}` - Delete a node
- `GET /api/nodes/type/{nodeType}` - Get nodes by type
- `GET /api/nodes/roots` - Get root nodes
- `GET /api/nodes/completed` - Get completed nodes
- `GET /api/nodes/with-target-date` - Get nodes with target date

### Edge Endpoints

- `GET /api/edges` - Get all edges
- `GET /api/edges/{id}` - Get an edge by ID
- `POST /api/edges` - Create a new edge
- `PUT /api/edges/{id}` - Update an edge
- `DELETE /api/edges/{id}` - Delete an edge
- `GET /api/edges/source/{sourceId}` - Get edges by source node ID
- `GET /api/edges/target/{targetId}` - Get edges by target node ID
- `DELETE /api/edges/source/{sourceId}` - Delete edges by source node ID
- `DELETE /api/edges/target/{targetId}` - Delete edges by target node ID
- `GET /api/edges/exists?sourceId={sourceId}&targetId={targetId}` - Check if an edge exists

### Graph Endpoints

- `GET /api/graph` - Get the entire graph
- `GET /api/graph/subgraph/{rootNodeId}` - Get a subgraph starting from a root node
- `POST /api/graph` - Save a graph
- `DELETE /api/graph` - Delete the entire graph

## Database Schema

The application uses the following database schema:

### Nodes Table

Stores information about projects and tasks.

### Edges Table

Stores relationships between nodes (parent-child relationships).

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package
```

This will create a JAR file in the `target` directory.

## Integration with Frontend

The backend is designed to work with the TodoMap frontend. The frontend can connect to the backend using the API endpoints described above.

## License

[MIT License](LICENSE)
