import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useMessaging } from '../../hooks/useMessaging';
import { formatThroughput, formatLatencyDisplay, calculateSuccessRate, compareStats } from '../../utils/statsCalculator';
import { CHART_COLORS } from '../../utils/constants';

const ComparisonTab: React.FC = () => {
  const rabbitmq = useMessaging({ system: 'rabbitmq' });
  const kafka = useMessaging({ system: 'kafka' });

  const winner = compareStats(rabbitmq.stats, kafka.stats);

  const MetricComparison: React.FC<{ label: string; rabbitmqValue: string | number; kafkaValue: string | number; higherIsBetter?: boolean }> = ({
    label,
    rabbitmqValue,
    kafkaValue,
    higherIsBetter = true,
  }) => {
    const rabbitmqNum = typeof rabbitmqValue === 'string' ? parseFloat(rabbitmqValue) : rabbitmqValue;
    const kafkaNum = typeof kafkaValue === 'string' ? parseFloat(kafkaValue) : kafkaValue;

    let rabbitmqBetter = higherIsBetter ? rabbitmqNum > kafkaNum : rabbitmqNum < kafkaNum;
    let kafkaBetter = higherIsBetter ? kafkaNum > rabbitmqNum : kafkaNum < rabbitmqNum;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: rabbitmqBetter ? `${CHART_COLORS.RABBITMQ}20` : 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  RabbitMQ
                </Typography>
                <Typography variant="h5" sx={{ color: CHART_COLORS.RABBITMQ, fontWeight: 600 }}>
                  {rabbitmqValue}
                </Typography>
                {rabbitmqBetter && <Chip label="Better" size="small" color="success" sx={{ mt: 1 }} />}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: kafkaBetter ? `${CHART_COLORS.KAFKA}20` : 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Kafka
                </Typography>
                <Typography variant="h5" sx={{ color: CHART_COLORS.KAFKA, fontWeight: 600 }}>
                  {kafkaValue}
                </Typography>
                {kafkaBetter && <Chip label="Better" size="small" color="success" sx={{ mt: 1 }} />}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Performance Comparison
      </Typography>

      {winner !== 'tie' && (
        <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Typography variant="h6">
              Overall Winner: {winner === 'first' ? 'RabbitMQ' : 'Kafka'}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Throughput"
            rabbitmqValue={formatThroughput(rabbitmq.stats.throughput)}
            kafkaValue={formatThroughput(kafka.stats.throughput)}
            higherIsBetter={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Average Latency"
            rabbitmqValue={formatLatencyDisplay(rabbitmq.stats.averageLatencyMs)}
            kafkaValue={formatLatencyDisplay(kafka.stats.averageLatencyMs)}
            higherIsBetter={false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Total Sent"
            rabbitmqValue={rabbitmq.stats.totalSent}
            kafkaValue={kafka.stats.totalSent}
            higherIsBetter={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Total Received"
            rabbitmqValue={rabbitmq.stats.totalReceived}
            kafkaValue={kafka.stats.totalReceived}
            higherIsBetter={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Success Rate"
            rabbitmqValue={`${calculateSuccessRate(rabbitmq.stats).toFixed(2)}%`}
            kafkaValue={`${calculateSuccessRate(kafka.stats).toFixed(2)}%`}
            higherIsBetter={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricComparison
            label="Messages in Store"
            rabbitmqValue={rabbitmq.messages.length}
            kafkaValue={kafka.messages.length}
            higherIsBetter={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComparisonTab;
