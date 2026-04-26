# --- Build stage: compile the Spring Boot app into a runnable jar ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache Maven dependencies first (faster rebuilds when only source changes)
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Now copy the source and build the jar (skip tests for faster deploys)
COPY src ./src
RUN mvn -B -DskipTests package

# --- Runtime stage: small JRE image that just runs the jar ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render injects $PORT — Spring Boot reads it via server.port=${PORT:8080}
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
