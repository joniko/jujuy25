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
import { Share2, ChevronRight, Clock, Calendar, Users, MapPin, ArrowRight, Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Eye } from 'lucide-react';
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

// Fecha de inicio del programa: Viernes 26 de diciembre 2025 a las 5:00 AM
// Mover fuera del componente para evitar recreación en cada render
const PROGRAM_START_DATE = dayjs('2025-12-26 05:00', 'YYYY-MM-DD HH:mm');

// Configuración de tema del clima basado en el código
const getWeatherTheme = (weatherCode: string) => {
  const code = parseInt(weatherCode);
  
  // Soleado / Despejado
  if (code === 113) return { 
    icon: Sun, 
    gradient: "from-orange-400/20 via-amber-200/10 to-background", 
    borderColor: "border-orange-200/50",
    iconColor: "text-orange-500",
    textColor: "text-orange-700"
  };
  
  // Nublado
  if (code >= 116 && code <= 122) return {
    icon: Cloud,
    gradient: "from-blue-400/10 via-slate-400/5 to-background",
    borderColor: "border-slate-300/50",
    iconColor: "text-slate-500",
    textColor: "text-slate-700"
  };

  // Lluvia / Drizzle
  if ((code >= 176 && code <= 185) || (code >= 263 && code <= 308) || (code >= 350 && code <= 377)) return {
    icon: CloudRain,
    gradient: "from-blue-400/20 via-cyan-200/10 to-background",
    borderColor: "border-blue-200/50",
    iconColor: "text-blue-500",
    textColor: "text-blue-700"
  };

  // Tormenta
  if ((code >= 200 && code <= 202) || (code >= 386 && code <= 395)) return {
    icon: CloudLightning,
    gradient: "from-purple-400/20 via-slate-400/10 to-background",
    borderColor: "border-purple-200/50",
    iconColor: "text-purple-500",
    textColor: "text-purple-700"
  };

  // Nieve
  if ((code >= 227 && code <= 230) || (code >= 323 && code <= 338)) return {
    icon: CloudSnow,
    gradient: "from-slate-100/50 via-blue-50/20 to-background",
    borderColor: "border-slate-200/50",
    iconColor: "text-slate-400",
    textColor: "text-slate-600"
  };

  // Niebla
  if (code === 143 || code === 248 || code === 260) return {
    icon: Eye,
    gradient: "from-gray-300/20 via-gray-100/10 to-background",
    borderColor: "border-gray-200/50",
    iconColor: "text-gray-500",
    textColor: "text-gray-700"
  };
  
  return {
    icon: Cloud,
    gradient: "from-primary/5 via-primary/2 to-background",
    borderColor: "border-primary/10",
    iconColor: "text-primary/60",
    textColor: "text-primary"
  };
};

const CountdownBox = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-3 min-w-[80px] border border-primary/10 shadow-sm">
    <span className="text-3xl font-bold font-mono tracking-tighter text-primary">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mt-1">
      {label}
    </span>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [nextMessage, setNextMessage] = useState<Message | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [hasStarted, setHasStarted] = useState(true);
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const messagesRef = useRef<Message[]>([]);

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
  }, []);

  // Weather effect
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoadingWeather(true);
        // Usar wttr.in API gratuita
        const response = await fetch('https://wttr.in/San+Salvador+de+Jujuy?format=j1&lang=es', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          const current = data.current_condition[0];
          
          setWeather({
            temp: parseInt(current.temp_C),
            condition: current.lang_es?.[0]?.value || current.weatherDesc[0]?.value || 'Despejado',
            humidity: parseInt(current.humidity),
            windSpeed: parseInt(current.windspeedKmph),
            icon: current.weatherCode,
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
    // Actualizar cada 30 minutos
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(weatherInterval);
  }, []);

  const handleShare = async (message: Message) => {
    const currentHour = new Date().getHours();
    
    if (!navigator.share) {
      const shareText = `🙏 Únete a orar con nosotros\n\n${message.title}\n${message.body}\n\n👉 https://ejovs.com`;
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
        title: `Viaje Misionero: Jujuy 25 - ${message.title}`,
        text: `🙏 ${message.title}\n\n${message.body}\n\nÚnete a orar con nosotros:`,
        url: 'https://ejovs.com'
      };

      if (navigator.canShare) {
        try {
          const ogImageUrl = `/api/og?title=${encodeURIComponent(message.title)}&body=${encodeURIComponent(message.body)}&hour=${currentHour}`;
          const response = await fetch(ogImageUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'jujuy25-motivo.png', { type: 'image/png' });
            
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
        {/* Clima de San Salvador de Jujuy */}
        {isLoadingWeather ? (
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden text-left shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3 w-3 mr-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <Skeleton className="h-12 w-20" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-foreground/5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-10" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-10" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : weather && (
          <Card className={`bg-gradient-to-br ${getWeatherTheme(weather.icon).gradient} ${getWeatherTheme(weather.icon).borderColor} overflow-hidden transition-all duration-500 shadow-md text-left`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 opacity-70">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Jujuy, Argentina</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-foreground">{weather.temp}°</span>
                    <span className="text-xl font-bold opacity-40">C</span>
                  </div>
                  <p className="text-sm font-medium capitalize opacity-80">{weather.condition}</p>
                </div>
                <div className="bg-background/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm">
                  {(() => {
                    const theme = getWeatherTheme(weather.icon);
                    const WeatherIcon = theme.icon;
                    return <WeatherIcon className={`w-8 h-8 ${theme.iconColor}`} />;
                  })()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-foreground/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-background/30">
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold opacity-50">Humedad</span>
                    <span className="text-sm font-bold">{weather.humidity}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-background/30">
                    <Wind className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold opacity-50">Viento</span>
                    <span className="text-sm font-bold">{weather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 rounded-xl"></div>
          </Card>
        )}

        {/* Countdown si aún no comenzó */}
        {(!hasStarted || isInitialLoading) && (
          <Card className="bg-primary/20 border-none shadow-md overflow-hidden relative text-left">
            {/* Círculos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
            
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-[0.2em]">
                <Clock className="w-4 h-4" />
                Falta para el inicio del viaje misionero:
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-2 pb-6">
              {isInitialLoading ? (
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-[76px] w-[80px] rounded-2xl" />
                  <Skeleton className="h-[76px] w-[80px] rounded-2xl" />
                  <Skeleton className="h-[76px] w-[80px] rounded-2xl" />
                  <Skeleton className="h-[76px] w-[80px] rounded-2xl" />
                </div>
              ) : countdown && (
                <div className="flex items-center justify-between gap-2">
                  <CountdownBox value={countdown.days} label="Días" />
                  <CountdownBox value={countdown.hours} label="Horas" />
                  <CountdownBox value={countdown.minutes} label="Minutos" />
                  <CountdownBox value={countdown.seconds} label="Segundos" />
                </div>
              )}
            </CardContent>
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-xl"></div>
          </Card>
        )}

        {/* Lo que está pasando ahora */}
        {(currentMessage || (isInitialLoading && hasStarted)) && (
          <Card 
            className="border-primary/20 cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-b from-primary/[0.03] to-transparent"
            onClick={() => !isInitialLoading && router.push('/cronograma')}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </div>
                  <CardTitle className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">En este momento</CardTitle>
                </div>
                {!isInitialLoading && (
                  <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>

              {isInitialLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-5/6" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <Skeleton className="h-9 w-32 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ) : currentMessage && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60">
                      <Clock className="w-3.5 h-3.5" />
                      {currentMessage.hour}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-foreground">
                      {currentMessage.title}
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                      {currentMessage.body}
                    </CardDescription>
                  </div>

                  {currentMessage.media && (
                    <div onClick={(e) => e.stopPropagation()} className="mt-4 rounded-2xl overflow-hidden border border-foreground/5 shadow-inner">
                      <MediaDisplay media={currentMessage.media} title={currentMessage.title} />
                    </div>
                  )}
                  
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(currentMessage);
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold px-6"
                    >
                      <Share2 className="w-3.5 h-3.5 mr-2" />
                      Compartir
                    </Button>
                    
                    {currentMessage.responsible && (
                      <div className="flex items-center gap-2 opacity-60">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{currentMessage.responsible}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardHeader>
          </Card>
        )}

        {/* Lo que viene */}
        {(nextMessage || (isInitialLoading && hasStarted)) && (
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-300 border-foreground/5 bg-muted/30 group"
            onClick={() => !isInitialLoading && router.push('/cronograma')}
          >
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-foreground/5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Próximo evento</CardTitle>
                </div>
                {!isInitialLoading && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                )}
              </div>

              {isInitialLoading ? (
                <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="pb-1">
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </div>
              ) : nextMessage && (
                <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/50">
                      <Clock className="w-3.5 h-3.5" />
                      {nextMessage.hour}
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-foreground/90">{nextMessage.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-1 italic">
                      {nextMessage.body}
                    </CardDescription>
                  </div>
                  <div className="pb-1">
                    <div className="bg-foreground/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {nextMessage.hour.split(' ')[1] || '---'}
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        )}

      </div>
    </main>
  );
}
