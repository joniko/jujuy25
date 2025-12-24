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
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import MediaDisplay from '../../components/MediaDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

dayjs.extend(customParseFormat);

interface PrayerScheduleItem {
  day: string;
  hour: string;
  title: string;
  body: string;
  responsible: string;
  media: string;
}

export default function CronogramaPage() {
  const router = useRouter();
  const [scheduleItems, setScheduleItems] = useState<PrayerScheduleItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState('');
  const scheduleItemsRef = useRef<PrayerScheduleItem[]>([]);

  useEffect(() => {
    const fetchSchedule = async (isInitial = false) => {
      try {
        // Solo mostrar loading en el fetch inicial
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        // Agregar timestamp para evitar cache del navegador
        const cacheBuster = `&t=${Date.now()}`;
        const response = await axios.get(sheetsUrl + cacheBuster, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        const items: PrayerScheduleItem[] = (parsedData.data as Array<{
          dia?: string;
          hora: string;
          titulo?: string;
          titutlo?: string;
          bajada: string;
          responsable?: string;
          'Video o imagen'?: string;
          'video/imagen'?: string;
          media?: string;
        }>).map((row) => ({
          day: row.dia || '',
          hour: row.hora,
          title: row.titulo || row.titutlo || '',
          body: row.bajada,
          responsible: row.responsable || '',
          media: row['Video o imagen'] || row['video/imagen'] || row.media || ''
        }));

        // Comparar datos para detectar cambios
        const hasChanges = JSON.stringify(items) !== JSON.stringify(scheduleItemsRef.current);
        
        if (hasChanges) {
          if (!isInitial) {
            console.log('✅ Cambios detectados en el cronograma - Actualizando');
          }
          scheduleItemsRef.current = items;
          setScheduleItems(items);
        } else if (!isInitial) {
          console.log('ℹ️ Sin cambios en el cronograma');
        }

        // Set current hour for highlighting
        const now = dayjs();
        const formattedHour = now.format('h A');
        setCurrentHour(formattedHour);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    // Fetch inicial
    fetchSchedule(true);
    
    // Auto-refresh cada 30 segundos
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en cronograma...');
      fetchSchedule(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCurrentHour = (hour: string, day?: string): boolean => {
    if (!hour || !currentHour) return false;
    
    // Si hay día, verificar que coincida con el día actual
    if (day) {
      const today = dayjs();
      const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const currentDayName = dayNames[today.day()].toLowerCase();
      const dayLower = day.toLowerCase();
      
      // Mapear nombres de días
      const dayMap: Record<string, string> = {
        'viernes': 'viernes',
        'sábado': 'sábado',
        'domingo': 'domingo',
        'friday': 'viernes',
        'saturday': 'sábado',
        'sunday': 'domingo'
      };
      
      if (dayMap[dayLower] && dayMap[dayLower] !== currentDayName) {
        return false;
      }
    }
    
    // Limpiar el formato del CSV: "1:00 a. m." -> "1:00 AM"
    const cleanHour = hour
      .replace(/\s+/g, ' ')  // Normalizar espacios
      .replace('a. m.', 'AM')
      .replace('p. m.', 'PM')
      .replace('a.m.', 'AM')
      .replace('p.m.', 'PM')
      .trim();
    
    const itemTime = dayjs(cleanHour, 'h:mm A');
    return currentHour === itemTime.format('h A');
  };

  // Agrupar por día
  const itemsPorDia = scheduleItems.reduce((acc, item) => {
    const dia = item.day || 'Sin día';
    if (!acc[dia]) {
      acc[dia] = [];
    }
    acc[dia].push(item);
    return acc;
  }, {} as Record<string, PrayerScheduleItem[]>);

  // Ordenar días
  const ordenDias = ['Viernes', 'Sábado', 'Domingo'];
  const diasOrdenados = Object.keys(itemsPorDia).sort((a, b) => {
    const indexA = ordenDias.indexOf(a);
    const indexB = ordenDias.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/')}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cronograma de Oración</h1>
          </div>
        </div>

        {/* Loading State */}
        {isInitialLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : diasOrdenados.length > 0 ? (
          /* Schedule Items con Tabs por Día */
          <Tabs defaultValue={diasOrdenados[0] || 'Viernes'} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {diasOrdenados.map((dia) => (
                <TabsTrigger key={dia} value={dia} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {dia}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {diasOrdenados.map((dia) => (
              <TabsContent key={dia} value={dia} className="space-y-4 mt-6">
                {itemsPorDia[dia].map((item, index) => {
                  const isCurrent = isCurrentHour(item.hour, item.day);
                  
                  return (
                    <Card
                      key={index}
                      className={`${
                        isCurrent
                          ? 'bg-primary/5 border-primary shadow-lg'
                          : 'hover:shadow-md'
                      } transition-shadow`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                <Clock className="w-4 h-4" />
                                {item.hour}
                              </div>
                            {item.responsible && (
                              <div className="flex items-center gap-1 text-sm font-semibold uppercase text-muted-foreground">
                                <User className="w-4 h-4" />
                                {item.responsible}
                              </div>
                            )}
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                  Ahora
                                </span>
                              )}
                            </div>
                            
                            <CardTitle className="text-xl md:text-2xl">
                              {item.title}
                            </CardTitle>
                            
                            <CardDescription className="text-base">
                              {item.body}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {/* Media del item */}
                      {item.media && (
                        <CardContent className="p-0">
                          <MediaDisplay media={item.media} title={item.title} />
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          /* Sin tabs - mostrar todo si no hay días */
          <div className="space-y-4">
            {scheduleItems.map((item, index) => {
              const isCurrent = isCurrentHour(item.hour, item.day);
              
              return (
                <Card
                  key={index}
                  className={`${
                    isCurrent
                      ? 'bg-primary/5 border-primary shadow-lg'
                      : 'hover:shadow-md'
                  } transition-shadow`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <Clock className="w-4 h-4" />
                            {item.hour}
                          </div>
                        {item.responsible && (
                          <div className="flex items-center gap-1 text-sm font-semibold uppercase text-muted-foreground">
                            <User className="w-4 h-4" />
                            {item.responsible}
                          </div>
                        )}
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                              Ahora
                            </span>
                          )}
                        </div>
                        
                        <CardTitle className="text-xl md:text-2xl">
                          {item.title}
                        </CardTitle>
                        
                        <CardDescription className="text-base">
                          {item.body}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Media del item */}
                  {item.media && (
                    <CardContent className="p-0">
                      <MediaDisplay media={item.media} title={item.title} />
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isInitialLoading && scheduleItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No hay datos de cronograma disponibles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

