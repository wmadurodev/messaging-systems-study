import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { wsManager } from '../services/websocket/WebSocketManager';
import { SystemType } from '../types';

interface UseWebSocketOptions {
  system: SystemType;
  enabled?: boolean;
}

export const useWebSocket = ({ system, enabled = true }: UseWebSocketOptions) => {
  const subscriptionIds = useRef<string[]>([]);

  // Get store actions based on system
  const addMessage = useStore((state) =>
    system === 'rabbitmq' ? state.addRabbitMQMessage : state.addKafkaMessage
  );
  const updateStats = useStore((state) =>
    system === 'rabbitmq' ? state.updateRabbitMQStats : state.updateKafkaStats
  );
  const addChartData = useStore((state) =>
    system === 'rabbitmq' ? state.addRabbitMQChartData : state.addKafkaChartData
  );
  const setWSConnected = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQWSConnected : state.setKafkaWSConnected
  );
  const setError = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQError : state.setKafkaError
  );

  useEffect(() => {
    if (!enabled) return;

    const connect = async () => {
      try {
        // Connect to WebSocket
        await wsManager.connect(
          system,
          () => {
            console.log(`[useWebSocket] ${system} connected`);
            setWSConnected(true);
            setError(null);

            // Subscribe to messages
            const messagesSubId = wsManager.subscribeToMessages(system, (message) => {
              addMessage(message);
            });
            subscriptionIds.current.push(messagesSubId);

            // Subscribe to stats
            const statsSubId = wsManager.subscribeToStats(system, (stats) => {
              updateStats(stats);
              // Add chart data point
              addChartData({
                timestamp: Date.now(),
                throughput: stats.throughput,
                latency: stats.averageLatencyMs,
              });
            });
            subscriptionIds.current.push(statsSubId);

            // Subscribe to events (optional)
            const eventsSubId = wsManager.subscribeToEvents(system, (event) => {
              console.log(`[useWebSocket] ${system} event:`, event);
            });
            subscriptionIds.current.push(eventsSubId);
          },
          () => {
            console.log(`[useWebSocket] ${system} disconnected`);
            setWSConnected(false);
          },
          (error) => {
            console.error(`[useWebSocket] ${system} error:`, error);
            setWSConnected(false);
            setError(error.message);
          }
        );
      } catch (error) {
        console.error(`[useWebSocket] Failed to connect to ${system}:`, error);
        setWSConnected(false);
        setError(error instanceof Error ? error.message : 'Connection failed');
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      subscriptionIds.current.forEach((id) => {
        wsManager.unsubscribe(system, id);
      });
      subscriptionIds.current = [];
    };
  }, [system, enabled, addMessage, updateStats, addChartData, setWSConnected, setError]);

  return {
    isConnected: wsManager.isConnected(system),
    subscriptionCount: wsManager.getSubscriptionCount(system),
  };
};
