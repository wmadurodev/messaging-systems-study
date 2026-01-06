import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);

        client.subscribe('/topic/messages', (message) => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [msg, ...prev].slice(0, 100));
        });

        client.subscribe('/topic/stats', (message) => {
          const statsData = JSON.parse(message.body);
          setStats(statsData);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url]);

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, stats, connected, clearMessages };
};
