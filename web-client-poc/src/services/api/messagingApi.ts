import { AxiosInstance } from 'axios';
import {
  Message,
  MessageSendResponse,
  BulkMessageRequest,
  BulkMessageResponse,
  MessageStats,
  ReceivedMessagesResponse,
  HealthStatus,
  ConfigResponse,
  SubscriptionResponse,
  UnsubscriptionResponse,
  ClearMessagesResponse,
  ResetStatsResponse,
} from '../../types';

// Messaging API client interface
export interface MessagingApiClient {
  // Message operations
  sendMessage(message: Partial<Message>): Promise<MessageSendResponse>;
  sendBulkMessages(request: BulkMessageRequest): Promise<BulkMessageResponse>;
  getReceivedMessages(limit?: number): Promise<ReceivedMessagesResponse>;
  clearMessages(): Promise<ClearMessagesResponse>;

  // Subscription operations
  subscribe(): Promise<SubscriptionResponse>;
  unsubscribe(): Promise<UnsubscriptionResponse>;

  // Stats operations
  getStats(): Promise<MessageStats>;
  resetStats(): Promise<ResetStatsResponse>;

  // Health and config
  getHealth(): Promise<HealthStatus>;
  getConfig(): Promise<ConfigResponse>;
}

// Create messaging API client for a given Axios instance
export const createMessagingApi = (client: AxiosInstance): MessagingApiClient => ({
  // Send a single message
  async sendMessage(message: Partial<Message>): Promise<MessageSendResponse> {
    const response = await client.post<MessageSendResponse>('/api/messages/send', message);
    return response.data;
  },

  // Send bulk messages
  async sendBulkMessages(request: BulkMessageRequest): Promise<BulkMessageResponse> {
    const response = await client.post<BulkMessageResponse>('/api/messages/send-bulk', request);
    return response.data;
  },

  // Get received messages
  async getReceivedMessages(limit: number = 100): Promise<ReceivedMessagesResponse> {
    const response = await client.get<ReceivedMessagesResponse>('/api/messages/received', {
      params: { limit },
    });
    return response.data;
  },

  // Clear all messages
  async clearMessages(): Promise<ClearMessagesResponse> {
    const response = await client.delete<ClearMessagesResponse>('/api/messages/received');
    return response.data;
  },

  // Subscribe to message consumer
  async subscribe(): Promise<SubscriptionResponse> {
    const response = await client.post<SubscriptionResponse>('/api/messages/subscribe');
    return response.data;
  },

  // Unsubscribe from message consumer
  async unsubscribe(): Promise<UnsubscriptionResponse> {
    const response = await client.delete<UnsubscriptionResponse>('/api/messages/unsubscribe');
    return response.data;
  },

  // Get statistics
  async getStats(): Promise<MessageStats> {
    const response = await client.get<MessageStats>('/api/messages/stats');
    return response.data;
  },

  // Reset statistics
  async resetStats(): Promise<ResetStatsResponse> {
    const response = await client.post<ResetStatsResponse>('/api/messages/stats/reset');
    return response.data;
  },

  // Get health status
  async getHealth(): Promise<HealthStatus> {
    const response = await client.get<HealthStatus>('/api/health');
    return response.data;
  },

  // Get configuration
  async getConfig(): Promise<ConfigResponse> {
    const response = await client.get<ConfigResponse>('/api/config');
    return response.data;
  },
});

// Export convenience functions for direct use
export const rabbitmqApiClient = createMessagingApi;
export const kafkaApiClient = createMessagingApi;
