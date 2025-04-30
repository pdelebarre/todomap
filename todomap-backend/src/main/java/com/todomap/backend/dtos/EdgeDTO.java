package com.todomap.backend.dtos;

public class EdgeDTO {
    private String id;
    private String source;
    private String target;
    private boolean animated;
    private String type;
    private String label;
    
    // Default constructor
    public EdgeDTO() {
    }
    
    // Constructor with all fields
    public EdgeDTO(String id, String source, String target, boolean animated, String type, String label) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.animated = animated;
        this.type = type;
        this.label = label;
    }
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getTarget() {
        return target;
    }
    
    public void setTarget(String target) {
        this.target = target;
    }
    
    public boolean isAnimated() {
        return animated;
    }
    
    public void setAnimated(boolean animated) {
        this.animated = animated;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }
    
    // Builder method
    public static EdgeDTOBuilder builder() {
        return new EdgeDTOBuilder();
    }
    
    // Builder class
    public static class EdgeDTOBuilder {
        private String id;
        private String source;
        private String target;
        private boolean animated;
        private String type;
        private String label;
        
        public EdgeDTOBuilder id(String id) {
            this.id = id;
            return this;
        }
        
        public EdgeDTOBuilder source(String source) {
            this.source = source;
            return this;
        }
        
        public EdgeDTOBuilder target(String target) {
            this.target = target;
            return this;
        }
        
        public EdgeDTOBuilder animated(boolean animated) {
            this.animated = animated;
            return this;
        }
        
        public EdgeDTOBuilder type(String type) {
            this.type = type;
            return this;
        }
        
        public EdgeDTOBuilder label(String label) {
            this.label = label;
            return this;
        }
        
        public EdgeDTO build() {
            return new EdgeDTO(id, source, target, animated, type, label);
        }
    }
}
