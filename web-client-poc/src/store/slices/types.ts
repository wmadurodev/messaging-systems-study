import { Message, MessageStats, HealthStatus, ChartDataPoint } from '../../types';

// System state for RabbitMQ or Kafka
export interface SystemState {
  messages: Message[];
  stats: MessageStats;
  health: HealthStatus | null;
  wsConnected: boolean;
  isLoading: boolean;
  error: string | null;
  chartData: ChartDataPoint[];
}

// UI state
export interface UIState {
  activeTab: 'rabbitmq' | 'kafka' | 'comparison';
  theme: 'light' | 'dark';
}

// Initial system state
export const initialSystemState: SystemState = {
  messages: [],
  stats: {
    totalSent: 0,
    totalReceived: 0,
    averageLatencyMs: 0,
    throughput: 0,
    lastMessageTimestamp: 0,
  },
  health: null,
  wsConnected: false,
  isLoading: false,
  error: null,
  chartData: [],
};

// Initial UI state
export const initialUIState: UIState = {
  activeTab: 'rabbitmq',
  theme: 'light',
};
