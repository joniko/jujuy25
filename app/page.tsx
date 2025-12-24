"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import Papa from 'papaparse';
import { fetchWithOfflineFallback, isOnline } from '@/lib/offline-cache';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Share2, ChevronRight, Clock, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import MediaDisplay from '../components/MediaDisplay';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

interface Message {
  day: string;
  hour: string;
  title: string;
  body: string;
  responsible: string;
  media: string;
}

export default function Home() {
  const router = useRouter();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [nextMessage, setNextMessage] = useState<Message | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [hasStarted, setHasStarted] = useState(true);
  const messagesRef = useRef<Message[]>([]);

  // Fecha de inicio del programa: Viernes 26 de diciembre 2025 a las 5:00 AM
  const PROGRAM_START_DATE = dayjs('2025-12-26 05:00', 'YYYY-MM-DD HH:mm');

  useEffect(() => {
    const fetchMessages = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        
        // Usar cache offline si no hay conexión, o intentar fetch y cachear si hay conexión
        let csvData: string;
        const online = isOnline();
        
        if (online) {
          // Si hay conexión, intentar fetch con cache buster
          const cacheBuster = `&t=${Date.now()}`;
          try {
            csvData = await fetchWithOfflineFallback(sheetsUrl + cacheBuster);
          } catch (error) {
            // Si falla, intentar sin cache buster (usar cache)
            csvData = await fetchWithOfflineFallback(sheetsUrl);
          }
        } else {
          // Sin conexión, usar cache directamente
          csvData = await fetchWithOfflineFallback(sheetsUrl);
        }
        
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        const messages: Message[] = (parsedData.data as Array<{ 
          dia?: string;
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
            day: row.dia || '',
            hour: row.hora,
            title: row.titulo || row.titutlo || '',
            body: row.bajada,
            responsible: row.responsable || '',
            media: row['Video o imagen'] || row['video/imagen'] || row.media || ''
          };
        });

        const hasChanges = JSON.stringify(messages) !== JSON.stringify(messagesRef.current);
        
        if (hasChanges) {
          messagesRef.current = messages;
          setAllMessages(messages);
        }

        // Verificar si el programa ya comenzó
        const now = dayjs();
        const programHasStarted = now.isAfter(PROGRAM_START_DATE) || now.isSame(PROGRAM_START_DATE);
        
        // Mapeo de días
        const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const dayMap: Record<string, string> = {
          'viernes': 'viernes',
          'sábado': 'sábado',
          'domingo': 'domingo',
          'friday': 'viernes',
          'saturday': 'sábado',
          'sunday': 'domingo'
        };
        
        // Filtrar mensajes según el día actual si el programa ya comenzó
        let relevantMessages = messages;
        if (programHasStarted) {
          const currentDayName = dayNames[now.day()].toLowerCase();
          const currentDayIndex = now.day();
          
          // Determinar qué días son relevantes (día actual y siguientes días del programa)
          const programDays = ['viernes', 'sábado', 'domingo'];
          const currentDayIndexInProgram = programDays.indexOf(currentDayName);
          
          if (currentDayIndexInProgram >= 0) {
            // Estamos en un día del programa, mostrar solo eventos de hoy en adelante
            relevantMessages = messages.filter((message: Message) => {
              if (!message.day) return true; // Si no tiene día, incluirlo
              
              const messageDay = dayMap[message.day.toLowerCase()];
              if (!messageDay) return true;
              
              const messageDayIndex = programDays.indexOf(messageDay);
              if (messageDayIndex === -1) return false; // No es un día del programa
              
              // Incluir si es el día actual o un día futuro del programa
              return messageDayIndex >= currentDayIndexInProgram;
            });
          } else {
            // No estamos en un día del programa, no mostrar eventos actuales
            relevantMessages = [];
          }
        } else {
          // El programa no ha comenzado, mostrar solo eventos del viernes
          relevantMessages = messages.filter((message: Message) => {
            if (!message.day) return true; // Si no tiene día, incluirlo
            const messageDay = dayMap[message.day.toLowerCase()];
            return messageDay === 'viernes';
          });
        }
        
        // Ordenar mensajes por día y hora
        const sortedMessages = [...relevantMessages].sort((a, b) => {
          // Primero ordenar por día
          const dayOrder = ['viernes', 'sábado', 'domingo'];
          const dayA = a.day ? (dayMap[a.day.toLowerCase()] || '') : '';
          const dayB = b.day ? (dayMap[b.day.toLowerCase()] || '') : '';
          const dayIndexA = dayOrder.indexOf(dayA);
          const dayIndexB = dayOrder.indexOf(dayB);
          
          if (dayIndexA !== dayIndexB) {
            if (dayIndexA === -1) return 1;
            if (dayIndexB === -1) return -1;
            return dayIndexA - dayIndexB;
          }
          
          // Si es el mismo día, ordenar por hora
          const cleanHourA = a.hour
            .replace(/\s+/g, ' ')
            .replace('a. m.', 'AM')
            .replace('p. m.', 'PM')
            .replace('a.m.', 'AM')
            .replace('p.m.', 'PM')
            .trim();
          
          const cleanHourB = b.hour
            .replace(/\s+/g, ' ')
            .replace('a. m.', 'AM')
            .replace('p. m.', 'PM')
            .replace('a.m.', 'AM')
            .replace('p.m.', 'PM')
            .trim();
          
          const timeA = dayjs(cleanHourA, 'h:mm A');
          const timeB = dayjs(cleanHourB, 'h:mm A');
          
          return timeA.valueOf() - timeB.valueOf();
        });

        // Encontrar mensaje actual (solo si el programa ya comenzó)
        let current: Message | null = null;
        if (programHasStarted && sortedMessages.length > 0) {
          const currentDayName = dayNames[now.day()].toLowerCase();
          const currentHour = now.format('h A');
          
          current = sortedMessages.find((message: Message) => {
            // Verificar que sea del día actual
            if (message.day) {
              const messageDay = dayMap[message.day.toLowerCase()];
              if (messageDay && messageDay !== currentDayName) {
                return false;
              }
            }
            
            const cleanHour = message.hour
              .replace(/\s+/g, ' ')
              .replace('a. m.', 'AM')
              .replace('p. m.', 'PM')
              .replace('a.m.', 'AM')
              .replace('p.m.', 'PM')
              .trim();
            
            const messageTime = dayjs(cleanHour, 'h:mm A');
            return currentHour === messageTime.format('h A');
          }) || null;
        }

        // Encontrar próximo mensaje
        let next: Message | null = null;
        if (programHasStarted && sortedMessages.length > 0) {
          if (current) {
            const currentIndex = sortedMessages.indexOf(current);
            // Buscar el siguiente mensaje del mismo día o del día siguiente
            next = sortedMessages.slice(currentIndex + 1).find((message: Message) => {
              if (current.day && message.day) {
                return message.day === current.day;
              }
              return true;
            }) || sortedMessages[currentIndex + 1] || null;
            
            // Si no hay siguiente en el mismo día, buscar en el siguiente día del programa
            if (!next && current.day) {
              const programDays = ['viernes', 'sábado', 'domingo'];
              const currentDayIndex = programDays.indexOf(dayMap[current.day.toLowerCase()] || '');
              if (currentDayIndex >= 0 && currentDayIndex < programDays.length - 1) {
                const nextProgramDay = programDays[currentDayIndex + 1];
                next = sortedMessages.find((message: Message) => {
                  if (!message.day) return false;
                  return dayMap[message.day.toLowerCase()] === nextProgramDay;
                }) || null;
              }
            }
          } else {
            // No hay mensaje actual, encontrar el próximo del día actual o siguiente
            const currentDayName = dayNames[now.day()].toLowerCase();
            next = sortedMessages.find((message: Message) => {
              if (message.day) {
                const messageDay = dayMap[message.day.toLowerCase()];
                if (!messageDay) return false;
                
                // Si es del día actual, verificar que la hora sea futura
                if (messageDay === currentDayName) {
                  const cleanHour = message.hour
                    .replace(/\s+/g, ' ')
                    .replace('a. m.', 'AM')
                    .replace('p. m.', 'PM')
                    .replace('a.m.', 'AM')
                    .replace('p.m.', 'PM')
                    .trim();
                  
                  const messageTime = dayjs(cleanHour, 'h:mm A');
                  const messageDateTime = now.hour(messageTime.hour()).minute(messageTime.minute());
                  return messageDateTime.isAfter(now);
                }
                
                // Si es de un día futuro del programa, incluirlo
                const programDays = ['viernes', 'sábado', 'domingo'];
                const currentDayIndex = programDays.indexOf(currentDayName);
                const messageDayIndex = programDays.indexOf(messageDay);
                if (currentDayIndex >= 0 && messageDayIndex > currentDayIndex) {
                  return true;
                }
                
                return false;
              }
              
              // Si no tiene día, verificar que la hora sea futura
              const cleanHour = message.hour
                .replace(/\s+/g, ' ')
                .replace('a. m.', 'AM')
                .replace('p. m.', 'PM')
                .replace('a.m.', 'AM')
                .replace('p.m.', 'PM')
                .trim();
              
              const messageTime = dayjs(cleanHour, 'h:mm A');
              const messageDateTime = now.hour(messageTime.hour()).minute(messageTime.minute());
              return messageDateTime.isAfter(now);
            }) || sortedMessages[0] || null;
          }
        } else if (!programHasStarted && sortedMessages.length > 0) {
          // El programa no ha comenzado, mostrar el primer evento del viernes
          next = sortedMessages[0] || null;
        }

        setCurrentMessage(current || null);
        setNextMessage(next);
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

  // Countdown effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      const hasStarted = now.isAfter(PROGRAM_START_DATE) || now.isSame(PROGRAM_START_DATE);
      setHasStarted(hasStarted);

      if (!hasStarted) {
        const diff = PROGRAM_START_DATE.diff(now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [PROGRAM_START_DATE]);

  const handleShare = async (message: Message) => {
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
        {/* Countdown si aún no comenzó */}
        {!hasStarted && countdown && (
          <Card className="bg-primary/10 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                El programa comienza en:
              </CardTitle>
              <div className="flex items-center gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{countdown.days}</div>
                  <div className="text-xs text-muted-foreground uppercase">Días</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{countdown.hours}</div>
                  <div className="text-xs text-muted-foreground uppercase">Horas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{countdown.minutes}</div>
                  <div className="text-xs text-muted-foreground uppercase">Minutos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{countdown.seconds}</div>
                  <div className="text-xs text-muted-foreground uppercase">Segundos</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Lo que está pasando ahora */}
        {currentMessage && (
          <Card 
            className="bg-primary/5 border-primary cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/cronograma')}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <CardTitle className="text-sm font-bold uppercase text-primary tracking-wide">Ahora</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
              {isInitialLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {currentMessage.hour}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl md:leading-tight">{currentMessage.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {currentMessage.body}
                    </CardDescription>
                  </div>

                  {currentMessage.media && (
                    <CardContent onClick={(e) => e.stopPropagation()} className="p-0">
                      <MediaDisplay media={currentMessage.media} title={currentMessage.title} />
                    </CardContent>
                  )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(currentMessage);
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
        )}

        {/* Lo que viene */}
        {nextMessage && (
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/cronograma')}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-wide">Próximo</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              {isInitialLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {nextMessage.hour}
                    </div>
                    <CardTitle className="text-xl md:text-2xl">{nextMessage.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground line-clamp-2">
                      {nextMessage.body}
                    </CardDescription>
                  </div>
                </>
              )}
            </CardHeader>
          </Card>
        )}

        {/* Ver programa completo */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-dashed"
          onClick={() => router.push('/cronograma')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Ver Programa Completo</CardTitle>
                  <CardDescription>Ver todos los motivos de oración del día</CardDescription>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>

        {/* Links rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/cronograma')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-lg">Programa</CardTitle>
                  <CardDescription>Cronograma completo</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/participantes')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-lg">Participantes</CardTitle>
                  <CardDescription>Lista de participantes</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/destinos')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-lg">Destinos</CardTitle>
                  <CardDescription>Lugares y direcciones</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
