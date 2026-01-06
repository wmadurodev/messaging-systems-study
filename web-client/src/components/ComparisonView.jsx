import { useState, useEffect } from 'react';

function ComparisonView({ rabbitMQApi, kafkaApi }) {
  const [rabbitMQStats, setRabbitMQStats] = useState(null);
  const [kafkaStats, setKafkaStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [rabbitResponse, kafkaResponse] = await Promise.all([
        rabbitMQApi.getStats(),
        kafkaApi.getStats()
      ]);
      setRabbitMQStats(rabbitResponse.data);
      setKafkaStats(kafkaResponse.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const MetricComparison = ({ label, rabbitValue, kafkaValue, unit = '' }) => {
    const rabbitNum = parseFloat(rabbitValue) || 0;
    const kafkaNum = parseFloat(kafkaValue) || 0;
    const winner = rabbitNum > kafkaNum ? 'rabbitmq' : kafkaNum > rabbitNum ? 'kafka' : 'tie';

    return (
      <div className="metric-comparison">
        <div className="comparison-label">{label}</div>
        <div className="comparison-values">
          <div className={`comparison-value ${winner === 'rabbitmq' ? 'winner' : ''}`}>
            <span className="system-name">RabbitMQ</span>
            <span className="value">{rabbitNum.toFixed(2)}{unit}</span>
          </div>
          <div className={`comparison-value ${winner === 'kafka' ? 'winner' : ''}`}>
            <span className="system-name">Kafka</span>
            <span className="value">{kafkaNum.toFixed(2)}{unit}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comparison-view">
      <h2>RabbitMQ vs Kafka Comparison</h2>

      <button onClick={fetchStats} disabled={loading} className="refresh-button">
        {loading ? 'Loading...' : 'Refresh Stats'}
      </button>

      {rabbitMQStats && kafkaStats ? (
        <div className="comparison-grid">
          <MetricComparison
            label="Total Messages Sent"
            rabbitValue={rabbitMQStats.totalSent}
            kafkaValue={kafkaStats.totalSent}
          />
          <MetricComparison
            label="Total Messages Received"
            rabbitValue={rabbitMQStats.totalReceived}
            kafkaValue={kafkaStats.totalReceived}
          />
          <MetricComparison
            label="Average Latency"
            rabbitValue={rabbitMQStats.averageLatencyMs}
            kafkaValue={kafkaStats.averageLatencyMs}
            unit=" ms"
          />
          <MetricComparison
            label="Throughput"
            rabbitValue={rabbitMQStats.throughput}
            kafkaValue={kafkaStats.throughput}
            unit=" msg/s"
          />
          <MetricComparison
            label="Success Rate"
            rabbitValue={(rabbitMQStats.totalSent > 0 ? (rabbitMQStats.totalReceived / rabbitMQStats.totalSent) * 100 : 0)}
            kafkaValue={(kafkaStats.totalSent > 0 ? (kafkaStats.totalReceived / kafkaStats.totalSent) * 100 : 0)}
            unit="%"
          />
        </div>
      ) : (
        <div className="no-data">No comparison data available yet. Send messages from both systems to see comparison.</div>
      )}

      <div className="comparison-notes">
        <h3>Notes</h3>
        <ul>
          <li>Higher throughput (msg/s) is better</li>
          <li>Lower latency (ms) is better</li>
          <li>Higher success rate (%) is better</li>
          <li>Metrics are collected in real-time</li>
        </ul>
      </div>
    </div>
  );
}

export default ComparisonView;
