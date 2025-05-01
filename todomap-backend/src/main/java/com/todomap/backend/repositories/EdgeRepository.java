package com.todomap.backend.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.todomap.backend.models.Edge;
import com.todomap.backend.models.Node;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, String> {
    
    List<Edge> findBySource(Node source);
    
    List<Edge> findByTarget(Node target);
    
    List<Edge> findBySourceId(String sourceId);
    
    List<Edge> findByTargetId(String targetId);
    
    void deleteBySourceId(String sourceId);
    
    void deleteByTargetId(String targetId);
    
    boolean existsBySourceIdAndTargetId(String sourceId, String targetId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Edge e WHERE e.source.id IN :sourceIds OR e.target.id IN :targetIds")
    void deleteAllBySourceIdInOrTargetIdIn(Set<String> sourceIds, Set<String> targetIds);
}
