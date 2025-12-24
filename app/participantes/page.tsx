"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Search, Phone, MapPin, Plane, Bus, Car, User, Filter } from 'lucide-react';

interface Participante {
  nombre: string;
  grupo: string;
  rol: string;
  referentes: string;
  destino: string;
  whatsapp: string;
  contacto: string;
  medio_transporte: string;
  vuelo_ida: string;
  vuelo_vuelta: string;
  hora_llegada: string;
  hora_salida: string;
  aeropuerto_llegada: string;
  aeropuerto_salida: string;
  escala_salta: string;
  micro_salta_jujuy: string;
  dia_llegada: string;
  estado: string;
  notas: string;
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
  const [debugInfo, setDebugInfo] = useState<{ url?: string; gid?: string; rows?: number } | null>(null);
  const participantesRef = useRef<Participante[]>([]);

  useEffect(() => {
    const fetchParticipantes = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const participantesGid = process.env.NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID || '';
        
        console.log('🔍 Debug - Base URL:', baseUrl);
        console.log('🔍 Debug - Participantes GID:', participantesGid);
        
        setDebugInfo({
          url: baseUrl,
          gid: participantesGid || 'No configurado'
        });
        
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
          const errorMsg = 'No hay GID de participantes configurado. Verifica NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID en .env.local';
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

        const cacheBuster = `&t=${Date.now()}`;
        const finalUrl = sheetsUrl + (sheetsUrl.includes('?') ? '&' : '?') + cacheBuster.replace('&', '');
        console.log('🔍 Debug - Final URL with cache buster:', finalUrl);
        
        const response = await axios.get(finalUrl, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        console.log('✅ Response status:', response.status);
        console.log('✅ Response data length:', response.data?.length || 0);
        
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        console.log('📊 Parsed data rows:', parsedData.data.length);
        console.log('📊 First row sample:', parsedData.data[0]);
        console.log('📊 Available columns:', parsedData.meta?.fields || 'No fields detected');
        
        setDebugInfo(prev => ({
          ...prev,
          rows: parsedData.data.length
        }));

        if (isInitial) {
          console.log('👥 Participantes CSV Data (first 3 rows):', parsedData.data.slice(0, 3));
        }

        const rows = parsedData.data as Array<{
          nombre?: string;
          grupo?: string;
          rol?: string;
          referentes?: string;
          destino?: string;
          whatsapp?: string;
          contacto?: string;
          medio_transporte?: string;
          vuelo_ida?: string;
          vuelo_vuelta?: string;
          hora_llegada?: string;
          hora_salida?: string;
          aeropuerto_llegada?: string;
          aeropuerto_salida?: string;
          escala_salta?: string;
          micro_salta_jujuy?: string;
          dia_llegada?: string;
          estado?: string;
          notas?: string;
        }>;

        const participantesData: Participante[] = rows
          .filter(row => row.nombre && row.nombre.trim() !== '')
          .map(row => ({
            nombre: row.nombre || '',
            grupo: row.grupo || '',
            rol: row.rol || '',
            referentes: row.referentes || '',
            destino: row.destino || '',
            whatsapp: row.whatsapp || '',
            contacto: row.contacto || '',
            medio_transporte: row.medio_transporte || '',
            vuelo_ida: row.vuelo_ida || '',
            vuelo_vuelta: row.vuelo_vuelta || '',
            hora_llegada: row.hora_llegada || '',
            hora_salida: row.hora_salida || '',
            aeropuerto_llegada: row.aeropuerto_llegada || '',
            aeropuerto_salida: row.aeropuerto_salida || '',
            escala_salta: row.escala_salta || '',
            micro_salta_jujuy: row.micro_salta_jujuy || '',
            dia_llegada: row.dia_llegada || '',
            estado: row.estado || 'Activo',
            notas: row.notas || ''
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
        
        if (axios.isAxiosError(error)) {
          console.error('❌ Error response:', error.response?.status, error.response?.statusText);
          console.error('❌ Error URL:', error.config?.url);
          
          if (error.response?.status === 404) {
            errorMsg = 'No se encontró la planilla. Verifica que el GID sea correcto y que la planilla esté publicada.';
          } else if (error.response?.status === 403) {
            errorMsg = 'Acceso denegado. Verifica que la planilla esté publicada como CSV.';
          } else {
            errorMsg = `Error ${error.response?.status}: ${error.response?.statusText || 'Error desconocido'}`;
          }
        } else if (error instanceof Error) {
          errorMsg = error.message;
        }
        
        setError(errorMsg);
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
        p.destino.toLowerCase().includes(query) ||
        p.referentes.toLowerCase().includes(query)
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

    // Filtrar solo activos
    filtered = filtered.filter(p => p.estado !== 'BAJA');

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

  const getTransportIcon = (medio: string) => {
    if (medio.toLowerCase().includes('avión') || medio.toLowerCase().includes('avion')) {
      return <Plane className="w-4 h-4" />;
    }
    if (medio.toLowerCase().includes('micro') || medio.toLowerCase().includes('ómnibus') || medio.toLowerCase().includes('omnibus')) {
      return <Bus className="w-4 h-4" />;
    }
    if (medio.toLowerCase().includes('auto')) {
      return <Car className="w-4 h-4" />;
    }
    return null;
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

        {/* Debug Info - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm">🔍 Información de Debug</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div><strong>Base URL:</strong> {debugInfo.url ? '✅ Configurada' : '❌ No configurada'}</div>
              <div><strong>GID Participantes:</strong> {debugInfo.gid}</div>
              {debugInfo.rows !== undefined && (
                <div><strong>Filas encontradas:</strong> {debugInfo.rows}</div>
              )}
              {debugInfo.url && (
                <div className="mt-2 p-2 bg-white rounded text-xs break-all">
                  <strong>URL completa:</strong><br />
                  {debugInfo.url.includes('gid=') 
                    ? debugInfo.url.replace(/gid=\d+/, `gid=${debugInfo.gid}`)
                    : `${debugInfo.url.replace('output=csv', `gid=${debugInfo.gid}&single=true&output=csv`)}`
                  }
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
          /* Participantes agrupados por grupo */
          <div className="space-y-6">
            {gruposOrdenados.map((grupo) => {
              const grupoParticipantes = participantesPorGrupo[grupo];
              const referentes = grupoParticipantes[0]?.referentes || '';
              const destino = grupoParticipantes[0]?.destino || '';
              const lideres = grupoParticipantes.filter(p => p.rol === 'Líder');
              
              return (
                <Card key={grupo}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">Grupo {grupo}</CardTitle>
                        {referentes && (
                          <CardDescription className="mt-1">
                            Referentes: {referentes}
                          </CardDescription>
                        )}
                        {destino && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Destino: {destino}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{grupoParticipantes.length}</div>
                        <div className="text-xs text-muted-foreground">participantes</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {grupoParticipantes.map((participante, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            participante.rol === 'Líder'
                              ? 'bg-primary/5 border-primary/20'
                              : 'bg-muted/30 border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{participante.nombre}</span>
                                {participante.rol === 'Líder' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                                    <User className="w-3 h-3" />
                                    Líder
                                  </span>
                                )}
                                {participante.medio_transporte && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                    {getTransportIcon(participante.medio_transporte)}
                                    {participante.medio_transporte}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {participante.vuelo_ida && (
                                  <span>✈️ Ida: {participante.vuelo_ida}</span>
                                )}
                                {participante.vuelo_vuelta && (
                                  <span>✈️ Vuelta: {participante.vuelo_vuelta}</span>
                                )}
                                {participante.hora_llegada && (
                                  <span>🕐 Llegada: {participante.hora_llegada}</span>
                                )}
                                {participante.escala_salta === 'Sí' && (
                                  <span className="text-orange-600">⚠️ Escala en Salta</span>
                                )}
                              </div>

                              {participante.micro_salta_jujuy && (
                                <p className="text-sm text-muted-foreground">
                                  🚌 {participante.micro_salta_jujuy}
                                </p>
                              )}

                              {participante.notas && (
                                <p className="text-sm text-muted-foreground italic">
                                  📝 {participante.notas}
                                </p>
                              )}
                            </div>

                            {participante.whatsapp && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleWhatsApp(participante.whatsapp)}
                                className="shrink-0"
                                title="Contactar por WhatsApp"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
