"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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
    if (autoplay) {
      // Pequeño delay para asegurar que el iframe esté cargado
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoplay]);

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

  const handleToggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          {videoInfo?.thumbnail ? (
            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
              <img 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 flex-shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
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
            <p className="text-xs text-muted-foreground mt-0.5">
              Duración: {videoInfo?.duration || '--:--'}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleTogglePlay}
              className="h-9 w-9"
              aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleMute}
              className="h-9 w-9"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* YouTube iframe (oculto) */}
      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&start=53&loop=1&playlist=${videoId}&enablejsapi=1&controls=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Music Player"
      />
    </Card>
  );
};

export default YouTubePlayer;

