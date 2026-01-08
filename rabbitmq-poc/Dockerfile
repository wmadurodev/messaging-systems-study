FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Copy parent pom first
COPY pom.xml ./pom.xml

# Copy project pom and source
COPY rabbitmq-poc/pom.xml ./rabbitmq-poc/pom.xml
COPY rabbitmq-poc/src ./rabbitmq-poc/src

# Build the application
RUN mvn clean package -DskipTests -f rabbitmq-poc/pom.xml

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/rabbitmq-poc/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
