import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type MessageCallback = (message: any) => void;
export type ErrorCallback = (error: Error) => void;
export type ConnectCallback = () => void;

export class WebSocketClient {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private url: string;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private onConnectCallback?: ConnectCallback;
  private onDisconnectCallback?: () => void;
  private onErrorCallback?: ErrorCallback;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  connect(
    onConnect?: ConnectCallback,
    onDisconnect?: () => void,
    onError?: ErrorCallback
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onConnectCallback = onConnect;
      this.onDisconnectCallback = onDisconnect;
      this.onErrorCallback = onError;

      // Create STOMP client with SockJS
      this.client = new Client({
        webSocketFactory: () => new SockJS(this.url) as any,
        debug: (str) => {
          console.log('[WebSocket Debug]', str);
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Connection success handler
      this.client.onConnect = () => {
        console.log(`[WebSocket] Connected to ${this.url}`);
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        if (this.onConnectCallback) {
          this.onConnectCallback();
        }
        resolve();
      };

      // Connection error handler
      this.client.onStompError = (frame) => {
        const error = new Error(`WebSocket error: ${frame.headers['message']}`);
        console.error('[WebSocket Error]', error, frame.body);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      };

      // Disconnection handler
      this.client.onDisconnect = () => {
        console.log(`[WebSocket] Disconnected from ${this.url}`);
        if (this.onDisconnectCallback) {
          this.onDisconnectCallback();
        }
      };

      // Web socket error handler
      this.client.onWebSocketError = (event) => {
        const error = new Error('WebSocket connection error');
        console.error('[WebSocket Connection Error]', event);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        reject(error);
      };

      // Activate the client
      try {
        this.client.activate();
      } catch (error) {
        console.error('[WebSocket] Failed to activate client', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client) {
        // Unsubscribe from all topics
        this.subscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
        this.subscriptions.clear();

        // Deactivate the client
        this.client.deactivate().then(() => {
          console.log('[WebSocket] Disconnected successfully');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Subscribe to a topic
   * @param topic - Topic to subscribe to (e.g., '/topic/messages')
   * @param callback - Callback function for received messages
   * @returns Subscription ID
   */
  subscribe(topic: string, callback: MessageCallback): string {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket is not connected');
    }

    const subscriptionId = `sub-${Date.now()}-${Math.random()}`;

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message', error, message.body);
        callback(message.body);
      }
    });

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`[WebSocket] Subscribed to ${topic} with ID ${subscriptionId}`);

    return subscriptionId;
  }

  /**
   * Unsubscribe from a topic
   * @param subscriptionId - Subscription ID to unsubscribe
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`[WebSocket] Unsubscribed from ${subscriptionId}`);
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.client !== null && this.client.connected;
  }

  /**
   * Get number of active subscriptions
   */
  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }
}
