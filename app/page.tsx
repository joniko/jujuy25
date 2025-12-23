"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Share2, ChevronRight } from 'lucide-react';
import MediaDisplay from '../components/MediaDisplay';

dayjs.extend(customParseFormat);

interface Message {
  hour: string;
  title: string;
  body: string;
  responsible: string;
  media: string;
}

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState({ title: '', body: '', media: '', responsible: '' });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messageRef = useRef({ title: '', body: '', media: '', responsible: '' });

  useEffect(() => {
    const fetchMessages = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const cacheBuster = `&t=${Date.now()}`;
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
          return {
            hour: row.hora,
            title: row.titulo || row.titutlo || '',
            body: row.bajada,
            responsible: row.responsable || '',
            media: row['Video o imagen'] || row['video/imagen'] || row.media || ''
          };
        });

        const currentTime = dayjs();
        const currentHour = currentTime.format('h A');

        const currentMessage = messages.find((message: Message) => {
          const cleanHour = message.hour
            .replace(/\s+/g, ' ')
            .replace('a. m.', 'AM')
            .replace('p. m.', 'PM')
            .replace('a.m.', 'AM')
            .replace('p.m.', 'PM')
            .trim();
          
          const messageTime = dayjs(cleanHour, 'h:mm A');
          return currentHour === messageTime.format('h A');
        });

        if (currentMessage) {
          const newMessage = {
            title: currentMessage.title,
            body: currentMessage.body,
            media: currentMessage.media,
            responsible: currentMessage.responsible
          };

          const hasChanges = JSON.stringify(newMessage) !== JSON.stringify(messageRef.current);
          
          if (hasChanges) {
            messageRef.current = newMessage;
            setMessage(newMessage);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchMessages(true);
    
    const refreshInterval = setInterval(() => {
      fetchMessages(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const handleShare = async () => {
    const currentHour = new Date().getHours();
    
    if (!navigator.share) {
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
        title: `Oremos - ${message.title}`,
        text: `🙏 ${message.title}\n\n${message.body}\n\nÚnete a orar con nosotros:`,
        url: 'https://oremos.app'
      };

      if (navigator.canShare) {
        try {
          const ogImageUrl = `/api/og?title=${encodeURIComponent(message.title)}&body=${encodeURIComponent(message.body)}&hour=${currentHour}`;
          const response = await fetch(ogImageUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'oremos-motivo.png', { type: 'image/png' });
            
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

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
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
      </div>
    </main>
  );
}
