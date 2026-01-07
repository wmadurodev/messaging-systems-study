// Message statistics
export interface MessageStats {
  totalSent: number;
  totalReceived: number;
  averageLatencyMs: number;
  throughput: number; // Messages per second
  lastMessageTimestamp: number;
}

// Received messages response
export interface ReceivedMessagesResponse {
  messages: import('./message').Message[];
  total: number;
}

// Chart data point for time series visualization
export interface ChartDataPoint {
  timestamp: number;
  throughput?: number;
  latency?: number;
  label?: string;
}
