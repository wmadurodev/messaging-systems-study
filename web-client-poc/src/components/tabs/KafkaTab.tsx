import React from 'react';
import { Grid } from '@mui/material';
import { useMessaging } from '../../hooks/useMessaging';
import MessagingPanel from '../messaging/MessagingPanel';
import MetricsDashboard from '../metrics/MetricsDashboard';

const KafkaTab: React.FC = () => {
  const messaging = useMessaging({ system: 'kafka' });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <MessagingPanel system="kafka" messaging={messaging} />
      </Grid>
      <Grid item xs={12} lg={6}>
        <MetricsDashboard system="kafka" stats={messaging.stats} chartData={messaging.chartData} />
      </Grid>
    </Grid>
  );
};

export default KafkaTab;
