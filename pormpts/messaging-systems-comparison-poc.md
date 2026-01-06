# Messaging Systems Comparison: RabbitMQ vs Kafka POC

## Project Overview

Create proof of concept projects to test and compare **RabbitMQ** and **Kafka** messaging systems. The goal is to evaluate performance, ease of use, and capabilities through practical implementation.

## Architecture Requirements

### Backend Applications
- **Framework**: Spring Boot (latest stable version)
- **Language**: Java 17 or higher
- **Build Tool**: Maven or Gradle

### Frontend Application
- **Type**: Web client
- **Capabilities**:
  - Publish messages to queues/topics
  - Subscribe to queues/topics and display received messages in real-time
  - User interface to interact with both RabbitMQ and Kafka
  - Display metrics and performance statistics

## Project Structure

Create two separate Spring Boot backend projects:

### 1. RabbitMQ POC (`rabbitmq-poc`)
- Spring Boot application with RabbitMQ integration
- REST API endpoints for message operations
- Producer service for publishing messages
- Consumer service for subscribing to queues
- Configuration for RabbitMQ connection
- Docker Compose file for RabbitMQ instance

### 2. Kafka POC (`kafka-poc`)
- Spring Boot application with Kafka integration
- REST API endpoints for message operations
- Producer service for publishing messages
- Consumer service for subscribing to topics
- Configuration for Kafka connection
- Docker Compose file for Kafka and Zookeeper instances

### 3. Web Client (`web-client`)
- Modern web application (React, Vue, or vanilla JavaScript)
- Interface to connect to both messaging systems
- Message publishing interface with customizable payloads
- Real-time message consumption display
- WebSocket or SSE for real-time updates from backend
- Comparison dashboard showing metrics

## Functional Requirements

### Message Publishing
- Ability to send single messages
- Ability to send bulk messages (for load testing)
- Configurable message size and content
- Support for different message formats (JSON, plain text)

### Message Consumption
- Real-time display of consumed messages
- Message count tracking
- Timestamp information
- Consumer group management (for Kafka)

### Metrics and Comparison
- Message throughput (messages per second)
- Latency measurements
- Connection stability
- Resource usage indicators
- Side-by-side comparison view

## Technical Implementation Details

### RabbitMQ Backend
```
Dependencies:
- spring-boot-starter-amqp
- spring-boot-starter-web
- spring-boot-starter-websocket
```

**Features to implement:**
- Exchange types: Direct, Topic, Fanout
- Queue binding and routing keys
- Message acknowledgment modes
- Dead letter queues
- Management API integration

### Kafka Backend
```
Dependencies:
- spring-kafka
- spring-boot-starter-web
- spring-boot-starter-websocket
```

**Features to implement:**
- Topic creation and management
- Partition configuration
- Consumer groups
- Offset management
- Idempotent producers

### Web Client
**Core Features:**
- Connection configuration panel (host, port, credentials)
- Message composer with JSON editor
- Message history display
- Performance metrics dashboard
- Start/Stop consumer controls
- Clear logs functionality

## API Endpoints Structure

### Both backends should expose:

**Publishing:**
- `POST /api/messages/send` - Send single message
- `POST /api/messages/send-bulk` - Send multiple messages
- `GET /api/messages/stats` - Get publishing statistics

**Consuming:**
- `GET /api/messages/subscribe` - Start consuming messages
- `DELETE /api/messages/unsubscribe` - Stop consuming
- `GET /api/messages/received` - Get received messages

**Configuration:**
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

**Health:**
- `GET /api/health` - Check connection status

## Docker Setup

### RabbitMQ Docker Compose
- RabbitMQ with management plugin
- Exposed ports: 5672 (AMQP), 15672 (Management UI)
- Persistent volume for data
- Environment variables for credentials

### Kafka Docker Compose
- Kafka broker
- Zookeeper instance
- Exposed ports: 9092 (Kafka), 2181 (Zookeeper)
- KAFKA_ADVERTISED_LISTENERS configuration
- Persistent volumes

## Testing Scenarios

Implement test cases for:
1. **Single message delivery** - Verify basic publish/subscribe
2. **Bulk message delivery** - Test with 1000+ messages
3. **Message ordering** - Verify order preservation
4. **Multiple consumers** - Test load distribution
5. **Failure scenarios** - Connection loss, recovery
6. **Performance benchmarks** - Measure throughput and latency

## Comparison Criteria

Document and compare:
- **Setup complexity** - Installation and configuration effort
- **Development experience** - API ease of use
- **Performance** - Throughput and latency
- **Scalability** - Handling increased load
- **Message guarantees** - Delivery semantics
- **Monitoring** - Built-in tools and observability
- **Resource usage** - Memory and CPU consumption

## Documentation Requirements

Create README files for each project including:
- Setup instructions
- How to run with Docker
- API documentation
- Configuration options
- Usage examples
- Troubleshooting guide

## Deliverables

1. Three working projects (rabbitmq-poc, kafka-poc, web-client)
2. Docker Compose files for easy setup
3. Comprehensive README documentation
4. Comparison report document (markdown)
5. Performance test results
6. Architecture diagrams

## Success Criteria

- Both POCs successfully publish and consume messages
- Web client can interact with both systems seamlessly
- Performance metrics are collected and comparable
- Documentation is clear and complete
- Projects can be run with minimal setup using Docker

## Additional Considerations

- Implement proper error handling
- Add logging for debugging
- Use environment variables for configuration
- Follow Spring Boot best practices
- Implement security basics (authentication if needed)
- Make code clean and well-commented
- Include unit tests for key components
