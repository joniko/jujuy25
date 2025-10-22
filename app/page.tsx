"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Share2, ChevronRight } from 'lucide-react';
import FullScreenModal from '../components/FullScreenModal';
import YouTubePlayer from '../components/YouTubePlayer';
import MediaDisplay from '../components/MediaDisplay';

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
  responsible: string;
  media: string;
}

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState<User[]>([]);
  const [message, setMessage] = useState({ title: '', body: '', media: '', responsible: '' });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    const fetchMessages = async (isInitial = false) => {
      try {
        // Solo mostrar loading en el fetch inicial
        if (isInitial) {
          setIsInitialLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        // Agregar timestamp para evitar cache del navegador
        const cacheBuster = `?t=${Date.now()}`;
        const response = await axios.get(sheetsUrl + cacheBuster, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        const messages: Message[] = (parsedData.data as Array<{ 
          hora: string; 
          titulo?: string; 
          titutlo?: string; 
          bajada: string; 
          responsable?: string; 
          'Video o imagen'?: string;
          'video/imagen'?: string;
          media?: string;
        }>).map((row) => {
          if (isInitial) {
            console.log('📋 CSV Row:', row);
            console.log('🔍 Available keys:', Object.keys(row));
          }
          
          return {
            hour: row.hora,
            title: row.titulo || row.titutlo || '', // Fallback por si hay typo en el CSV
            body: row.bajada,
            responsible: row.responsable || '',
            media: row['Video o imagen'] || row['video/imagen'] || row.media || ''
          };
        });

        const currentTime = dayjs();
        const currentHour = currentTime.format('h A');

        const currentMessage = messages.find((message: Message) => {
          const messageTime = dayjs(message.hour, 'h:mm A');
          return currentHour === messageTime.format('h A');
        });

        if (currentMessage) {
          // Crear objeto nuevo para comparar
          const newMessage = {
            title: currentMessage.title,
            body: currentMessage.body,
            media: currentMessage.media,
            responsible: currentMessage.responsible
          };

          // Solo actualizar si hay cambios
          const hasChanges = JSON.stringify(newMessage) !== JSON.stringify(message);
          
          if (hasChanges) {
            console.log('✅ Cambios detectados en el Excel - Actualizando motivo de oración');
            setMessage(newMessage);
          } else if (!isInitial) {
            console.log('ℹ️ Sin cambios detectados');
          }

          if (isInitial) {
            console.log('📊 Current Message Data:', currentMessage);
            console.log('🎬 Media URL:', currentMessage.media);
            console.log('👤 Responsible:', currentMessage.responsible);
            setMessage(newMessage);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    };

    // Fetch inicial
    fetchMessages(true);
    
    // Auto-refresh cada 30 segundos
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en Google Sheets...');
      fetchMessages(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [message]);

  const handleJoin = ({ name, age, church }: { name: string; age: string; church: string }) => {
    if (socket) {
      socket.emit('newUser', {
        name: name.trim() || 'Anónimo',
        age: age.trim() || 'N/A',
        church: church.trim() || 'N/A'
      });
      setIsModalOpen(false);
    }
  };

  const handleShare = async () => {
    const currentHour = new Date().getHours();
    
    // Verificar si el navegador soporta Web Share API
    if (!navigator.share) {
      // Fallback: copiar al clipboard
      const shareText = `🙏 Únete a orar con nosotros\n\n${message.title}\n${message.body}\n\n👉 https://oremos.app`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert('¡Texto copiado! Ahora puedes pegarlo donde quieras.');
      } catch (err) {
        console.error('Error al copiar:', err);
      }
      return;
    }

    try {
      const shareData: ShareData = {
        title: `Oremos 24/7 - ${message.title}`,
        text: `🙏 ${message.title}\n\n${message.body}\n\nÚnete a orar con nosotros:`,
        url: 'https://oremos.app'
      };

      // Intentar agregar imagen OG dinámica si el navegador lo soporta
      if (navigator.canShare) {
        try {
          // Generar URL de la imagen OG con el motivo actual
          const ogImageUrl = `/api/og?title=${encodeURIComponent(message.title)}&body=${encodeURIComponent(message.body)}&hour=${currentHour}`;
          const response = await fetch(ogImageUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'oremos-motivo.png', { type: 'image/png' });
            
            // Verificar si el navegador puede compartir archivos
            const dataWithFile = { ...shareData, files: [file] };
            if (navigator.canShare(dataWithFile)) {
              await navigator.share(dataWithFile);
              return;
            }
          }
        } catch {
          console.log('No se pudo cargar la imagen OG, compartiendo sin ella');
        }
      }

      // Compartir sin imagen si no se pudo agregar
      await navigator.share(shareData);
    } catch (err) {
      // Usuario canceló o error
      if ((err as Error).name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">

          {/* Current Prayer Motive */}
          <Card 
            className="bg-primary/5 border-primary cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/cronograma')}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <CardTitle className="text-sm font-bold uppercase text-primary tracking-wide">Motivo de Oración</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
              {isInitialLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <CardTitle className="text-2xl md:text-3xl md:leading-tight">{message.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {message.body}
                    </CardDescription>
                  </div>

                   {/* Media del motivo actual */}
                   {!isInitialLoading && message.media && (
                     <CardContent onClick={(e) => e.stopPropagation()} className="p-0">
                       <MediaDisplay media={message.media} title={message.title} />
                     </CardContent>
                   )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    variant="outline"
                    className="w-full sm:w-auto border-primary/20 hover:bg-primary/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </>
              )}
            </CardHeader>
            
          </Card>
          
          {/* YouTube Music Player - Solo se muestra después de unirse */}
          {!isModalOpen && <YouTubePlayer autoplay={true} />}

          {/* Online Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>
                  {onlineUsers} {onlineUsers === 1 ? 'persona' : 'personas'} orando ahora
                </span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userList.map((user, index) => (
                  <div key={index} className="flex items-center space-x-4 py-2 rounded-lg hover:bg-muted/50 transition-colors">
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
