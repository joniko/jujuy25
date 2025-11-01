"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pin } from 'lucide-react';
import MediaDisplay from '../../components/MediaDisplay';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface FeedPost {
  titulo: string;
  descripcion: string;
  media: string;
  destacado: boolean;
  fecha: string;
}

export default function FeedPage() {
  const router = useRouter();
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const feedPostsRef = useRef<FeedPost[]>([]);

  useEffect(() => {
    const fetchFeed = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const feedGid = process.env.NEXT_PUBLIC_SHEETS_FEED_GID || '';
        
        if (!baseUrl) {
          console.error('No sheets URL configured');
          return;
        }

        // Si hay GID específico para feed, usarlo
        let sheetsUrl = baseUrl;
        if (feedGid) {
          if (baseUrl.includes('gid=')) {
            sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${feedGid}`);
          } else {
            sheetsUrl = baseUrl.replace('output=csv', `gid=${feedGid}&single=true&output=csv`);
          }
        }

        const cacheBuster = `&t=${Date.now()}`;
        const response = await axios.get(sheetsUrl + cacheBuster, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        if (isInitial) {
          console.log('📰 Feed CSV Data:', parsedData.data);
        }

        const rows = parsedData.data as Array<{
          titulo?: string;
          descripcion?: string;
          media?: string;
          destacado?: string;
          fecha?: string;
        }>;

        const posts: FeedPost[] = rows
          .filter(row => row.titulo && row.titulo.trim() !== '')
          .map(row => ({
            titulo: row.titulo || '',
            descripcion: row.descripcion || '',
            media: row.media || '',
            destacado: row.destacado?.toLowerCase() === 'true' || row.destacado?.toLowerCase() === 'sí' || row.destacado?.toLowerCase() === 'si',
            fecha: row.fecha || new Date().toISOString()
          }))
          .sort((a, b) => {
            // Destacados primero
            if (a.destacado && !b.destacado) return -1;
            if (!a.destacado && b.destacado) return 1;
            // Luego por fecha descendente
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });

        const hasChanges = JSON.stringify(posts) !== JSON.stringify(feedPostsRef.current);
        
        if (hasChanges) {
          if (!isInitial) {
            console.log('✅ Cambios detectados en Feed - Actualizando');
          }
          feedPostsRef.current = posts;
          setFeedPosts(posts);
        } else if (!isInitial) {
          console.log('ℹ️ Sin cambios en Feed');
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchFeed(true);
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en Feed...');
      fetchFeed(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).fromNow();
    } catch {
      return 'Hace un momento';
    }
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
            <h1 className="text-2xl font-bold">Feed</h1>
            <p className="text-sm text-muted-foreground">Actualizaciones y recursos</p>
          </div>
        </div>

        {/* Loading State */}
        {isInitialLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : feedPosts.length > 0 ? (
          /* Feed Posts */
          <div className="space-y-6">
            {feedPosts.map((post, index) => (
              <Card
                key={index}
                className={`${
                  post.destacado
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'hover:shadow-md'
                } transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.destacado && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                          <Pin className="w-3 h-3" />
                          Destacado
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.fecha)}
                      </span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl md:text-2xl">
                    {post.titulo}
                  </CardTitle>
                  
                  {post.descripcion && (
                    <CardDescription className="text-base whitespace-pre-line">
                      {post.descripcion}
                    </CardDescription>
                  )}
                </CardHeader>
                
                {/* Media del post */}
                {post.media && (
                  <CardContent className="p-0">
                    <MediaDisplay media={post.media} title={post.titulo} />
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No hay publicaciones disponibles todavía.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

