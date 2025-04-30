package com.todomap.backend.repositories;

import com.todomap.backend.models.Edge;
import com.todomap.backend.models.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, String> {
    
    List<Edge> findBySource(Node source);
    
    List<Edge> findByTarget(Node target);
    
    List<Edge> findBySourceId(String sourceId);
    
    List<Edge> findByTargetId(String targetId);
    
    void deleteBySourceId(String sourceId);
    
    void deleteByTargetId(String targetId);
    
    boolean existsBySourceIdAndTargetId(String sourceId, String targetId);
}
