import { WebSocketClient, MessageCallback } from './WebSocketClient';
import { RABBITMQ_WS_URL, KAFKA_WS_URL, WS_TOPICS } from '../../utils/constants';
import { Message, MessageStats } from '../../types';

export type SystemType = 'rabbitmq' | 'kafka';

export class WebSocketManager {
  private rabbitmqClient: WebSocketClient;
  private kafkaClient: WebSocketClient;
  private connectionCallbacks: Map<SystemType, () => void> = new Map();
  private disconnectionCallbacks: Map<SystemType, () => void> = new Map();

  constructor() {
    this.rabbitmqClient = new WebSocketClient(RABBITMQ_WS_URL);
    this.kafkaClient = new WebSocketClient(KAFKA_WS_URL);
  }

  /**
   * Get WebSocket client for a system
   */
  private getClient(system: SystemType): WebSocketClient {
    return system === 'rabbitmq' ? this.rabbitmqClient : this.kafkaClient;
  }

  /**
   * Connect to a system's WebSocket
   */
  async connect(
    system: SystemType,
    onConnect?: () => void,
    onDisconnect?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    const client = this.getClient(system);

    if (onConnect) {
      this.connectionCallbacks.set(system, onConnect);
    }
    if (onDisconnect) {
      this.disconnectionCallbacks.set(system, onDisconnect);
    }

    try {
      await client.connect(onConnect, onDisconnect, onError);
      console.log(`[WebSocketManager] Connected to ${system}`);
    } catch (error) {
      console.error(`[WebSocketManager] Failed to connect to ${system}`, error);
      throw error;
    }
  }

  /**
   * Connect to both systems
   */
  async connectBoth(
    onRabbitMQConnect?: () => void,
    onKafkaConnect?: () => void,
    onError?: (system: SystemType, error: Error) => void
  ): Promise<void> {
    const connectPromises = [
      this.connect(
        'rabbitmq',
        onRabbitMQConnect,
        undefined,
        (error) => onError?.('rabbitmq', error)
      ),
      this.connect(
        'kafka',
        onKafkaConnect,
        undefined,
        (error) => onError?.('kafka', error)
      ),
    ];

    await Promise.allSettled(connectPromises);
  }

  /**
   * Disconnect from a system
   */
  async disconnect(system: SystemType): Promise<void> {
    const client = this.getClient(system);
    await client.disconnect();
    console.log(`[WebSocketManager] Disconnected from ${system}`);
  }

  /**
   * Disconnect from both systems
   */
  async disconnectBoth(): Promise<void> {
    await Promise.all([
      this.disconnect('rabbitmq'),
      this.disconnect('kafka'),
    ]);
  }

  /**
   * Subscribe to messages topic
   */
  subscribeToMessages(system: SystemType, callback: (message: Message) => void): string {
    const client = this.getClient(system);
    return client.subscribe(WS_TOPICS.MESSAGES, callback);
  }

  /**
   * Subscribe to stats topic
   */
  subscribeToStats(system: SystemType, callback: (stats: MessageStats) => void): string {
    const client = this.getClient(system);
    return client.subscribe(WS_TOPICS.STATS, callback);
  }

  /**
   * Subscribe to events topic
   */
  subscribeToEvents(system: SystemType, callback: (event: string) => void): string {
    const client = this.getClient(system);
    return client.subscribe(WS_TOPICS.EVENTS, callback);
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(system: SystemType, subscriptionId: string): void {
    const client = this.getClient(system);
    client.unsubscribe(subscriptionId);
  }

  /**
   * Check if a system is connected
   */
  isConnected(system: SystemType): boolean {
    const client = this.getClient(system);
    return client.isConnected();
  }

  /**
   * Check if both systems are connected
   */
  areBothConnected(): boolean {
    return this.isConnected('rabbitmq') && this.isConnected('kafka');
  }

  /**
   * Get subscription count for a system
   */
  getSubscriptionCount(system: SystemType): number {
    const client = this.getClient(system);
    return client.getSubscriptionCount();
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
