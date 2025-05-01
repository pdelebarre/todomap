package com.todomap.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todomap.backend.dtos.NodeDTO;
import com.todomap.backend.services.NodeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/nodes")
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;

    @GetMapping
    public ResponseEntity<List<NodeDTO>> getAllNodes() {
        return ResponseEntity.ok(nodeService.getAllNodes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NodeDTO> getNodeById(@PathVariable String id) {
        return ResponseEntity.ok(nodeService.getNodeById(id));
    }

    @PostMapping
    public ResponseEntity<NodeDTO> createNode(@Valid @RequestBody NodeDTO nodeDTO) {
        NodeDTO createdNode = nodeService.createNode(nodeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNode);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NodeDTO> updateNode(@PathVariable String id, @Valid @RequestBody NodeDTO nodeDTO) {
        NodeDTO updatedNode = nodeService.updateNode(id, nodeDTO);
        return ResponseEntity.ok(updatedNode);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNode(@PathVariable String id) {
        nodeService.deleteNodeAndDescendants(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{nodeType}")
    public ResponseEntity<List<NodeDTO>> getNodesByType(@PathVariable String nodeType) {
        return ResponseEntity.ok(nodeService.getNodesByType(nodeType));
    }

    @GetMapping("/roots")
    public ResponseEntity<List<NodeDTO>> getRootNodes() {
        return ResponseEntity.ok(nodeService.getRootNodes());
    }

    @GetMapping("/completed")
    public ResponseEntity<List<NodeDTO>> getCompletedNodes() {
        return ResponseEntity.ok(nodeService.getCompletedNodes());
    }

    @GetMapping("/with-target-date")
    public ResponseEntity<List<NodeDTO>> getNodesWithTargetDate() {
        return ResponseEntity.ok(nodeService.getNodesWithTargetDate());
    }
}
