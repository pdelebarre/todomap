package com.todomap.backend.controllers;

import com.todomap.backend.dtos.EdgeDTO;
import com.todomap.backend.services.EdgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/edges")
@RequiredArgsConstructor
public class EdgeController {

    private final EdgeService edgeService;

    @GetMapping
    public ResponseEntity<List<EdgeDTO>> getAllEdges() {
        return ResponseEntity.ok(edgeService.getAllEdges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EdgeDTO> getEdgeById(@PathVariable String id) {
        return ResponseEntity.ok(edgeService.getEdgeById(id));
    }

    @PostMapping
    public ResponseEntity<EdgeDTO> createEdge(@Valid @RequestBody EdgeDTO edgeDTO) {
        EdgeDTO createdEdge = edgeService.createEdge(edgeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEdge);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EdgeDTO> updateEdge(@PathVariable String id, @Valid @RequestBody EdgeDTO edgeDTO) {
        EdgeDTO updatedEdge = edgeService.updateEdge(id, edgeDTO);
        return ResponseEntity.ok(updatedEdge);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEdge(@PathVariable String id) {
        edgeService.deleteEdge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/source/{sourceId}")
    public ResponseEntity<List<EdgeDTO>> getEdgesBySourceId(@PathVariable String sourceId) {
        return ResponseEntity.ok(edgeService.getEdgesBySourceId(sourceId));
    }

    @GetMapping("/target/{targetId}")
    public ResponseEntity<List<EdgeDTO>> getEdgesByTargetId(@PathVariable String targetId) {
        return ResponseEntity.ok(edgeService.getEdgesByTargetId(targetId));
    }

    @DeleteMapping("/source/{sourceId}")
    public ResponseEntity<Void> deleteEdgesBySourceId(@PathVariable String sourceId) {
        edgeService.deleteEdgesBySourceId(sourceId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/target/{targetId}")
    public ResponseEntity<Void> deleteEdgesByTargetId(@PathVariable String targetId) {
        edgeService.deleteEdgesByTargetId(targetId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> existsBySourceIdAndTargetId(
            @RequestParam String sourceId, 
            @RequestParam String targetId) {
        return ResponseEntity.ok(edgeService.existsBySourceIdAndTargetId(sourceId, targetId));
    }
}
