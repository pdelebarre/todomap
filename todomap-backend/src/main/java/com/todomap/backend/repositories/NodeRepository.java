package com.todomap.backend.repositories;

import com.todomap.backend.models.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, String> {
    
    List<Node> findByNodeType(String nodeType);
    
    @Query("SELECT n FROM Node n WHERE n.id NOT IN (SELECT e.target.id FROM Edge e)")
    List<Node> findRootNodes();
    
    @Query("SELECT n FROM Node n WHERE n.completed = true")
    List<Node> findCompletedNodes();
    
    @Query("SELECT n FROM Node n WHERE n.targetDate IS NOT NULL AND n.completed = false")
    List<Node> findNodesWithTargetDate();
}
