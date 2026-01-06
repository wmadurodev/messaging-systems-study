# Messaging Systems Comparison: RabbitMQ vs Kafka

A proof of concept project for comparing RabbitMQ and Kafka messaging systems through practical implementation. This project includes two Spring Boot backends (one for each messaging system) and a React web client for testing and comparison.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Web Client (React)                      │
│              http://localhost:5173                           │
└──────────────┬─────────────────────────┬────────────────────┘
               │                         │
       ┌───────▼──────────┐     ┌───────▼──────────┐
       │  RabbitMQ POC    │     │   Kafka POC      │
       │  Spring Boot     │     │   Spring Boot    │
       │  :8081           │     │   :8082          │
       └───────┬──────────┘     └───────┬──────────┘
               │                         │
       ┌───────▼──────────┐     ┌───────▼──────────┐
       │   RabbitMQ       │     │   Kafka Broker   │
       │   :5672, :15672  │     │   :9092, :9093   │
       └──────────────────┘     └───────┬──────────┘
                                        │
                                ┌───────▼──────────┐
                                │   Zookeeper      │
                                │   :2181          │
                                └──────────────────┘
```

## Projects

1. **rabbitmq-poc** - Spring Boot backend with RabbitMQ integration
2. **kafka-poc** - Spring Boot backend with Kafka integration
3. **web-client** - React frontend for publishing/consuming messages

## Technology Stack

- **Java**: 21
- **Maven**: 3.9.11
- **Spring Boot**: 3.2.1
- **RabbitMQ**: 3.12 with management plugin
- **Kafka**: 7.5.0 (Confluent Platform)
- **React**: 18 with Vite
- **Docker**: Compose V3.8

## Prerequisites

- Java 21
- Maven 3.9.11
- Docker and Docker Compose
- Node.js 20+ (for web client development)

## Quick Start

### Option 1: Docker Compose (Recommended)

Start all services with Docker:

```bash
# Start messaging infrastructure only
docker-compose up rabbitmq kafka zookeeper

# Access RabbitMQ Management UI
open http://localhost:15672
# Login: admin / admin123
```

### Option 2: Local Development

#### 1. Start Messaging Services

```bash
# Start RabbitMQ and Kafka
docker-compose up rabbitmq kafka zookeeper
```

#### 2. Run RabbitMQ POC Backend

```bash
cd rabbitmq-poc
mvn spring-boot:run
```

Backend will be available at `http://localhost:8081`

#### 3. Run Kafka POC Backend

```bash
cd kafka-poc
mvn spring-boot:run
```

Backend will be available at `http://localhost:8082`

#### 4. Run Web Client

```bash
cd web-client
npm install
npm run dev
```

Web client will be available at `http://localhost:5173`

## API Endpoints

Both backends expose identical REST API structures:

### Publishing Messages

- `POST /api/messages/send` - Send single message
- `POST /api/messages/send-bulk` - Send bulk messages

### Consuming Messages

- `POST /api/messages/subscribe` - Start consuming messages
- `DELETE /api/messages/unsubscribe` - Stop consuming
- `GET /api/messages/received?limit=100` - Get received messages

### Metrics & Configuration

- `GET /api/messages/stats` - Get statistics (throughput, latency)
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `GET /api/health` - Health check

### WebSocket

- `ws://localhost:8081/ws` - RabbitMQ real-time updates
- `ws://localhost:8082/ws` - Kafka real-time updates

Topics:
- `/topic/messages` - Real-time consumed messages
- `/topic/stats` - Real-time statistics

## Building the Project

### Build All Backend Services

```bash
# From root directory
mvn clean install
```

### Build Individual Services

```bash
# RabbitMQ POC
cd rabbitmq-poc && mvn clean package

# Kafka POC
cd kafka-poc && mvn clean package
```

### Build Web Client

```bash
cd web-client
npm run build
```

## Testing

### Backend Tests

```bash
# Run all tests
mvn test

# Run tests for specific project
cd rabbitmq-poc && mvn test
cd kafka-poc && mvn test
```

### Performance Testing

Use the web client to:
1. Send bulk messages (1000+)
2. Monitor throughput and latency
3. Compare metrics between systems

## Project Structure

```
messaging-systems-study/
├── pom.xml                          # Parent POM
├── docker-compose.yml               # Infrastructure services
├── rabbitmq-poc/                    # RabbitMQ backend
│   ├── src/main/java/
│   │   └── com/study/rabbitmq/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       └── websocket/
│   └── src/main/resources/
│       └── application.yml
├── kafka-poc/                       # Kafka backend
│   └── (similar structure)
└── web-client/                      # React frontend
    └── src/
        ├── components/
        ├── services/
        └── hooks/
```

## Features

### RabbitMQ POC

- Multiple exchange types (Direct, Topic, Fanout)
- Queue bindings and routing keys
- Message acknowledgment modes
- Dead letter queues
- WebSocket integration

### Kafka POC

- Topic management
- Consumer groups
- Partition configuration
- Offset management
- Idempotent producers
- WebSocket integration

### Web Client

- Publish single or bulk messages
- Real-time message consumption
- Performance metrics dashboard
- Side-by-side comparison view
- Connection management

## Configuration

### RabbitMQ POC (`rabbitmq-poc/src/main/resources/application.yml`)

```yaml
server:
  port: 8081

spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: admin123
```

### Kafka POC (`kafka-poc/src/main/resources/application.yml`)

```yaml
server:
  port: 8082

spring:
  kafka:
    bootstrap-servers: localhost:9092
```

## Troubleshooting

### RabbitMQ Connection Issues

```bash
# Check RabbitMQ is running
docker ps | grep rabbitmq

# Check logs
docker logs rabbitmq-messaging-study

# Access management UI
open http://localhost:15672
```

### Kafka Connection Issues

```bash
# Check Kafka and Zookeeper are running
docker ps | grep kafka
docker ps | grep zookeeper

# Check logs
docker logs kafka-messaging-study

# List topics
docker exec kafka-messaging-study kafka-topics --list --bootstrap-server localhost:9092
```

### Backend Service Issues

```bash
# Check if port is already in use
lsof -i :8081
lsof -i :8082

# View application logs
tail -f rabbitmq-poc/logs/application.log
tail -f kafka-poc/logs/application.log
```

## Performance Benchmarks

Performance testing results comparing RabbitMQ and Kafka will be documented in `COMPARISON.md` after testing is complete.

## Contributing

This is a study project for comparing messaging systems. Feel free to:

- Add new test scenarios
- Implement additional features
- Improve metrics collection
- Enhance the comparison dashboard

## License

This project is for educational purposes.

## Resources

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Spring AMQP](https://spring.io/projects/spring-amqp)
- [Spring for Apache Kafka](https://spring.io/projects/spring-kafka)
