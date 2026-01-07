import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { SystemType, MessageFormat, BulkMessageRequest } from '../../types';
import { CHART_COLORS } from '../../utils/constants';
import MessageList from './MessageList';

interface MessagingPanelProps {
  system: SystemType;
  messaging: any; // From useMessaging hook
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ system, messaging }) => {
  const [singleMessage, setSingleMessage] = useState('');
  const [messageFormat, setMessageFormat] = useState<MessageFormat>(MessageFormat.TEXT);
  const [bulkCount, setBulkCount] = useState(100);
  const [bulkTemplate, setBulkTemplate] = useState('Message {index}');
  const [bulkDelay, setBulkDelay] = useState(0);

  const systemColor = system === 'rabbitmq' ? CHART_COLORS.RABBITMQ : CHART_COLORS.KAFKA;
  const systemName = system === 'rabbitmq' ? 'RabbitMQ' : 'Kafka';

  const handleSendSingle = async () => {
    if (!singleMessage.trim()) return;
    await messaging.sendMessage(singleMessage, messageFormat);
    setSingleMessage('');
  };

  const handleSendBulk = async () => {
    const request: BulkMessageRequest = {
      count: bulkCount,
      messageTemplate: bulkTemplate,
      format: messageFormat,
      delayMs: bulkDelay,
    };
    await messaging.sendBulkMessages(request);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: systemColor, mb: 3 }}>
        {systemName} Messaging
      </Typography>

      {/* Single Message */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Send Single Message
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Message Content"
              multiline
              rows={3}
              value={singleMessage}
              onChange={(e) => setSingleMessage(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth size="small">
              <InputLabel>Format</InputLabel>
              <Select
                value={messageFormat}
                label="Format"
                onChange={(e) => setMessageFormat(e.target.value as MessageFormat)}
              >
                <MenuItem value={MessageFormat.TEXT}>Text</MenuItem>
                <MenuItem value={MessageFormat.JSON}>JSON</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendSingle}
              disabled={messaging.isSending || !singleMessage.trim()}
              fullWidth
              sx={{ bgcolor: systemColor, '&:hover': { bgcolor: systemColor, opacity: 0.9 } }}
            >
              Send Message
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Bulk Messages */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Send Bulk Messages
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Count"
              type="number"
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value) || 100)}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 10000 }}
            />
            <TextField
              label="Message Template"
              helperText="Use {index} as placeholder (e.g., 'Message {index}')"
              value={bulkTemplate}
              onChange={(e) => setBulkTemplate(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Delay between messages (ms)"
              type="number"
              value={bulkDelay}
              onChange={(e) => setBulkDelay(parseInt(e.target.value) || 0)}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendBulk}
              disabled={messaging.isSending}
              fullWidth
              sx={{ bgcolor: systemColor, '&:hover': { bgcolor: systemColor, opacity: 0.9 } }}
            >
              Send {bulkCount} Messages
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Display */}
      {messaging.sendError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => messaging.setError(null)}>
          {messaging.sendError}
        </Alert>
      )}

      {/* Messages List */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Received Messages ({messaging.messages.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={messaging.clearMessages}
              disabled={messaging.messages.length === 0}
            >
              Clear All
            </Button>
          </Stack>
          <MessageList messages={messaging.messages} systemColor={systemColor} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MessagingPanel;
