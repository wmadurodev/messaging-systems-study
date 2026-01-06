import { useState } from 'react';
import './App.css';
import MessagingPanel from './components/MessagingPanel';
import ComparisonView from './components/ComparisonView';
import { RABBITMQ_WS_URL, KAFKA_WS_URL } from './utils/constants';
import { rabbitMQApi, kafkaApi } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('rabbitmq');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Messaging Systems Comparison</h1>
        <p>RabbitMQ vs Kafka Performance Testing</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'rabbitmq' ? 'active' : ''}
          onClick={() => setActiveTab('rabbitmq')}
        >
          RabbitMQ
        </button>
        <button
          className={activeTab === 'kafka' ? 'active' : ''}
          onClick={() => setActiveTab('kafka')}
        >
          Kafka
        </button>
        <button
          className={activeTab === 'comparison' ? 'active' : ''}
          onClick={() => setActiveTab('comparison')}
        >
          Comparison
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'rabbitmq' && (
          <MessagingPanel
            title="RabbitMQ"
            api={rabbitMQApi}
            wsUrl={RABBITMQ_WS_URL}
          />
        )}
        {activeTab === 'kafka' && (
          <MessagingPanel
            title="Kafka"
            api={kafkaApi}
            wsUrl={KAFKA_WS_URL}
          />
        )}
        {activeTab === 'comparison' && (
          <ComparisonView
            rabbitMQApi={rabbitMQApi}
            kafkaApi={kafkaApi}
          />
        )}
      </main>
    </div>
  );
}

export default App;
