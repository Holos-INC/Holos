# Etapa 1: Construcción del frontend (React)
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Copiar los archivos del frontend y construir la aplicación
COPY frontend/package.json .
COPY frontend/ .
RUN npm install
RUN npm run

# Etapa 2: Construcción del backend (Spring Boot)
FROM maven:3.8.6-eclipse-temurin-17 AS backend-build

WORKDIR /backend

# Copiar los archivos del backend y construir la aplicación
COPY Backend/ .

RUN ./mvnw package -DskipTests

# Etapa 3: Imagen final con backend y frontend juntos
FROM openjdk:17-jdk-slim

# Exponer el puerto del backend
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "backend/app.jar"]