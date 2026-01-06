FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Copy parent pom first
COPY ../pom.xml ../pom.xml

# Copy project pom and source
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
