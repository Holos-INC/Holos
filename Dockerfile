# Use Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY Backend/pom.xml .
COPY Backend/src ./src

RUN mvn dependency:go-offline
RUN mvn clean package -DskipTests

# Use a lightweight JDK runtime for running the application
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/Holos-0.0.1-SNAPSHOT.jar .

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/Holos-0.0.1-SNAPSHOT.jar",  "--spring.profiles.active=docker"]