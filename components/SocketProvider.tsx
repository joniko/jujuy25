"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface User {
  id?: string;
  name: string;
  age: string;
  church: string;
  attendance?: 'online' | 'presencial';
  comment?: string;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: number;
  userList: User[];
  mySocketId: string;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: 0,
  userList: [],
  mySocketId: '',
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState<User[]>([]);
  const [mySocketId, setMySocketId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    const newSocket = io(socketUrl);
    
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setMySocketId(newSocket.id || '');
      setIsConnected(true);
      console.log('Connected with socket ID:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket');
    });

    newSocket.on('onlineUsers', ({ count, users }) => {
      setOnlineUsers(count);
      setUserList(users || []);
    });

    newSocket.on('newUser', ({ count, users }) => {
      setOnlineUsers(count);
      setUserList(users || []);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, userList, mySocketId, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

