package com.todomap.backend.services;

import com.todomap.backend.dtos.EdgeDTO;
import com.todomap.backend.dtos.GraphDTO;
import com.todomap.backend.dtos.NodeDTO;
import com.todomap.backend.mappers.EntityDTOMapper;
import com.todomap.backend.models.Edge;
import com.todomap.backend.models.Node;
import com.todomap.backend.repositories.EdgeRepository;
import com.todomap.backend.repositories.NodeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GraphService {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final EntityDTOMapper mapper;

    @Transactional(readOnly = true)
    public GraphDTO getEntireGraph() {
        List<Node> nodes = nodeRepository.findAll();
        List<Edge> edges = edgeRepository.findAll();
        return mapper.toGraphDTO(nodes, edges);
    }

    @Transactional(readOnly = true)
    public GraphDTO getSubgraphByRootNodeId(String rootNodeId) {
        Node rootNode = nodeRepository.findById(rootNodeId)
                .orElseThrow(() -> new EntityNotFoundException("Root node not found with id: " + rootNodeId));
        
        Set<Node> nodes = new HashSet<>();
        List<Edge> edges = new ArrayList<>();
        
        // Add the root node
        nodes.add(rootNode);
        
        // Recursively find all descendants
        findDescendants(rootNode, nodes, edges);
        
        return mapper.toGraphDTO(new ArrayList<>(nodes), edges);
    }

    private void findDescendants(Node node, Set<Node> nodes, List<Edge> edges) {
        List<Edge> outgoingEdges = edgeRepository.findBySource(node);
        edges.addAll(outgoingEdges);

        for (Edge edge : outgoingEdges) {
            Node targetNode = edge.getTarget();
            if (nodes.add(targetNode)) { // add returns false if already present
                findDescendants(targetNode, nodes, edges);
            }
        }
    }

    @Transactional
    public GraphDTO saveGraph(GraphDTO graphDTO) {
        // First, save all nodes
        Map<String, Node> savedNodesMap = saveNodes(graphDTO.getNodes());
        
        // Then, save all edges using the saved nodes
        List<Edge> savedEdges = saveEdges(graphDTO.getEdges(), savedNodesMap);
        
        // Convert saved entities back to DTOs
        List<Node> savedNodes = new ArrayList<>(savedNodesMap.values());
        return mapper.toGraphDTO(savedNodes, savedEdges);
    }

    private Map<String, Node> saveNodes(List<NodeDTO> nodeDTOs) {
        // Convert DTOs to entities
        List<Node> nodes = nodeDTOs.stream()
                .map(mapper::toNodeEntity)
                .collect(Collectors.toList());
        
        // Save all nodes
        List<Node> savedNodes = nodeRepository.saveAll(nodes);
        
        // Create a map of node IDs to node entities for easy lookup
        return savedNodes.stream()
                .collect(Collectors.toMap(Node::getId, Function.identity()));
    }

    private List<Edge> saveEdges(List<EdgeDTO> edgeDTOs, Map<String, Node> nodesMap) {
        List<Edge> edges = new ArrayList<>();
        
        for (EdgeDTO edgeDTO : edgeDTOs) {
            Node source = nodesMap.get(edgeDTO.getSource());
            Node target = nodesMap.get(edgeDTO.getTarget());
            
            if (source == null || target == null) {
                throw new EntityNotFoundException("Source or target node not found for edge: " + edgeDTO.getId());
            }
            
            Edge edge = mapper.toEdgeEntity(edgeDTO, source, target);
            edges.add(edge);
        }
        
        return edgeRepository.saveAll(edges);
    }

    @Transactional
    public void deleteGraph() {
        edgeRepository.deleteAll();
        nodeRepository.deleteAll();
    }
}
