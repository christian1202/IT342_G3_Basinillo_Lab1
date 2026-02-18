# ==========================================
# 1. Build Stage
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy generic files first to cache dependencies
COPY pom.xml .
# Download dependencies (this step will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests to speed up build)
RUN mvn clean package -DskipTests

# ==========================================
# 2. Run Stage
# ==========================================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (default 8080)
EXPOSE 8080

# Environment variables should be injected at runtime
# ENTRYPOINT
ENTRYPOINT ["java", "-jar", "app.jar"]
