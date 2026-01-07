import { StateCreator } from 'zustand';
import { Message, MessageStats, HealthStatus, ChartDataPoint } from '../../types';
import { SystemState, initialSystemState } from './types';
import { MAX_MESSAGES, CHART_MAX_DATA_POINTS } from '../../utils/constants';

export interface RabbitMQSlice {
  rabbitmq: SystemState;

  // Message actions
  addRabbitMQMessage: (message: Message) => void;
  setRabbitMQMessages: (messages: Message[]) => void;
  clearRabbitMQMessages: () => void;

  // Stats actions
  updateRabbitMQStats: (stats: MessageStats) => void;
  addRabbitMQChartData: (dataPoint: ChartDataPoint) => void;

  // Health actions
  setRabbitMQHealth: (health: HealthStatus) => void;

  // Connection actions
  setRabbitMQWSConnected: (connected: boolean) => void;

  // Loading and error actions
  setRabbitMQLoading: (loading: boolean) => void;
  setRabbitMQError: (error: string | null) => void;

  // Reset action
  resetRabbitMQ: () => void;
}

export const createRabbitMQSlice: StateCreator<RabbitMQSlice> = (set) => ({
  rabbitmq: initialSystemState,

  // Add a new message to the list
  addRabbitMQMessage: (message) =>
    set((state) => {
      const newMessages = [message, ...state.rabbitmq.messages];
      // Keep only last MAX_MESSAGES
      if (newMessages.length > MAX_MESSAGES) {
        newMessages.pop();
      }
      return {
        rabbitmq: {
          ...state.rabbitmq,
          messages: newMessages,
        },
      };
    }),

  // Set all messages (e.g., from API)
  setRabbitMQMessages: (messages) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        messages,
      },
    })),

  // Clear all messages
  clearRabbitMQMessages: () =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        messages: [],
      },
    })),

  // Update statistics
  updateRabbitMQStats: (stats) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        stats,
      },
    })),

  // Add chart data point
  addRabbitMQChartData: (dataPoint) =>
    set((state) => {
      const newChartData = [...state.rabbitmq.chartData, dataPoint];
      // Keep only last CHART_MAX_DATA_POINTS
      if (newChartData.length > CHART_MAX_DATA_POINTS) {
        newChartData.shift();
      }
      return {
        rabbitmq: {
          ...state.rabbitmq,
          chartData: newChartData,
        },
      };
    }),

  // Set health status
  setRabbitMQHealth: (health) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        health,
      },
    })),

  // Set WebSocket connection status
  setRabbitMQWSConnected: (connected) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        wsConnected: connected,
      },
    })),

  // Set loading state
  setRabbitMQLoading: (loading) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        isLoading: loading,
      },
    })),

  // Set error
  setRabbitMQError: (error) =>
    set((state) => ({
      rabbitmq: {
        ...state.rabbitmq,
        error,
      },
    })),

  // Reset to initial state
  resetRabbitMQ: () =>
    set({
      rabbitmq: initialSystemState,
    }),
});
