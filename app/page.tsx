"use client";

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState<User[]>([]);
  const [message, setMessage] = useState({ title: '', body: '' });
  const [userData, setUserData] = useState<User>({ name: '', age: '', church: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    socket = io(socketUrl);

    socket.on('connect', () => {
      // Connected to Socket.io server
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
        setIsLoading(true);
        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const response = await axios.get(sheetsUrl);
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        const messages: Message[] = parsedData.data.map((row: any) => ({
          hour: row.hora,
          title: row.titulo || row.titutlo, // Fallback por si hay typo en el CSV
          body: row.bajada
        }));

        const currentTime = dayjs();
        const currentHour = currentTime.format('h A');

        const currentMessage = messages.find((message: Message) => {
          const messageTime = dayjs(message.hour, 'h:mm A');
          return currentHour === messageTime.format('h A');
        });

        if (currentMessage) {
          setMessage({ title: currentMessage.title, body: currentMessage.body });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleJoin = ({ name, age, church }: { name: string; age: string; church: string }) => {
    if (socket) {
      socket.emit('newUser', {
        name: name.trim() || 'Anónimo',
        age: age.trim() || 'N/A',
        church: church.trim() || 'N/A'
      });
      setUserData({ name, age, church });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                Echeverria ora 24/7 
                <span role="img" aria-label="fire" className="text-2xl">🔥</span>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Current Prayer Motive */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-wide">Motivo de Oración Actual</CardTitle>
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                </>
              ) : (
                <>
                  <CardTitle className="text-3xl">{message.title}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {message.body}
                  </CardDescription>
                </>
              )}
            </CardHeader>
          </Card>

          {/* Online Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{onlineUsers} personas orando ahora</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userList.map((user, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.age} años • {user.church}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FullScreenModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoin={handleJoin}
      />
    </>
  );
}
