"use client";

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FullScreenModal from '../components/FullScreenModal';

dayjs.extend(customParseFormat);

let socket: Socket;

interface User {
  name: string;
  age: string;
  church: string;
}

interface Message {
  hour: string;
  title: string;
  body: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState<User[]>([]);
  const [message, setMessage] = useState({ title: '', body: '' });
  const [userData, setUserData] = useState<User>({ name: '', age: '', church: '' });

  useEffect(() => {
    socket = io('https://oremosapp.fly.dev'); // URL de tu servidor de Socket.IO en Fly.io

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('newUser', { name: 'Anónimo', age: 'N/A', church: 'N/A' });
    });

    socket.on('onlineUsers', ({ count, users }) => {
      setOnlineUsers(count);
      setUserList(users || []);
    });

    socket.on('newUser', ({ count, users }) => {
      setOnlineUsers(count);
      setUserList(users || []);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQxc0yhrKG5AFZlAf9z8I3ufr3zleyrN-F3bxui3MZuhnGIkQliKCVXXRSG5pnqn9xOao9TDDRgVrt5/pub?output=csv');
        const rows = response.data.split('\n').slice(1); // Remove header
        const messages: Message[] = rows.map((row: string) => {
          const [hour, title, body] = row.split(',').map(item => item.trim().replace(/"/g, ''));
          return { hour, title, body };
        });

        const currentTime = dayjs();
        const currentHour = currentTime.format('h A');

        console.log('Current Time:', currentHour);
        console.log('Messages:', messages);

        const currentMessage = messages.find((message: Message) => {
          const messageTime = dayjs(message.hour, 'h:mm A');
          return currentHour === messageTime.format('h A');
        });

        console.log('Current Message:', currentMessage);

        if (currentMessage) {
          setMessage({ title: currentMessage.title, body: currentMessage.body });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleJoin = ({ name, age, church }: User) => {
    if (socket) {
      socket.emit('newUser', {
        name: name.trim() || 'Anónimo',
        age: age.trim() || 'N/A',
        church: church.trim() || 'N/A'
      });
      setUserData({ name, age, church });
      setIsConnected(true);
    } else {
      console.error('Socket is not initialized');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-zinc-900 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Echeverria ora 24/7 🔥</h1>
      <div className="bg-zinc-800 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">{message.title}</h2>
        <p>{message.body}</p>
      </div>
      <div className="mb-4">
        <p>Hola, {userData.name || 'Anónimo'}</p>
      </div>
      <div className="bg-zinc-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">{onlineUsers} personas en línea</h3>
        <ul className="user-list">
          {userList.map((user, index) => (
            <li key={index} className="p-2 border-b border-zinc-700">
              <p>Nombre: {user.name}</p>
              <p>Edad: {user.age}</p>
              <p>Iglesia: {user.church}</p>
            </li>
          ))}
        </ul>
      </div>
      <FullScreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onJoin={handleJoin} />
    </div>
  );
}
