FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Copy parent pom first
COPY pom.xml ./pom.xml

# Copy project pom and source
COPY kafka-poc/pom.xml ./kafka-poc/pom.xml
COPY kafka-poc/src ./kafka-poc/src

# Build the application
RUN mvn clean package -DskipTests -f kafka-poc/pom.xml

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/kafka-poc/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
