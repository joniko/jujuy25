"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Papa from 'papaparse';
import { fetchWithOfflineFallback, isOnline } from '@/lib/offline-cache';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Users, Search, MessageCircle, MapPin, Filter, Calendar, Clock } from 'lucide-react';

interface Participante {
  nombre: string;
  grupo: string;
  destino: string;
  whatsapp: string;
  dia_llegada: string;
  hora_llegada: string;
}

export default function ParticipantesPage() {
  const router = useRouter();
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filteredParticipantes, setFilteredParticipantes] = useState<Participante[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('all');
  const [selectedDestino, setSelectedDestino] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const participantesRef = useRef<Participante[]>([]);

  useEffect(() => {
    const fetchParticipantes = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        // Intentar ambas variantes del nombre de la variable
        const participantesGid = process.env.NEXT_PUBLIC_SHEETS_PARTICIPANTS || 
                                  process.env.NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID || '';
        
        console.log('🔍 Debug - Base URL:', baseUrl);
        console.log('🔍 Debug - Participantes GID:', participantesGid);
        
        if (!baseUrl) {
          const errorMsg = 'No hay URL de Google Sheets configurada. Verifica NEXT_PUBLIC_SHEETS_URL en .env.local';
          console.error('❌', errorMsg);
          setError(errorMsg);
          if (isInitial) {
            setIsInitialLoading(false);
          }
          return;
        }
        
        if (!participantesGid) {
          const errorMsg = 'No hay GID de participantes configurado. Verifica NEXT_PUBLIC_SHEETS_PARTICIPANTS en .env.local';
          console.error('❌', errorMsg);
          setError(errorMsg);
          if (isInitial) {
            setIsInitialLoading(false);
          }
          return;
        }
        
        setError(null);

        let sheetsUrl = baseUrl;
        if (participantesGid) {
          if (baseUrl.includes('gid=')) {
            sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${participantesGid}`);
          } else {
            sheetsUrl = baseUrl.replace('output=csv', `gid=${participantesGid}&single=true&output=csv`);
          }
        }

        console.log('🔍 Debug - Final Sheets URL:', sheetsUrl);

        // Usar cache offline si no hay conexión, o intentar fetch y cachear si hay conexión
        let csvData: string;
        const online = isOnline();
        
        if (online) {
          // Si hay conexión, intentar fetch con cache buster
          const cacheBuster = `&t=${Date.now()}`;
          const finalUrl = sheetsUrl + (sheetsUrl.includes('?') ? '&' : '?') + cacheBuster.replace('&', '');
          console.log('🔍 Debug - Final URL with cache buster:', finalUrl);
          try {
            csvData = await fetchWithOfflineFallback(finalUrl);
          } catch (error) {
            // Si falla, intentar sin cache buster (usar cache)
            csvData = await fetchWithOfflineFallback(sheetsUrl);
          }
        } else {
          // Sin conexión, usar cache directamente
          csvData = await fetchWithOfflineFallback(sheetsUrl);
        }
        
        console.log('✅ CSV data length:', csvData?.length || 0);
        
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        console.log('📊 Parsed data rows:', parsedData.data.length);
        console.log('📊 First row sample:', parsedData.data[0]);
        console.log('📊 Available columns:', parsedData.meta?.fields || 'No fields detected');

        if (isInitial) {
          console.log('👥 Participantes CSV Data (first 3 rows):', parsedData.data.slice(0, 3));
        }

        const rows = parsedData.data as Array<{
          nombre?: string;
          grupo?: string;
          destino?: string;
          whatsapp?: string;
          dia_llegada?: string;
          hora_llegada?: string;
        }>;

        const participantesData: Participante[] = rows
          .filter(row => row.nombre && row.nombre.trim() !== '')
          .map(row => ({
            nombre: row.nombre || '',
            grupo: row.grupo || '',
            destino: row.destino || '',
            whatsapp: row.whatsapp || '',
            dia_llegada: row.dia_llegada || '',
            hora_llegada: row.hora_llegada || ''
          }));

        const hasChanges = JSON.stringify(participantesData) !== JSON.stringify(participantesRef.current);
        
        if (hasChanges) {
          participantesRef.current = participantesData;
          setParticipantes(participantesData);
          setFilteredParticipantes(participantesData);
        }
      } catch (error) {
        console.error('❌ Error fetching participantes:', error);
        let errorMsg = 'Error al cargar participantes';
        
        if (error instanceof Error) {
          if (error.message.includes('No internet connection')) {
            errorMsg = 'Sin conexión a internet. Mostrando datos guardados anteriormente.';
          } else if (error.message.includes('no cached data')) {
            errorMsg = 'Sin conexión y sin datos guardados. Conecta a internet para cargar los participantes.';
          } else {
            errorMsg = error.message;
          }
        }
        
        // Solo mostrar error si es el fetch inicial o no hay datos previos
        if (isInitial || participantes.length === 0) {
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

    fetchParticipantes(true);
    
    const refreshInterval = setInterval(() => {
      fetchParticipantes(false);
    }, 60000); // Actualizar cada minuto

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Filtrar participantes
  useEffect(() => {
    let filtered = [...participantes];

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(query) ||
        p.grupo.includes(query) ||
        p.destino.toLowerCase().includes(query)
      );
    }

    // Filtrar por grupo
    if (selectedGrupo !== 'all') {
      filtered = filtered.filter(p => p.grupo === selectedGrupo);
    }

    // Filtrar por destino
    if (selectedDestino !== 'all') {
      filtered = filtered.filter(p => p.destino.toLowerCase() === selectedDestino.toLowerCase());
    }

    setFilteredParticipantes(filtered);
  }, [participantes, searchQuery, selectedGrupo, selectedDestino]);

  // Agrupar por grupo
  const participantesPorGrupo = filteredParticipantes.reduce((acc, p) => {
    const grupo = p.grupo || 'Sin grupo';
    if (!acc[grupo]) {
      acc[grupo] = [];
    }
    acc[grupo].push(p);
    return acc;
  }, {} as Record<string, Participante[]>);

  const gruposOrdenados = Object.keys(participantesPorGrupo).sort((a, b) => {
    const numA = parseInt(a) || 999;
    const numB = parseInt(b) || 999;
    return numA - numB;
  });

  const handleWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return;
    const cleanNumber = whatsapp.replace(/\s+/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Participantes</h1>
            <p className="text-sm text-muted-foreground">Lista de participantes del viaje</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">❌ Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Abre la consola del navegador (F12) para ver más detalles.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <CardTitle className="text-lg">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, grupo, destino..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Grupo</label>
                <select
                  value={selectedGrupo}
                  onChange={(e) => setSelectedGrupo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos los grupos</option>
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <option key={g} value={g.toString()}>Grupo {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Destino</label>
                <select
                  value={selectedDestino}
                  onChange={(e) => setSelectedDestino(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos los destinos</option>
                  <option value="Humahuaca">Humahuaca</option>
                  <option value="Abra Pampa">Abra Pampa</option>
                  <option value="La Quiaca">La Quiaca</option>
                  <option value="Jujuy Capital">Jujuy Capital</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isInitialLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredParticipantes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron participantes con los filtros seleccionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Tabla de participantes */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Participantes</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {filteredParticipantes.length} participante{filteredParticipantes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Nombre</TableHead>
                      <TableHead className="min-w-[100px]">Grupo</TableHead>
                      <TableHead className="min-w-[120px]">Destino</TableHead>
                      <TableHead className="min-w-[120px]">Llegada</TableHead>
                      <TableHead className="w-[60px] text-center">Contacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipantes.map((participante, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className="font-medium">{participante.nombre}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">G{participante.grupo}</span>
                        </TableCell>
                        <TableCell>
                          {participante.destino ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span>{participante.destino}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {participante.dia_llegada && (
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span>{participante.dia_llegada}</span>
                              </div>
                            )}
                            {participante.hora_llegada && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{participante.hora_llegada}</span>
                              </div>
                            )}
                            {!participante.dia_llegada && !participante.hora_llegada && (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {participante.whatsapp ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleWhatsApp(participante.whatsapp)}
                              className="h-8 w-8"
                              title="Contactar por WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
