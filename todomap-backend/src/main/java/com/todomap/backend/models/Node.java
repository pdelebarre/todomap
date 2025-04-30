package com.todomap.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "nodes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String label;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String nodeType;  // "project" or "task"

    @Column(nullable = false)
    private LocalDate dateOpened;

    private LocalDate targetDate;

    private LocalDate completionDate;

    private boolean completed;

    @Column(length = 1000)
    private String comment;

    // Position data stored as JSON
    @Embedded
    private Position position;

    // UI state - might be better handled on the frontend only
    @Transient
    private boolean collapsed;

    // Relationships
    @OneToMany(mappedBy = "source", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Edge> outgoingEdges = new HashSet<>();

    @OneToMany(mappedBy = "target", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Edge> incomingEdges = new HashSet<>();

    // Helper method to check if node has children
    @Transient
    public boolean hasChildren() {
        return outgoingEdges != null && !outgoingEdges.isEmpty();
    }

    // equals and hashCode ONLY use id!
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Node)) return false;
        Node node = (Node) o;
        return id != null && id.equals(node.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
