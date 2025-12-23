"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Play, Pause } from 'lucide-react';

interface YouTubePlayerProps {
  videoId?: string;
  autoplay?: boolean;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId = 'xC2YbO10vaM', // Música de adoración seleccionada
  autoplay = true 
}) => {
  // Detectar iOS - en iOS el autoplay no funciona bien, mejor dejarlo en pausa
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchVideoInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/youtube?videoId=${videoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch video info');
        }

        const data = await response.json();
        setVideoInfo(data);
      } catch (error) {
        console.error('Error fetching video info:', error);
        // Fallback a información estática si falla
        setVideoInfo({
          title: 'Música de Adoración',
          thumbnail: '',
          duration: '--:--',
          channel: 'Ambiente de oración'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoInfo();
  }, [videoId]);

  useEffect(() => {
    // Solo activar autoplay si no es iOS y está habilitado
    if (autoplay && !isIOS) {
      // Pequeño delay para asegurar que el iframe esté cargado
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoplay, isIOS]);

  const handleTogglePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="p-4">
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md shrink-0" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          {videoInfo?.thumbnail ? (
            <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
              <Image 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
              <Music className="w-8 h-8 text-primary" />
            </div>
          )}
          
          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
              {videoInfo?.title || 'Música de Adoración'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {videoInfo?.channel || 'Ambiente de oración'}
            </p>
          </div>
          
          {/* Control */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleTogglePlay}
            className="h-9 w-9 shrink-0"
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* YouTube iframe (oculto - solo audio) */}
      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${isIOS ? '0' : '1'}&start=53&loop=1&playlist=${videoId}&enablejsapi=1&controls=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Music Player"
      />
    </Card>
  );
};

export default YouTubePlayer;

