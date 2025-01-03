import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketNotificationComponent = () => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('1'); // Example userId
  const [role, setRole] = useState('Recruiters'); // Example role

  useEffect(() => {
    const socket = io('http://localhost:9092', {
      query: { userId, role }
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, role]);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocketNotificationComponent;
