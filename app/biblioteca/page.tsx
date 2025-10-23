"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, FileSpreadsheet, Image, Video, Music, Folder, ExternalLink } from 'lucide-react';

interface LibraryFile {
  nombre: string;
  tipo: string;
  url: string;
  peso?: string;
}

interface LibraryPost {
  titulo: string;
  bajada: string;
  archivos: LibraryFile[];
}

const getFileIcon = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  
  if (tipoLower.includes('pdf') || tipoLower.includes('doc')) {
    return <FileText className="w-5 h-5" />;
  }
  if (tipoLower.includes('sheet') || tipoLower.includes('excel') || tipoLower.includes('xls')) {
    return <FileSpreadsheet className="w-5 h-5" />;
  }
  if (tipoLower.includes('imagen') || tipoLower.includes('image') || tipoLower.includes('jpg') || tipoLower.includes('png')) {
    return <Image className="w-5 h-5" />;
  }
  if (tipoLower.includes('video') || tipoLower.includes('youtube')) {
    return <Video className="w-5 h-5" />;
  }
  if (tipoLower.includes('audio') || tipoLower.includes('music') || tipoLower.includes('mp3')) {
    return <Music className="w-5 h-5" />;
  }
  if (tipoLower.includes('carpeta') || tipoLower.includes('folder') || tipoLower.includes('drive')) {
    return <Folder className="w-5 h-5" />;
  }
  
  return <FileText className="w-5 h-5" />;
};

const getFileTypeColor = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  
  if (tipoLower.includes('pdf') || tipoLower.includes('doc')) {
    return 'text-blue-600 bg-blue-50 border-blue-200';
  }
  if (tipoLower.includes('sheet') || tipoLower.includes('excel')) {
    return 'text-green-600 bg-green-50 border-green-200';
  }
  if (tipoLower.includes('imagen') || tipoLower.includes('image')) {
    return 'text-purple-600 bg-purple-50 border-purple-200';
  }
  if (tipoLower.includes('video')) {
    return 'text-red-600 bg-red-50 border-red-200';
  }
  if (tipoLower.includes('audio') || tipoLower.includes('music')) {
    return 'text-orange-600 bg-orange-50 border-orange-200';
  }
  if (tipoLower.includes('carpeta') || tipoLower.includes('folder')) {
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  }
  
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

export default function BibliotecaPage() {
  const router = useRouter();
  const [libraryPosts, setLibraryPosts] = useState<LibraryPost[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const libraryPostsRef = useRef<LibraryPost[]>([]);

  useEffect(() => {
    const fetchLibrary = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const bibliotecaGid = process.env.NEXT_PUBLIC_SHEETS_BIBLIOTECA_GID || '';
        
        if (!baseUrl) {
          console.error('No sheets URL configured');
          return;
        }

        // Si hay GID específico para biblioteca, usarlo, sino usar la URL base
        let sheetsUrl = baseUrl;
        if (bibliotecaGid) {
          // Reemplazar el gid en la URL o agregarlo si no existe
          if (baseUrl.includes('gid=')) {
            sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${bibliotecaGid}`);
          } else {
            // Si no tiene gid, agregar el parámetro
            sheetsUrl = baseUrl.replace('output=csv', `gid=${bibliotecaGid}&single=true&output=csv`);
          }
        }

        // Agregar timestamp para evitar cache del navegador
        const cacheBuster = `&t=${Date.now()}`;
        const response = await axios.get(sheetsUrl + cacheBuster, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        if (isInitial) {
          console.log('📚 Biblioteca CSV Data:', parsedData.data);
        }

        const rows = parsedData.data as Array<{
          titulo?: string;
          bajada?: string;
          url?: string;
          nombre?: string;
          tipo?: string;
          peso?: string;
        }>;

        if (rows.length === 0) {
          return;
        }

        // Cada fila es un post con su título, bajada y archivos
        const posts: LibraryPost[] = rows
          .filter(row => row.titulo && row.titulo.trim() !== '')
          .map(row => {
            const urls = (row.url || '').split(',').map(u => u.trim()).filter(u => u !== '');
            const nombres = (row.nombre || '').split('|').map(n => n.trim()).filter(n => n !== '');
            const tipos = (row.tipo || '').split('|').map(t => t.trim()).filter(t => t !== '');
            const pesos = (row.peso || '').split('|').map(p => p.trim());

            // Crear un archivo por cada URL
            const archivos: LibraryFile[] = urls.map((url, index) => ({
              url,
              nombre: nombres[index] || `Archivo ${index + 1}`,
              tipo: tipos[index] || 'documento',
              peso: pesos[index] || undefined
            }));

            return {
              titulo: row.titulo || '',
              bajada: row.bajada || '',
              archivos
            };
          });

        // Comparar datos para detectar cambios
        const hasChanges = JSON.stringify(posts) !== JSON.stringify(libraryPostsRef.current);
        
        if (hasChanges) {
          if (!isInitial) {
            console.log('✅ Cambios detectados en la Biblioteca - Actualizando');
          }
          libraryPostsRef.current = posts;
          setLibraryPosts(posts);
        } else if (!isInitial) {
          console.log('ℹ️ Sin cambios en la Biblioteca');
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    // Fetch inicial
    fetchLibrary(true);
    
    // Auto-refresh cada 30 segundos
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en Biblioteca...');
      fetchLibrary(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const handleFileClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
            <h1 className="text-2xl font-bold">Biblioteca</h1>
          </div>
        </div>

        {/* Loading State */}
        {isInitialLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-20" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : libraryPosts.length > 0 ? (
          /* Library Posts */
          <div className="space-y-6">
            {libraryPosts.map((post, postIndex) => (
              <Card key={postIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">{post.titulo}</CardTitle>
                  {post.bajada && (
                    <CardDescription className="text-base">
                      {post.bajada}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  {post.archivos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {post.archivos.map((archivo, archivoIndex) => (
                        <button
                          key={archivoIndex}
                          onClick={() => handleFileClick(archivo.url)}
                          className={`
                            flex items-start gap-3 p-4 rounded-lg border-2 
                            transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                            text-left group
                            ${getFileTypeColor(archivo.tipo)}
                          `}
                        >
                          <div className="shrink-0 mt-0.5">
                            {getFileIcon(archivo.tipo)}
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-medium text-sm leading-tight break-words">
                              {archivo.nombre}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs opacity-80 uppercase font-semibold">
                                {archivo.tipo}
                              </span>
                              {archivo.peso && archivo.peso.trim() !== '' && (
                                <>
                                  <span className="text-xs opacity-60">•</span>
                                  <span className="text-xs opacity-80">
                                    {archivo.peso}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay archivos en este grupo.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No hay datos de biblioteca disponibles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

