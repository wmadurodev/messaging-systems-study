import { useState } from 'react';
import { MESSAGE_FORMAT } from '../utils/constants';

function MessagePublisher({ api }) {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState(MESSAGE_FORMAT.TEXT);
  const [bulkCount, setBulkCount] = useState(100);
  const [bulkTemplate, setBulkTemplate] = useState('Test message {index}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendSingle = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await api.sendMessage({ content, format });
      setResult({ success: true, message: 'Message sent successfully', data: response.data });
      setContent('');
    } catch (error) {
      setResult({ success: false, message: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await api.sendBulk({
        count: bulkCount,
        messageTemplate: bulkTemplate,
        format,
        delayMs: 0
      });
      setResult({
        success: true,
        message: `Bulk send completed: ${response.data.successCount} sent in ${response.data.durationMs}ms`,
        data: response.data
      });
    } catch (error) {
      setResult({ success: false, message: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-publisher">
      <h3>Publish Messages</h3>

      <div className="publisher-form">
        <div className="form-group">
          <label>Message Format:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value={MESSAGE_FORMAT.TEXT}>TEXT</option>
            <option value={MESSAGE_FORMAT.JSON}>JSON</option>
          </select>
        </div>

        <div className="form-section">
          <h4>Single Message</h4>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter message content..."
            rows="3"
          />
          <button
            onClick={handleSendSingle}
            disabled={!content || loading}
          >
            Send Single Message
          </button>
        </div>

        <div className="form-section">
          <h4>Bulk Messages</h4>
          <div className="form-group">
            <label>Count:</label>
            <input
              type="number"
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value))}
              min="1"
              max="10000"
            />
          </div>
          <div className="form-group">
            <label>Template (use {'{index}'} for counter):</label>
            <input
              type="text"
              value={bulkTemplate}
              onChange={(e) => setBulkTemplate(e.target.value)}
            />
          </div>
          <button
            onClick={handleSendBulk}
            disabled={loading}
          >
            Send Bulk Messages
          </button>
        </div>

        {loading && <div className="loading">Sending...</div>}
        {result && (
          <div className={`result ${result.success ? 'success' : 'error'}`}>
            <p>{result.message}</p>
            {result.data && result.data.throughput && (
              <p>Throughput: {result.data.throughput.toFixed(2)} msg/s</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePublisher;
