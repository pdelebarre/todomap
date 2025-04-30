package com.todomap.backend.mappers;

import com.todomap.backend.dtos.EdgeDTO;
import com.todomap.backend.dtos.GraphDTO;
import com.todomap.backend.dtos.NodeDTO;
import com.todomap.backend.dtos.PositionDTO;
import com.todomap.backend.models.Edge;
import com.todomap.backend.models.Node;
import com.todomap.backend.models.Position;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDTOMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    // Convert Node entity to NodeDTO
    public NodeDTO toNodeDTO(Node node) {
        return NodeDTO.builder()
                .id(node.getId())
                .data(NodeDTO.NodeDataDTO.builder()
                        .label(node.getLabel())
                        .description(node.getDescription())
                        .nodeType(node.getNodeType())
                        .dateOpened(formatDate(node.getDateOpened()))
                        .targetDate(formatDate(node.getTargetDate()))
                        .completionDate(formatDate(node.getCompletionDate()))
                        .completed(node.isCompleted())
                        .collapsed(false) // Default to not collapsed in UI
                        .hasChildren(node.hasChildren())
                        .comment(node.getComment())
                        .build())
                .position(toPositionDTO(node.getPosition()))
                .type("custom") // Default node type for frontend
                .build();
    }

    // Convert Edge entity to EdgeDTO
    public EdgeDTO toEdgeDTO(Edge edge) {
        return EdgeDTO.builder()
                .id(edge.getId())
                .source(edge.getSource().getId())
                .target(edge.getTarget().getId())
                .animated(edge.isAnimated())
                .type(edge.getType())
                .label(edge.getLabel())
                .build();
    }

    // Convert Position entity to PositionDTO
    public PositionDTO toPositionDTO(Position position) {
        if (position == null) {
            return new PositionDTO(0, 0); // Default position
        }
        return new PositionDTO(position.getX(), position.getY());
    }

    // Convert NodeDTO to Node entity
    public Node toNodeEntity(NodeDTO dto) {
        Position position = new Position();
        if (dto.getPosition() != null) {
            position.setX(dto.getPosition().getX());
            position.setY(dto.getPosition().getY());
        }

        return Node.builder()
                .id(dto.getId())
                .label(dto.getData().getLabel())
                .description(dto.getData().getDescription())
                .nodeType(dto.getData().getNodeType())
                .dateOpened(parseDate(dto.getData().getDateOpened()))
                .targetDate(parseDate(dto.getData().getTargetDate()))
                .completionDate(parseDate(dto.getData().getCompletionDate()))
                .completed(dto.getData().isCompleted())
                .comment(dto.getData().getComment())
                .position(position)
                .build();
    }

    // Convert EdgeDTO to Edge entity (requires Node entities to be provided)
    public Edge toEdgeEntity(EdgeDTO dto, Node source, Node target) {
        return Edge.builder()
                .id(dto.getId())
                .source(source)
                .target(target)
                .animated(dto.isAnimated())
                .type(dto.getType())
                .label(dto.getLabel())
                .build();
    }

    // Convert a list of nodes and edges to a GraphDTO
    public GraphDTO toGraphDTO(List<Node> nodes, List<Edge> edges) {
        List<NodeDTO> nodeDTOs = nodes.stream()
                .map(this::toNodeDTO)
                .collect(Collectors.toList());

        List<EdgeDTO> edgeDTOs = edges.stream()
                .map(this::toEdgeDTO)
                .collect(Collectors.toList());

        return new GraphDTO(nodeDTOs, edgeDTOs);
    }

    // Helper method to format dates
    private String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }

    // Helper method to parse dates
    private LocalDate parseDate(String dateStr) {
        return dateStr != null && !dateStr.isEmpty() ? LocalDate.parse(dateStr, DATE_FORMATTER) : null;
    }
}
