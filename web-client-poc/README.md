# Web Client POC - Messaging Systems Comparison

A production-ready React application for comparing RabbitMQ and Kafka messaging systems with real-time metrics and visualization.

## Features

- **Dual System Support**: Compare RabbitMQ and Kafka side-by-side
- **Real-time Updates**: WebSocket integration for live message streaming and stats
- **Single & Bulk Messaging**: Send individual or bulk messages (up to 10,000)
- **Performance Metrics**: Throughput, latency, success rates with live charts
- **Message Virtualization**: Efficient rendering of 1000+ messages using react-window
- **Professional UI**: Material-UI components with custom theming
- **Type-Safe**: Full TypeScript support

## Technology Stack

- **React 18** with TypeScript
- **Vite 5** for fast development and building
- **Material-UI (MUI)** for UI components
- **Zustand** for state management
- **Recharts** for data visualization
- **STOMP over SockJS** for WebSocket communication
- **Axios** for HTTP requests
- **react-window** for virtual scrolling

## Prerequisites

- Node.js 20+
- Running RabbitMQ backend on `http://localhost:8081`
- Running Kafka backend on `http://localhost:8082`

## Installation

```bash
# Install dependencies
npm install --legacy-peer-deps
```

## Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (ErrorBoundary, LoadingSpinner, ConnectionStatus)
│   ├── messaging/       # Messaging UI (MessagingPanel, MessageList)
│   ├── metrics/         # Metrics dashboard and charts
│   └── tabs/            # Tab containers (RabbitMQTab, KafkaTab, ComparisonTab)
├── hooks/               # Custom React hooks (useMessaging, useWebSocket, useHealthCheck)
├── services/
│   ├── api/            # REST API clients
│   └── websocket/      # WebSocket clients
├── store/              # Zustand store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── theme/              # Material-UI theme configuration
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Usage

### 1. Connect to Backends

The application automatically connects to both RabbitMQ and Kafka backends on startup. Connection status is displayed in the header.

### 2. Send Single Messages

- Navigate to the RabbitMQ or Kafka tab
- Enter message content in the "Single Message" text area
- Select format (TEXT or JSON)
- Click "Send Message"

### 3. Send Bulk Messages

- Enter the number of messages to send (1-10,000)
- Customize the message template (use `{index}` as placeholder)
- Optionally set delay between messages
- Click "Send X Messages"

### 4. View Real-time Messages

- Messages appear in real-time as they're received
- Virtualized list handles thousands of messages efficiently
- Each message shows: ID, content, format, latency, and timestamp

### 5. Monitor Metrics

- View live metrics: Total Sent, Total Received, Average Latency, Throughput
- Real-time charts show throughput and latency over time
- Charts automatically update as messages flow

### 6. Compare Systems

- Click the "Comparison" tab
- See side-by-side performance metrics
- Green "Better" badges highlight the winner for each metric
- Overall winner is displayed at the top

## Configuration

Environment variables can be set in `.env.development`:

```env
# RabbitMQ Configuration
VITE_RABBITMQ_API_URL=http://localhost:8081
VITE_RABBITMQ_WS_URL=http://localhost:8081/ws

# Kafka Configuration
VITE_KAFKA_API_URL=http://localhost:8082
VITE_KAFKA_WS_URL=http://localhost:8082/ws

# Application Configuration
VITE_MAX_MESSAGES=1000
VITE_STATS_UPDATE_INTERVAL=500
VITE_HEALTH_CHECK_INTERVAL=5000
```

## Key Components

### MessagingPanel
Reusable component used by both RabbitMQ and Kafka tabs for:
- Sending single messages
- Sending bulk messages
- Displaying received messages
- Managing message operations

### MetricsDashboard
Displays real-time performance metrics:
- Stats cards (sent, received, latency, throughput)
- Throughput chart (messages/second over time)
- Latency chart (average latency over time)

### ComparisonTab
Side-by-side comparison of RabbitMQ vs Kafka:
- All key metrics compared
- Winner highlighting
- Percentage differences

## Custom Hooks

### useMessaging
Encapsulates all messaging operations for a system:
- Send single/bulk messages
- Fetch/clear messages
- Get stats
- Subscribe/unsubscribe

### useWebSocket
Manages WebSocket connections:
- Auto-connect on mount
- Subscribe to topics (/topic/messages, /topic/stats)
- Handle connection lifecycle
- Auto-reconnect on disconnect

### useHealthCheck
Periodic health checks:
- Polls backend every 5 seconds
- Updates connection status
- Displays errors

## Performance Optimizations

- **Virtual Scrolling**: react-window for efficient message list rendering
- **Memoization**: React.memo on expensive components
- **Throttled Updates**: Stats updates throttled to 500ms
- **Limited Data**: Only last 1000 messages and 100 chart points kept in memory

## Troubleshooting

### WebSocket Connection Issues

If WebSocket fails to connect:
1. Check that backends are running
2. Verify WebSocket URLs in `.env.development`
3. Check browser console for errors
4. Try refreshing the page

### Messages Not Appearing

If messages don't appear:
1. Check WebSocket connection status (header indicators)
2. Verify backend health status
3. Check browser console for errors
4. Try clicking "Subscribe" button (if available)

### Performance Issues

If the UI is slow with many messages:
1. Click "Clear All" to remove old messages
2. Reduce bulk message count
3. Check chart data is limited (max 100 points)

## Development Tips

- Use Chrome DevTools → Redux DevTools to inspect Zustand store
- WebSocket messages are logged to console with `[WebSocket]` prefix
- API errors are logged with `[useMessaging]` prefix
- Health check logs appear with `[useHealthCheck]` prefix

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the main project README at the repository root.
