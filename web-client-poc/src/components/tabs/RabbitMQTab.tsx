import React from 'react';
import { Grid } from '@mui/material';
import { useMessaging } from '../../hooks/useMessaging';
import MessagingPanel from '../messaging/MessagingPanel';
import MetricsDashboard from '../metrics/MetricsDashboard';

const RabbitMQTab: React.FC = () => {
  const messaging = useMessaging({ system: 'rabbitmq' });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <MessagingPanel system="rabbitmq" messaging={messaging} />
      </Grid>
      <Grid item xs={12} lg={6}>
        <MetricsDashboard system="rabbitmq" stats={messaging.stats} chartData={messaging.chartData} />
      </Grid>
    </Grid>
  );
};

export default RabbitMQTab;
