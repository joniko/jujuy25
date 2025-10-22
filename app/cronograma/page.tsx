"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User } from 'lucide-react';
import MediaDisplay from '../../components/MediaDisplay';

dayjs.extend(customParseFormat);

interface PrayerScheduleItem {
  hour: string;
  title: string;
  body: string;
  responsible: string;
  media: string;
}

export default function CronogramaPage() {
  const router = useRouter();
  const [scheduleItems, setScheduleItems] = useState<PrayerScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const response = await axios.get(sheetsUrl);
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        const items: PrayerScheduleItem[] = (parsedData.data as Array<{
          hora: string;
          titulo?: string;
          titutlo?: string;
          bajada: string;
          responsable?: string;
          'video/imagen'?: string;
          media?: string;
        }>).map((row) => ({
          hour: row.hora,
          title: row.titulo || row.titutlo || '',
          body: row.bajada,
          responsible: row.responsable || '',
          media: row['video/imagen'] || row.media || ''
        }));

        setScheduleItems(items);

        // Set current hour for highlighting
        const now = dayjs();
        const formattedHour = now.format('h A');
        setCurrentHour(formattedHour);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const isCurrentHour = (hour: string): boolean => {
    if (!hour || !currentHour) return false;
    const itemTime = dayjs(hour, 'h:mm A');
    return currentHour === itemTime.format('h A');
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold">Cronograma de Oración</h1>
            <p className="text-muted-foreground">Cadena de oración 24/7</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
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
        ) : (
          /* Schedule Items */
          <div className="space-y-4">
            {scheduleItems.map((item, index) => {
              const isCurrent = isCurrentHour(item.hour);
              
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
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Clock className="w-4 h-4" />
                            {item.hour}
                          </div>
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

                        {item.responsible && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Responsable:</span>
                            <span>{item.responsible}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {item.media && (
                    <CardContent>
                      <MediaDisplay media={item.media} title={item.title} />
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && scheduleItems.length === 0 && (
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

