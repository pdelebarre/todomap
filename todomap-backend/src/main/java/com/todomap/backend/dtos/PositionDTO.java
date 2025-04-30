package com.todomap.backend.dtos;

public class PositionDTO {
    private double x;
    private double y;
    
    // Default constructor
    public PositionDTO() {
    }
    
    // Constructor with all fields
    public PositionDTO(double x, double y) {
        this.x = x;
        this.y = y;
    }
    
    // Getters and setters
    public double getX() {
        return x;
    }
    
    public void setX(double x) {
        this.x = x;
    }
    
    public double getY() {
        return y;
    }
    
    public void setY(double y) {
        this.y = y;
    }
    
    // Builder method
    public static PositionDTOBuilder builder() {
        return new PositionDTOBuilder();
    }
    
    // Builder class
    public static class PositionDTOBuilder {
        private double x;
        private double y;
        
        public PositionDTOBuilder x(double x) {
            this.x = x;
            return this;
        }
        
        public PositionDTOBuilder y(double y) {
            this.y = y;
            return this;
        }
        
        public PositionDTO build() {
            return new PositionDTO(x, y);
        }
    }
}
