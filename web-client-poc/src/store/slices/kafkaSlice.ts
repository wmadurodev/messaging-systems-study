import { StateCreator } from 'zustand';
import { Message, MessageStats, HealthStatus, ChartDataPoint } from '../../types';
import { SystemState, initialSystemState } from './types';
import { MAX_MESSAGES, CHART_MAX_DATA_POINTS } from '../../utils/constants';

export interface KafkaSlice {
  kafka: SystemState;

  // Message actions
  addKafkaMessage: (message: Message) => void;
  setKafkaMessages: (messages: Message[]) => void;
  clearKafkaMessages: () => void;

  // Stats actions
  updateKafkaStats: (stats: MessageStats) => void;
  addKafkaChartData: (dataPoint: ChartDataPoint) => void;

  // Health actions
  setKafkaHealth: (health: HealthStatus) => void;

  // Connection actions
  setKafkaWSConnected: (connected: boolean) => void;

  // Loading and error actions
  setKafkaLoading: (loading: boolean) => void;
  setKafkaError: (error: string | null) => void;

  // Reset action
  resetKafka: () => void;
}

export const createKafkaSlice: StateCreator<KafkaSlice> = (set) => ({
  kafka: initialSystemState,

  // Add a new message to the list
  addKafkaMessage: (message) =>
    set((state) => {
      const newMessages = [message, ...state.kafka.messages];
      // Keep only last MAX_MESSAGES
      if (newMessages.length > MAX_MESSAGES) {
        newMessages.pop();
      }
      return {
        kafka: {
          ...state.kafka,
          messages: newMessages,
        },
      };
    }),

  // Set all messages (e.g., from API)
  setKafkaMessages: (messages) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        messages,
      },
    })),

  // Clear all messages
  clearKafkaMessages: () =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        messages: [],
      },
    })),

  // Update statistics
  updateKafkaStats: (stats) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        stats,
      },
    })),

  // Add chart data point
  addKafkaChartData: (dataPoint) =>
    set((state) => {
      const newChartData = [...state.kafka.chartData, dataPoint];
      // Keep only last CHART_MAX_DATA_POINTS
      if (newChartData.length > CHART_MAX_DATA_POINTS) {
        newChartData.shift();
      }
      return {
        kafka: {
          ...state.kafka,
          chartData: newChartData,
        },
      };
    }),

  // Set health status
  setKafkaHealth: (health) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        health,
      },
    })),

  // Set WebSocket connection status
  setKafkaWSConnected: (connected) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        wsConnected: connected,
      },
    })),

  // Set loading state
  setKafkaLoading: (loading) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        isLoading: loading,
      },
    })),

  // Set error
  setKafkaError: (error) =>
    set((state) => ({
      kafka: {
        ...state.kafka,
        error,
      },
    })),

  // Reset to initial state
  resetKafka: () =>
    set({
      kafka: initialSystemState,
    }),
});
