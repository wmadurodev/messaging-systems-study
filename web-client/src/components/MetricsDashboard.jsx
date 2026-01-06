function MetricsDashboard({ stats, onReset }) {
  if (!stats) {
    return (
      <div className="metrics-dashboard">
        <h3>Metrics</h3>
        <div className="no-stats">Waiting for metrics...</div>
      </div>
    );
  }

  return (
    <div className="metrics-dashboard">
      <div className="metrics-header">
        <h3>Metrics</h3>
        <button onClick={onReset} className="reset-button">Reset</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Sent</div>
          <div className="metric-value">{stats.totalSent}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Received</div>
          <div className="metric-value">{stats.totalReceived}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Average Latency</div>
          <div className="metric-value">{stats.averageLatencyMs.toFixed(2)} ms</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Throughput</div>
          <div className="metric-value">{stats.throughput.toFixed(2)} msg/s</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Success Rate</div>
          <div className="metric-value">
            {stats.totalSent > 0
              ? ((stats.totalReceived / stats.totalSent) * 100).toFixed(2)
              : 0}%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Last Message</div>
          <div className="metric-value">
            {stats.lastMessageTimestamp
              ? new Date(stats.lastMessageTimestamp).toLocaleTimeString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsDashboard;
