# Use Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY Backend/pom.xml .
COPY Backend/target/Holos-0.0.1-SNAPSHOT.jar /app/Holos-0.0.1-SNAPSHOT.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/Holos-0.0.1-SNAPSHOT.jar",  "--spring.profiles.active=docker"]