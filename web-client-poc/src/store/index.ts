import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createRabbitMQSlice, RabbitMQSlice } from './slices/rabbitmqSlice';
import { createKafkaSlice, KafkaSlice } from './slices/kafkaSlice';
import { createUISlice, UISlice } from './slices/uiSlice';

// Combined store type
export type AppStore = RabbitMQSlice & KafkaSlice & UISlice;

// Create the store with all slices combined
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createRabbitMQSlice(...a),
        ...createKafkaSlice(...a),
        ...createUISlice(...a),
      }),
      {
        name: 'messaging-systems-storage', // LocalStorage key
        partialize: (state) => ({ ui: state.ui }), // Only persist UI state
      }
    ),
    {
      name: 'MessagingSystemsStore', // DevTools name
    }
  )
);

// Convenience selectors
export const useRabbitMQState = () => useStore((state) => state.rabbitmq);
export const useKafkaState = () => useStore((state) => state.kafka);
export const useUIState = () => useStore((state) => state.ui);

// Selector hooks for specific data
export const useRabbitMQMessages = () => useStore((state) => state.rabbitmq.messages);
export const useKafkaMessages = () => useStore((state) => state.kafka.messages);
export const useRabbitMQStats = () => useStore((state) => state.rabbitmq.stats);
export const useKafkaStats = () => useStore((state) => state.kafka.stats);
export const useActiveTab = () => useStore((state) => state.ui.activeTab);

// Export individual actions for convenience
export const useRabbitMQActions = () =>
  useStore((state) => ({
    addMessage: state.addRabbitMQMessage,
    setMessages: state.setRabbitMQMessages,
    clearMessages: state.clearRabbitMQMessages,
    updateStats: state.updateRabbitMQStats,
    addChartData: state.addRabbitMQChartData,
    setHealth: state.setRabbitMQHealth,
    setWSConnected: state.setRabbitMQWSConnected,
    setLoading: state.setRabbitMQLoading,
    setError: state.setRabbitMQError,
    reset: state.resetRabbitMQ,
  }));

export const useKafkaActions = () =>
  useStore((state) => ({
    addMessage: state.addKafkaMessage,
    setMessages: state.setKafkaMessages,
    clearMessages: state.clearKafkaMessages,
    updateStats: state.updateKafkaStats,
    addChartData: state.addKafkaChartData,
    setHealth: state.setKafkaHealth,
    setWSConnected: state.setKafkaWSConnected,
    setLoading: state.setKafkaLoading,
    setError: state.setKafkaError,
    reset: state.resetKafka,
  }));

export const useUIActions = () =>
  useStore((state) => ({
    setActiveTab: state.setActiveTab,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));
