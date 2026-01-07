import axios, { AxiosInstance, AxiosError } from 'axios';

// Create Axios instance with common configuration
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        // Server responded with error status
        console.error(`API Error: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server:', error.message);
      } else {
        // Error setting up request
        console.error('Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Create separate clients for RabbitMQ and Kafka
export const rabbitmqApi = createApiClient(
  import.meta.env.VITE_RABBITMQ_API_URL || 'http://localhost:8081'
);

export const kafkaApi = createApiClient(
  import.meta.env.VITE_KAFKA_API_URL || 'http://localhost:8082'
);

// Helper to get client by system type
export const getApiClient = (system: 'rabbitmq' | 'kafka'): AxiosInstance => {
  return system === 'rabbitmq' ? rabbitmqApi : kafkaApi;
};
