#!/bin/bash

# Start PostgreSQL database using Docker Compose
echo "Starting PostgreSQL database..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Build the application
echo "Building the application..."
./mvnw clean install -DskipTests

# Run the application
echo "Starting the application..."
./mvnw spring-boot:run
