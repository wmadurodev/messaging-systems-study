import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import MessagePublisher from './MessagePublisher';
import MessageConsumer from './MessageConsumer';
import MetricsDashboard from './MetricsDashboard';

function MessagingPanel({ title, api, wsUrl }) {
  const { messages, stats, connected, clearMessages } = useWebSocket(wsUrl);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await api.getHealth();
      setHealth(response.data);
    } catch (error) {
      setHealth({ status: 'DOWN', connected: false });
    }
  };

  const handleClearMessages = async () => {
    try {
      await api.clearReceived();
      clearMessages();
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  };

  const handleResetStats = async () => {
    try {
      await api.resetStats();
      clearMessages();
    } catch (error) {
      console.error('Failed to reset stats:', error);
    }
  };

  return (
    <div className="messaging-panel">
      <div className="panel-header">
        <h2>{title}</h2>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
          {health && (
            <span className="health-status">
              {health.type} - {health.status}
            </span>
          )}
        </div>
      </div>

      <div className="panel-grid">
        <div className="publisher-section">
          <MessagePublisher api={api} />
        </div>

        <div className="consumer-section">
          <MessageConsumer
            messages={messages}
            onClear={handleClearMessages}
          />
        </div>

        <div className="metrics-section">
          <MetricsDashboard
            stats={stats}
            onReset={handleResetStats}
          />
        </div>
      </div>
    </div>
  );
}

export default MessagingPanel;
