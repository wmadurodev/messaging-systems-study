import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { getApiClient } from '../services/api/apiClient';
import { createMessagingApi } from '../services/api/messagingApi';
import { SystemType } from '../types';
import { HEALTH_CHECK_INTERVAL } from '../utils/constants';

interface UseHealthCheckOptions {
  system: SystemType;
  enabled?: boolean;
  interval?: number;
}

export const useHealthCheck = ({
  system,
  enabled = true,
  interval = HEALTH_CHECK_INTERVAL,
}: UseHealthCheckOptions) => {
  const intervalRef = useRef<number | null>(null);

  // Get store actions based on system
  const setHealth = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQHealth : state.setKafkaHealth
  );
  const setError = useStore((state) =>
    system === 'rabbitmq' ? state.setRabbitMQError : state.setKafkaError
  );

  // Get current health status
  const health = useStore((state) =>
    system === 'rabbitmq' ? state.rabbitmq.health : state.kafka.health
  );

  useEffect(() => {
    if (!enabled) return;

    const api = createMessagingApi(getApiClient(system));

    const checkHealth = async () => {
      try {
        const healthStatus = await api.getHealth();
        setHealth(healthStatus);

        if (healthStatus.status === 'DOWN') {
          setError(`${system} is down: ${healthStatus.error || 'Unknown error'}`);
        } else {
          setError(null);
        }
      } catch (error) {
        console.error(`[useHealthCheck] Failed to check ${system} health:`, error);
        setHealth({
          status: 'DOWN',
          connected: false,
          type: system === 'rabbitmq' ? 'RABBITMQ' : 'KAFKA',
          details: {},
          error: error instanceof Error ? error.message : 'Health check failed',
        });
        setError(error instanceof Error ? error.message : 'Health check failed');
      }
    };

    // Initial health check
    checkHealth();

    // Set up interval for periodic health checks
    intervalRef.current = setInterval(checkHealth, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [system, enabled, interval, setHealth, setError]);

  return {
    health,
    isHealthy: health?.status === 'UP' && health?.connected === true,
    isChecking: health === null,
  };
};
