// API URLs
export const RABBITMQ_API_URL = import.meta.env.VITE_RABBITMQ_API_URL || 'http://localhost:8081';
export const KAFKA_API_URL = import.meta.env.VITE_KAFKA_API_URL || 'http://localhost:8082';

// WebSocket URLs
export const RABBITMQ_WS_URL = import.meta.env.VITE_RABBITMQ_WS_URL || 'http://localhost:8081/ws';
export const KAFKA_WS_URL = import.meta.env.VITE_KAFKA_WS_URL || 'http://localhost:8082/ws';

// Application configuration
export const MAX_MESSAGES = parseInt(import.meta.env.VITE_MAX_MESSAGES || '1000', 10);
export const STATS_UPDATE_INTERVAL = parseInt(import.meta.env.VITE_STATS_UPDATE_INTERVAL || '500', 10);
export const HEALTH_CHECK_INTERVAL = parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL || '5000', 10);

// WebSocket topics
export const WS_TOPICS = {
  MESSAGES: '/topic/messages',
  STATS: '/topic/stats',
  EVENTS: '/topic/events',
} as const;

// Tab values
export const TABS = {
  RABBITMQ: 'rabbitmq',
  KAFKA: 'kafka',
  COMPARISON: 'comparison',
} as const;

// Default message format
export const DEFAULT_MESSAGE_FORMAT = 'TEXT';

// Bulk message defaults
export const DEFAULT_BULK_COUNT = 100;
export const MAX_BULK_COUNT = 10000;
export const DEFAULT_BULK_DELAY = 0;

// Chart configuration
export const CHART_MAX_DATA_POINTS = 100;
export const CHART_COLORS = {
  RABBITMQ: '#FF6B35', // Orange/coral for RabbitMQ
  KAFKA: '#004E89', // Dark blue for Kafka
  SUCCESS: '#4CAF50', // Green
  ERROR: '#F44336', // Red
  WARNING: '#FF9800', // Orange
} as const;
