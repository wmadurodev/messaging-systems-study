import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SystemType, MessageStats, ChartDataPoint } from '../../types';
import { formatThroughput, formatLatencyDisplay, formatLargeNumber } from '../../utils/statsCalculator';
import { CHART_COLORS } from '../../utils/constants';
import { formatTime } from '../../utils/dateFormatter';

interface MetricsDashboardProps {
  system: SystemType;
  stats: MessageStats;
  chartData: ChartDataPoint[];
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ system, stats, chartData }) => {
  const systemColor = system === 'rabbitmq' ? CHART_COLORS.RABBITMQ : CHART_COLORS.KAFKA;
  const systemName = system === 'rabbitmq' ? 'RabbitMQ' : 'Kafka';

  const StatsCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: color || systemColor, fontWeight: 600 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: systemColor, mb: 3 }}>
        {systemName} Metrics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Sent" value={formatLargeNumber(stats.totalSent)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Received" value={formatLargeNumber(stats.totalReceived)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard
            title="Avg Latency"
            value={formatLatencyDisplay(stats.averageLatencyMs)}
            color={stats.averageLatencyMs < 100 ? CHART_COLORS.SUCCESS : CHART_COLORS.WARNING}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard
            title="Throughput"
            value={formatThroughput(stats.throughput)}
            color={CHART_COLORS.SUCCESS}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      {chartData.length > 0 && (
        <Stack spacing={3}>
          {/* Throughput Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Throughput Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => formatTime(timestamp)}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(timestamp) => formatTime(timestamp as number)}
                    formatter={(value: number) => [formatThroughput(value), 'Throughput']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke={systemColor}
                    strokeWidth={2}
                    name="Messages/sec"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Latency Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Latency Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => formatTime(timestamp)}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(timestamp) => formatTime(timestamp as number)}
                    formatter={(value: number) => [formatLatencyDisplay(value), 'Latency']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke={CHART_COLORS.WARNING}
                    strokeWidth={2}
                    name="Latency (ms)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Stack>
      )}

      {chartData.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No chart data available yet. Send messages to see charts.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MetricsDashboard;
