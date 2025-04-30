package com.todomap.backend.controllers;

import com.todomap.backend.dtos.GraphDTO;
import com.todomap.backend.services.GraphService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/graph")
@RequiredArgsConstructor
public class GraphController {

    private final GraphService graphService;

    @GetMapping
    public ResponseEntity<GraphDTO> getEntireGraph() {
        return ResponseEntity.ok(graphService.getEntireGraph());
    }

    @GetMapping("/subgraph/{rootNodeId}")
    public ResponseEntity<GraphDTO> getSubgraphByRootNodeId(@PathVariable String rootNodeId) {
        return ResponseEntity.ok(graphService.getSubgraphByRootNodeId(rootNodeId));
    }

    @PostMapping
    public ResponseEntity<GraphDTO> saveGraph(@Valid @RequestBody GraphDTO graphDTO) {
        GraphDTO savedGraph = graphService.saveGraph(graphDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGraph);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteGraph() {
        graphService.deleteGraph();
        return ResponseEntity.noContent().build();
    }
}
