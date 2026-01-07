import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { SystemType } from '../../types';

interface ConnectionStatusProps {
  system: SystemType;
  isConnected: boolean;
  isHealthy?: boolean;
  wsConnected?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  system,
  isConnected,
  isHealthy = false,
  wsConnected = false,
}) => {
  const systemName = system === 'rabbitmq' ? 'RabbitMQ' : 'Kafka';
  const color = system === 'rabbitmq' ? '#FF6B35' : '#004E89';

  const getStatusColor = (): 'success' | 'error' | 'warning' | 'default' => {
    if (isConnected && isHealthy && wsConnected) return 'success';
    if (!isConnected || !isHealthy) return 'error';
    if (!wsConnected) return 'warning';
    return 'default';
  };

  const getStatusText = (): string => {
    if (isConnected && isHealthy && wsConnected) return 'Connected';
    if (!isConnected) return 'API Disconnected';
    if (!isHealthy) return 'Unhealthy';
    if (!wsConnected) return 'WebSocket Disconnected';
    return 'Unknown';
  };

  const getTooltipText = (): string => {
    const parts = [
      `${systemName} Status:`,
      `API: ${isConnected ? (isHealthy ? 'Connected & Healthy' : 'Connected but Unhealthy') : 'Disconnected'}`,
      `WebSocket: ${wsConnected ? 'Connected' : 'Disconnected'}`,
    ];
    return parts.join('\n');
  };

  return (
    <Tooltip title={<Typography sx={{ whiteSpace: 'pre-line' }}>{getTooltipText()}</Typography>}>
      <Box sx={{ display: 'inline-block' }}>
        <Chip
          icon={
            getStatusColor() === 'success' ? (
              <CheckCircleIcon />
            ) : (
              <ErrorIcon />
            )
          }
          label={`${systemName}: ${getStatusText()}`}
          color={getStatusColor()}
          size="small"
          sx={{
            fontWeight: 600,
            ...(getStatusColor() === 'success' && {
              bgcolor: `${color}20`,
              color: color,
              '& .MuiChip-icon': {
                color: color,
              },
            }),
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default ConnectionStatus;
