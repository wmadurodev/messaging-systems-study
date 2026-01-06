function MessageConsumer({ messages, onClear }) {
  return (
    <div className="message-consumer">
      <div className="consumer-header">
        <h3>Received Messages</h3>
        <div className="consumer-controls">
          <span className="message-count">Count: {messages.length}</span>
          <button onClick={onClear}>Clear</button>
        </div>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">No messages received yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message-item">
              <div className="message-header">
                <span className="message-id">{msg.messageId?.substring(0, 8)}</span>
                <span className="message-time">
                  {msg.receivedAt ? new Date(msg.receivedAt).toLocaleTimeString() : ''}
                </span>
              </div>
              <div className="message-content">{msg.content}</div>
              {msg.receivedAt && msg.timestamp && (
                <div className="message-latency">
                  Latency: {(msg.receivedAt - msg.timestamp)}ms
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessageConsumer;
