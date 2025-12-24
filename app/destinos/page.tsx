"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';
import { fetchWithOfflineFallback, isOnline } from '@/lib/offline-cache';

interface Location {
  nombre: string;
  direccion: string;
  link: string;
}

export default function DestinosPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locationsRef = useRef<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
          setError(null);
        }

        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const locationsGid = process.env.NEXT_PUBLIC_SHEETS_LOCATIONS_GID || '';
        
        console.log('🔍 Debug - Base URL:', baseUrl);
        console.log('🔍 Debug - Locations GID:', locationsGid);
        
        if (!baseUrl) {
          const errorMsg = 'No hay URL de Google Sheets configurada. Verifica NEXT_PUBLIC_SHEETS_URL en .env.local';
          console.error('❌', errorMsg);
          setError(errorMsg);
          if (isInitial) {
            setIsInitialLoading(false);
          }
          return;
        }
        
        if (!locationsGid) {
          const errorMsg = 'No hay GID de ubicaciones configurado. Verifica NEXT_PUBLIC_SHEETS_LOCATIONS_GID en .env.local';
          console.error('❌', errorMsg);
          setError(errorMsg);
          if (isInitial) {
            setIsInitialLoading(false);
          }
          return;
        }
        
        setError(null);

        let sheetsUrl = baseUrl;
        if (baseUrl.includes('gid=')) {
          sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${locationsGid}`);
        } else {
          sheetsUrl = baseUrl.replace('output=csv', `gid=${locationsGid}&single=true&output=csv`);
        }

        console.log('🔍 Debug - Final Sheets URL:', sheetsUrl);

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
        
        console.log('📄 CSV Data length:', csvData?.length || 0);
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        console.log('📊 Parsed data rows:', parsedData.data.length);
        console.log('📊 First row sample:', parsedData.data[0]);
        console.log('📊 Available columns:', parsedData.meta?.fields || 'No fields detected');

        // Función helper para obtener valor de columna con diferentes variantes
        const getColumnValue = (row: any, possibleNames: string[]): string => {
          for (const name of possibleNames) {
            // Buscar exacto
            if (row[name]) return row[name];
            // Buscar case-insensitive
            const found = Object.keys(row).find(
              key => key.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (found) return row[found];
          }
          return '';
        };

        const locationsData: Location[] = (parsedData.data as Array<any>)
          .map((row) => {
            const nombre = getColumnValue(row, ['lugar', 'Lugar', 'LUGAR', 'nombre', 'Nombre', 'NOMBRE', 'name', 'Name']);
            const direccion = getColumnValue(row, ['dirección', 'Dirección', 'DIRECCIÓN', 'direccion', 'Direccion', 'DIRECCION', 'address', 'Address']);
            const link = getColumnValue(row, ['link', 'Link', 'LINK', 'url', 'Url', 'URL', 'maps', 'Maps', 'google maps', 'Google Maps']);
            
            return {
              nombre: nombre || '',
              direccion: direccion || '',
              link: link || ''
            };
          })
          .filter((location) => location.nombre && location.nombre.trim() !== '');

        console.log('✅ Processed locations:', locationsData.length);
        console.log('✅ First location:', locationsData[0]);

        // Comparar datos para detectar cambios
        const hasChanges = JSON.stringify(locationsData) !== JSON.stringify(locationsRef.current);
        
        if (hasChanges) {
          if (!isInitial) {
            console.log('✅ Cambios detectados en ubicaciones - Actualizando');
          }
          locationsRef.current = locationsData;
          setLocations(locationsData);
          setError(null);
        } else if (!isInitial) {
          console.log('ℹ️ Sin cambios en ubicaciones');
        }
      } catch (error) {
        console.error('❌ Error fetching locations:', error);
        let errorMsg = 'Error al cargar ubicaciones';
        
        if (error instanceof Error) {
          if (error.message.includes('No internet connection')) {
            errorMsg = 'Sin conexión a internet. Mostrando datos guardados anteriormente.';
          } else if (error.message.includes('no cached data')) {
            errorMsg = 'Sin conexión y sin datos guardados. Conecta a internet para cargar las ubicaciones.';
          } else {
            errorMsg = error.message;
          }
        }
        
        // Solo mostrar error si es el fetch inicial o no hay datos previos
        if (isInitial || locations.length === 0) {
          setError(errorMsg);
        } else {
          console.warn('Error en refresh automático (manteniendo datos previos):', errorMsg);
        }
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchLocations(true);
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en ubicaciones...');
      fetchLocations(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <h1 className="text-2xl font-bold">Ubicaciones</h1>
            <p className="text-sm text-muted-foreground">Lugares y direcciones importantes</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isInitialLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : locations.length > 0 ? (
          <div className="space-y-4">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <CardTitle className="text-xl">{location.nombre}</CardTitle>
                      </div>
                      {location.direccion && (
                        <CardDescription className="text-base">
                          {location.direccion}
                        </CardDescription>
                      )}
                    </div>
                    {location.link && (
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="shrink-0"
                      >
                        <a
                          href={location.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No hay ubicaciones disponibles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

