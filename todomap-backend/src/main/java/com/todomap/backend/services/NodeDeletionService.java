package com.todomap.backend.services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todomap.backend.repositories.EdgeRepository;
import com.todomap.backend.repositories.NodeRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NodeDeletionService {
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void deleteNodeAndDescendants(String nodeId) {
        // First, collect all descendant node IDs (including the root node)
        Set<String> toDelete = new HashSet<>();
        collectDescendantNodeIds(nodeId, toDelete);
        // Delete all edges where source or target is in toDelete
        edgeRepository.deleteAllBySourceIdInOrTargetIdIn(toDelete, toDelete);
        entityManager.clear(); // Clear persistence context after bulk edge delete
        // Delete all nodes
        nodeRepository.deleteAllById(toDelete);
        // Debug: check if any node still exists
        for (String id : toDelete) {
            if (nodeRepository.existsById(id)) {
                System.out.println("ERROR: Node still exists after delete: " + id);
                throw new RuntimeException("Failed to delete node with id: " + id);
            }
        }
    }

    private void collectDescendantNodeIds(String nodeId, Set<String> toDelete) {
        if (!toDelete.add(nodeId)) return; // already visited
        var outgoingEdges = edgeRepository.findBySourceId(nodeId);
        for (var edge : outgoingEdges) {
            collectDescendantNodeIds(edge.getTarget().getId(), toDelete);
        }
    }
}
