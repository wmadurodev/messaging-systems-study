import axios from 'axios';
import { RABBITMQ_API_URL, KAFKA_API_URL } from '../utils/constants';

const createApiClient = (baseURL) => {
  return {
    sendMessage: (message) => axios.post(`${baseURL}/messages/send`, message),
    sendBulk: (bulkRequest) => axios.post(`${baseURL}/messages/send-bulk`, bulkRequest),
    getStats: () => axios.get(`${baseURL}/messages/stats`),
    subscribe: (config) => axios.post(`${baseURL}/messages/subscribe`, config || {}),
    unsubscribe: () => axios.delete(`${baseURL}/messages/unsubscribe`),
    getReceived: (limit = 100) => axios.get(`${baseURL}/messages/received?limit=${limit}`),
    clearReceived: () => axios.delete(`${baseURL}/messages/received`),
    resetStats: () => axios.post(`${baseURL}/messages/stats/reset`),
    getHealth: () => axios.get(`${baseURL}/health`),
    getConfig: () => axios.get(`${baseURL}/config`),
  };
};

export const rabbitMQApi = createApiClient(RABBITMQ_API_URL);
export const kafkaApi = createApiClient(KAFKA_API_URL);
