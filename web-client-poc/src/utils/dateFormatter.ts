import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a timestamp to a readable date/time string
 * @param timestamp - Unix timestamp in milliseconds
 * @param formatStr - Format string (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string => {
  return format(new Date(timestamp), formatStr);
};

/**
 * Format a timestamp to a short time string (HH:mm:ss)
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string
 */
export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'HH:mm:ss');
};

/**
 * Format a timestamp to show relative time (e.g., "2 minutes ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

/**
 * Format a timestamp to ISO string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns ISO formatted date string
 */
export const formatISOTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};

/**
 * Calculate and format latency
 * @param sentTimestamp - When the message was sent
 * @param receivedTimestamp - When the message was received
 * @returns Formatted latency string
 */
export const formatLatency = (sentTimestamp: number, receivedTimestamp: number): string => {
  const latencyMs = receivedTimestamp - sentTimestamp;
  if (latencyMs < 1000) {
    return `${latencyMs}ms`;
  } else {
    return `${(latencyMs / 1000).toFixed(2)}s`;
  }
};

/**
 * Format duration in milliseconds to a readable string
 * @param durationMs - Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (durationMs: number): string => {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};
