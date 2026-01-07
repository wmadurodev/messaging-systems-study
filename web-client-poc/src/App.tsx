import React, { useEffect } from 'react';
import { Box, Container, Tabs, Tab, AppBar, Toolbar, Typography, Stack } from '@mui/material';
import { useStore } from './store';
import { useWebSocket } from './hooks/useWebSocket';
import { useHealthCheck } from './hooks/useHealthCheck';
import ConnectionStatus from './components/common/ConnectionStatus';
import RabbitMQTab from './components/tabs/RabbitMQTab';
import KafkaTab from './components/tabs/KafkaTab';
import ComparisonTab from './components/tabs/ComparisonTab';

const App: React.FC = () => {
  const activeTab = useStore((state) => state.ui.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  // RabbitMQ connections
  const rabbitmqWS = useWebSocket({ system: 'rabbitmq' });
  const rabbitmqHealth = useHealthCheck({ system: 'rabbitmq' });

  // Kafka connections
  const kafkaWS = useWebSocket({ system: 'kafka' });
  const kafkaHealth = useHealthCheck({ system: 'kafka' });

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'rabbitmq' | 'kafka' | 'comparison') => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Messaging Systems Comparison
          </Typography>
          <Stack direction="row" spacing={2}>
            <ConnectionStatus
              system="rabbitmq"
              isConnected={rabbitmqHealth.health?.connected || false}
              isHealthy={rabbitmqHealth.isHealthy}
              wsConnected={rabbitmqWS.isConnected}
            />
            <ConnectionStatus
              system="kafka"
              isConnected={kafkaHealth.health?.connected || false}
              isHealthy={kafkaHealth.isHealthy}
              wsConnected={kafkaWS.isConnected}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="messaging system tabs">
            <Tab label="RabbitMQ" value="rabbitmq" />
            <Tab label="Kafka" value="kafka" />
            <Tab label="Comparison" value="comparison" />
          </Tabs>
        </Container>
      </Box>

      {/* Tab Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {activeTab === 'rabbitmq' && <RabbitMQTab />}
        {activeTab === 'kafka' && <KafkaTab />}
        {activeTab === 'comparison' && <ComparisonTab />}
      </Container>
    </Box>
  );
};

export default App;
