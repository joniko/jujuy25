import { NextRequest, NextResponse } from 'next/server';
import Innertube from 'youtubei.js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Crear instancia de Innertube con configuración optimizada
    const yt = await Innertube.create({
      lang: 'es',
      location: 'US',
      retrieve_player: false // No necesitamos decodificar URLs, solo metadata
    });
    
    const info = await yt.getInfo(videoId);

    // Obtener la mejor calidad de thumbnail disponible
    const thumbnails = info.basic_info.thumbnail || [];
    const bestThumbnail = thumbnails.length > 0 
      ? thumbnails[thumbnails.length - 1].url 
      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const durationSeconds = info.basic_info.duration || 0;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    const formattedDuration = hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const videoData = {
      title: info.basic_info.title || 'Video de YouTube',
      thumbnail: bestThumbnail,
      duration: formattedDuration,
      channel: info.basic_info.author || 'Canal desconocido'
    };

    return NextResponse.json(videoData);
  } catch (error) {
    console.error('Error fetching video info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video information' },
      { status: 500 }
    );
  }
}

