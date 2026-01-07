import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import { Message } from '../../types';
import { formatTime, formatLatency } from '../../utils/dateFormatter';

interface MessageListProps {
  messages: Message[];
  systemColor: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, systemColor }) => {
  if (messages.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No messages received yet
        </Typography>
      </Box>
    );
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const message = messages[index];
    const latency = message.receivedAt
      ? formatLatency(message.timestamp, message.receivedAt)
      : 'N/A';

    return (
      <Paper
        sx={{
          ...style,
          p: 2,
          m: 1,
          width: 'calc(100% - 16px)',
          borderLeft: `4px solid ${systemColor}`,
        }}
        elevation={1}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {message.messageId.substring(0, 8)}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={message.format} size="small" />
            <Chip label={`Latency: ${latency}`} size="small" color="primary" variant="outlined" />
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
          {message.content.length > 200
            ? `${message.content.substring(0, 200)}...`
            : message.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {formatTime(message.timestamp)}
        </Typography>
      </Paper>
    );
  };

  return (
    <List
      height={500}
      itemCount={messages.length}
      itemSize={150}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default MessageList;
