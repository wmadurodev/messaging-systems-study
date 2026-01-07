import { MessageStats } from '../types';

/**
 * Calculate success rate percentage
 * @param stats - Message statistics
 * @returns Success rate as percentage (0-100)
 */
export const calculateSuccessRate = (stats: MessageStats): number => {
  if (stats.totalSent === 0) return 0;
  return (stats.totalReceived / stats.totalSent) * 100;
};

/**
 * Calculate message loss count
 * @param stats - Message statistics
 * @returns Number of messages lost
 */
export const calculateMessageLoss = (stats: MessageStats): number => {
  return Math.max(0, stats.totalSent - stats.totalReceived);
};

/**
 * Format throughput for display
 * @param throughput - Messages per second
 * @returns Formatted throughput string
 */
export const formatThroughput = (throughput: number): string => {
  if (throughput === 0) return '0 msg/s';
  if (throughput < 1) return `${throughput.toFixed(3)} msg/s`;
  if (throughput < 1000) return `${throughput.toFixed(2)} msg/s`;
  return `${(throughput / 1000).toFixed(2)}k msg/s`;
};

/**
 * Format latency for display
 * @param latencyMs - Latency in milliseconds
 * @returns Formatted latency string
 */
export const formatLatencyDisplay = (latencyMs: number): string => {
  if (latencyMs === 0) return '0ms';
  if (latencyMs < 1000) return `${latencyMs.toFixed(2)}ms`;
  return `${(latencyMs / 1000).toFixed(3)}s`;
};

/**
 * Compare two stats and return the winner based on performance
 * @param stats1 - First stats
 * @param stats2 - Second stats
 * @returns 'first', 'second', or 'tie'
 */
export const compareStats = (
  stats1: MessageStats,
  stats2: MessageStats
): 'first' | 'second' | 'tie' => {
  // Compare throughput (higher is better)
  if (stats1.throughput > stats2.throughput * 1.1) return 'first';
  if (stats2.throughput > stats1.throughput * 1.1) return 'second';

  // Compare latency (lower is better)
  if (stats1.averageLatencyMs < stats2.averageLatencyMs * 0.9) return 'first';
  if (stats2.averageLatencyMs < stats1.averageLatencyMs * 0.9) return 'second';

  return 'tie';
};

/**
 * Calculate percentage difference between two values
 * @param value1 - First value
 * @param value2 - Second value
 * @returns Percentage difference
 */
export const calculatePercentageDifference = (value1: number, value2: number): number => {
  if (value2 === 0) return value1 === 0 ? 0 : 100;
  return ((value1 - value2) / value2) * 100;
};

/**
 * Format a large number for display
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatLargeNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(2)}M`;
};
