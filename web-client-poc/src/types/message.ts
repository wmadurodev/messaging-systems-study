// Message format enum
export enum MessageFormat {
  JSON = 'JSON',
  TEXT = 'TEXT'
}

// Core Message type
export interface Message {
  messageId: string;
  content: string;
  format: MessageFormat;
  routingKey?: string; // RabbitMQ specific
  topic?: string; // Kafka specific
  timestamp: number; // Epoch milliseconds
  receivedAt?: number; // Epoch milliseconds, set when received
}

// Message send response
export interface MessageSendResponse {
  messageId: string;
  timestamp: number;
  success: boolean;
}

// Bulk message request
export interface BulkMessageRequest {
  count: number;
  messageTemplate: string; // Supports {index} placeholder
  format: MessageFormat;
  delayMs?: number; // Delay between messages
}

// Bulk message response
export interface BulkMessageResponse {
  totalSent: number;
  successCount: number;
  failCount: number;
  durationMs: number;
  throughput: number; // Messages per second
}
