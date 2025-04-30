package com.todomap.backend.dtos;

import java.util.List;

public class GraphDTO {
    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;
    
    // Default constructor
    public GraphDTO() {
    }
    
    // Constructor with all fields
    public GraphDTO(List<NodeDTO> nodes, List<EdgeDTO> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }
    
    // Getters and setters
    public List<NodeDTO> getNodes() {
        return nodes;
    }
    
    public void setNodes(List<NodeDTO> nodes) {
        this.nodes = nodes;
    }
    
    public List<EdgeDTO> getEdges() {
        return edges;
    }
    
    public void setEdges(List<EdgeDTO> edges) {
        this.edges = edges;
    }
    
    // Builder method
    public static GraphDTOBuilder builder() {
        return new GraphDTOBuilder();
    }
    
    // Builder class
    public static class GraphDTOBuilder {
        private List<NodeDTO> nodes;
        private List<EdgeDTO> edges;
        
        public GraphDTOBuilder nodes(List<NodeDTO> nodes) {
            this.nodes = nodes;
            return this;
        }
        
        public GraphDTOBuilder edges(List<EdgeDTO> edges) {
            this.edges = edges;
            return this;
        }
        
        public GraphDTO build() {
            return new GraphDTO(nodes, edges);
        }
    }
}
