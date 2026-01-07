// Health status response
export interface HealthStatus {
  status: 'UP' | 'DOWN';
  connected: boolean;
  type: 'RABBITMQ' | 'KAFKA';
  details: {
    host?: string;
    port?: number;
    bootstrapServers?: string;
  };
  error?: string;
}

// Configuration response for RabbitMQ
export interface RabbitMQConfig {
  host: string;
  port: number;
  queues: string[];
  exchanges: string[];
  exchangeType: string;
  routingKey: string;
}

// Configuration response for Kafka
export interface KafkaConfig {
  bootstrapServers: string;
  topics: string[];
  consumerGroup: string;
}

// Generic config response
export type ConfigResponse = RabbitMQConfig | KafkaConfig;

// System type
export type SystemType = 'rabbitmq' | 'kafka';

// Subscription response
export interface SubscriptionResponse {
  subscribed: boolean;
  identifier: string;
  message: string;
}

// Unsubscription response
export interface UnsubscriptionResponse {
  unsubscribed: boolean;
}

// Clear messages response
export interface ClearMessagesResponse {
  cleared: boolean;
}

// Reset stats response
export interface ResetStatsResponse {
  status: string;
}
