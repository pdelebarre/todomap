package com.todomap.backend.dtos;

import java.time.LocalDate;

public class NodeDTO {
    private String id;
    private NodeDataDTO data;
    private PositionDTO position;
    private String type;
    
    // Default constructor
    public NodeDTO() {
    }
    
    // Constructor with all fields
    public NodeDTO(String id, NodeDataDTO data, PositionDTO position, String type) {
        this.id = id;
        this.data = data;
        this.position = position;
        this.type = type;
    }
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public NodeDataDTO getData() {
        return data;
    }
    
    public void setData(NodeDataDTO data) {
        this.data = data;
    }
    
    public PositionDTO getPosition() {
        return position;
    }
    
    public void setPosition(PositionDTO position) {
        this.position = position;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    // Builder method
    public static NodeDTOBuilder builder() {
        return new NodeDTOBuilder();
    }
    
    // Builder class
    public static class NodeDTOBuilder {
        private String id;
        private NodeDataDTO data;
        private PositionDTO position;
        private String type;
        
        public NodeDTOBuilder id(String id) {
            this.id = id;
            return this;
        }
        
        public NodeDTOBuilder data(NodeDataDTO data) {
            this.data = data;
            return this;
        }
        
        public NodeDTOBuilder position(PositionDTO position) {
            this.position = position;
            return this;
        }
        
        public NodeDTOBuilder type(String type) {
            this.type = type;
            return this;
        }
        
        public NodeDTO build() {
            return new NodeDTO(id, data, position, type);
        }
    }
    
    public static class NodeDataDTO {
        private String label;
        private String description;
        private String nodeType;
        private String dateOpened;
        private String targetDate;
        private String completionDate;
        private boolean completed;
        private boolean collapsed;
        private boolean hasChildren;
        private String comment;
        
        // Default constructor
        public NodeDataDTO() {
        }
        
        // Constructor with all fields
        public NodeDataDTO(String label, String description, String nodeType, String dateOpened, 
                          String targetDate, String completionDate, boolean completed, 
                          boolean collapsed, boolean hasChildren, String comment) {
            this.label = label;
            this.description = description;
            this.nodeType = nodeType;
            this.dateOpened = dateOpened;
            this.targetDate = targetDate;
            this.completionDate = completionDate;
            this.completed = completed;
            this.collapsed = collapsed;
            this.hasChildren = hasChildren;
            this.comment = comment;
        }
        
        // Getters and setters
        public String getLabel() {
            return label;
        }
        
        public void setLabel(String label) {
            this.label = label;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public String getNodeType() {
            return nodeType;
        }
        
        public void setNodeType(String nodeType) {
            this.nodeType = nodeType;
        }
        
        public String getDateOpened() {
            return dateOpened;
        }
        
        public void setDateOpened(String dateOpened) {
            this.dateOpened = dateOpened;
        }
        
        public String getTargetDate() {
            return targetDate;
        }
        
        public void setTargetDate(String targetDate) {
            this.targetDate = targetDate;
        }
        
        public String getCompletionDate() {
            return completionDate;
        }
        
        public void setCompletionDate(String completionDate) {
            this.completionDate = completionDate;
        }
        
        public boolean isCompleted() {
            return completed;
        }
        
        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
        
        public boolean isCollapsed() {
            return collapsed;
        }
        
        public void setCollapsed(boolean collapsed) {
            this.collapsed = collapsed;
        }
        
        public boolean isHasChildren() {
            return hasChildren;
        }
        
        public void setHasChildren(boolean hasChildren) {
            this.hasChildren = hasChildren;
        }
        
        public String getComment() {
            return comment;
        }
        
        public void setComment(String comment) {
            this.comment = comment;
        }
        
        // Builder method
        public static NodeDataDTOBuilder builder() {
            return new NodeDataDTOBuilder();
        }
        
        // Builder class
        public static class NodeDataDTOBuilder {
            private String label;
            private String description;
            private String nodeType;
            private String dateOpened;
            private String targetDate;
            private String completionDate;
            private boolean completed;
            private boolean collapsed;
            private boolean hasChildren;
            private String comment;
            
            public NodeDataDTOBuilder label(String label) {
                this.label = label;
                return this;
            }
            
            public NodeDataDTOBuilder description(String description) {
                this.description = description;
                return this;
            }
            
            public NodeDataDTOBuilder nodeType(String nodeType) {
                this.nodeType = nodeType;
                return this;
            }
            
            public NodeDataDTOBuilder dateOpened(String dateOpened) {
                this.dateOpened = dateOpened;
                return this;
            }
            
            public NodeDataDTOBuilder targetDate(String targetDate) {
                this.targetDate = targetDate;
                return this;
            }
            
            public NodeDataDTOBuilder completionDate(String completionDate) {
                this.completionDate = completionDate;
                return this;
            }
            
            public NodeDataDTOBuilder completed(boolean completed) {
                this.completed = completed;
                return this;
            }
            
            public NodeDataDTOBuilder collapsed(boolean collapsed) {
                this.collapsed = collapsed;
                return this;
            }
            
            public NodeDataDTOBuilder hasChildren(boolean hasChildren) {
                this.hasChildren = hasChildren;
                return this;
            }
            
            public NodeDataDTOBuilder comment(String comment) {
                this.comment = comment;
                return this;
            }
            
            public NodeDataDTO build() {
                return new NodeDataDTO(label, description, nodeType, dateOpened, targetDate, 
                                     completionDate, completed, collapsed, hasChildren, comment);
            }
        }
    }
}
