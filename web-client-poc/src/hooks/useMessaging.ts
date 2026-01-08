import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { getApiClient } from '../services/api/apiClient';
import { createMessagingApi } from '../services/api/messagingApi';
import {
  SystemType,
  Message,
  MessageFormat,
  BulkMessageRequest,
  BulkMessageResponse,
  MessageSendResponse,
} from '../types';

interface UseMessagingOptions {
  system: SystemType;
}

export const useMessaging = ({ system }: UseMessagingOptions) => {
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Get API client
  const api = createMessagingApi(getApiClient(system));

  // Get state from store
  const messages = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.messages : state.kafka.messages
  );
  const stats = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.stats : state.kafka.stats
  );
  const health = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.health : state.kafka.health
  );
  const wsConnected = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.wsConnected : state.kafka.wsConnected
  );
  const isLoading = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.isLoading : state.kafka.isLoading
  );
  const error = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.error : state.kafka.error
  );
  const chartData = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.chartData : state.kafka.chartData
  );

  // Get actions from store
  const setMessages = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQMessages : state.setKafkaMessages
  );
  const clearMessages = useStore((state) =>
    system === 'rabbitmq' ? state.clearRabbitMQMessages : state.clearKafkaMessages
  );
  const updateStats = useStore((state) =>
    system === 'rabbitmq' ? state.updateRabbitMQStats : state.updateKafkaStats
  );
  const setLoading = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQLoading : state.setKafkaLoading
  );
  const setError = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQError : state.setKafkaError
  );

  /**
   * Send a single message
   */
  const sendMessage = useCallback(
    async (content: string, format: MessageFormat = MessageFormat.TEXT): Promise<MessageSendResponse | null> => {
      setIsSending(true);
      setSendError(null);

      try {
        const message: Partial<Message> = {
          content,
          format,
          timestamp: Date.now(),
        };

        const response = await api.sendMessage(message);
        console.log(`[useMessaging] Sent message to ${system}:`, response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        console.error(`[useMessaging] Error sending message to ${system}:`, error);
        setSendError(errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [system, api, setError]
  );

  /**
   * Send bulk messages
   */
  const sendBulkMessages = useCallback(
    async (request: BulkMessageRequest): Promise<BulkMessageResponse | null> => {
      setIsSending(true);
      setSendError(null);

      try {
        const response = await api.sendBulkMessages(request);
        console.log(`[useMessaging] Sent ${response.successCount} bulk messages to ${system}`);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send bulk messages';
        console.error(`[useMessaging] Error sending bulk messages to ${system}:`, error);
        setSendError(errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [system, api, setError]
  );

  /**
   * Fetch received messages from API
   */
  const fetchReceivedMessages = useCallback(
    async (limit: number = 100) => {
      setLoading(true);

      try {
        const response = await api.getReceivedMessages(limit);
        setMessages(response.messages);
        console.log(`[useMessaging] Fetched ${response.messages.length} messages from ${system}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
        console.error(`[useMessaging] Error fetching messages from ${system}:`, error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [system, api, setMessages, setLoading, setError]
  );

  /**
   * Clear all messages
   */
  const handleClearMessages = useCallback(async () => {
    try {
      await api.clearMessages();
      clearMessages();
      console.log(`[useMessaging] Cleared messages for ${system}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear messages';
      console.error(`[useMessaging] Error clearing messages for ${system}:`, error);
      setError(errorMessage);
    }
  }, [system, api, clearMessages, setError]);

  /**
   * Fetch current stats
   */
  const fetchStats = useCallback(async () => {
    try {
      const currentStats = await api.getStats();
      updateStats(currentStats);
      console.log(`[useMessaging] Fetched stats for ${system}:`, currentStats);
    } catch (error) {
      console.error(`[useMessaging] Error fetching stats for ${system}:`, error);
    }
  }, [system, api, updateStats]);

  /**
   * Reset stats
   */
  const resetStats = useCallback(async () => {
    try {
      await api.resetStats();
      console.log(`[useMessaging] Reset stats for ${system}`);
      // Fetch updated stats
      await fetchStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset stats';
      console.error(`[useMessaging] Error resetting stats for ${system}:`, error);
      setError(errorMessage);
    }
  }, [system, api, fetchStats, setError]);

  /**
   * Subscribe to consumer
   */
  const subscribe = useCallback(async () => {
    try {
      const response = await api.subscribe();
      console.log(`[useMessaging] Subscribed to ${system}:`, response);
      return response;
    } catch (error) {
      console.error(`[useMessaging] Error subscribing to ${system}:`, error);
      return null;
    }
  }, [system, api]);

  /**
   * Unsubscribe from consumer
   */
  const unsubscribe = useCallback(async () => {
    try {
      const response = await api.unsubscribe();
      console.log(`[useMessaging] Unsubscribed from ${system}:`, response);
      return response;
    } catch (error) {
      console.error(`[useMessaging] Error unsubscribing from ${system}:`, error);
      return null;
    }
  }, [system, api]);

  return {
    // State
    messages,
    stats,
    health,
    wsConnected,
    isLoading,
    error,
    chartData,
    isSending,
    sendError,

    // Actions
    sendMessage,
    sendBulkMessages,
    fetchReceivedMessages,
    clearMessages: handleClearMessages,
    fetchStats,
    resetStats,
    subscribe,
    unsubscribe,
  };
};
