import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10; // Máximo 10 segundos para Vercel

// Fallback con información conocida del video
const VIDEO_FALLBACKS: Record<string, { title: string; channel: string }> = {
  'xC2YbO10vaM': {
    title: 'ÁLBUM COMPLETO: Casa de oración - Piano @TOMATULUGAR',
    channel: 'Gustavo Astellano'
  }
};

async function fetchWithOEmbed(videoId: string) {
  // API oficial de YouTube oEmbed - más rápida y confiable
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const response = await fetch(oembedUrl, { 
    signal: AbortSignal.timeout(5000) // 5 segundos timeout
  });
  
  if (!response.ok) throw new Error('oEmbed failed');
  
  const data = await response.json();
  return {
    title: data.title || 'Música de Adoración',
    channel: data.author_name || 'Canal desconocido',
    thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  };
}

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

    try {
      // Intentar con oEmbed API (oficial y rápida)
      const videoData = await fetchWithOEmbed(videoId);
      
      return NextResponse.json({
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        duration: '1:18:47', // Duración estática para este video
        channel: videoData.channel
      });
    } catch (oembedError) {
      console.warn('oEmbed failed, using fallback:', oembedError);
      
      // Usar fallback si existe
      const fallback = VIDEO_FALLBACKS[videoId];
      if (fallback) {
        return NextResponse.json({
          title: fallback.title,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          duration: '1:18:47',
          channel: fallback.channel
        });
      }
      
      // Fallback genérico
      return NextResponse.json({
        title: 'Música de Adoración',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: '--:--',
        channel: 'Ambiente de oración'
      });
    }
  } catch (error) {
    console.error('Error fetching video info:', error);
    
    // Siempre devolver algo funcional
    const videoId = request.nextUrl.searchParams.get('videoId') || 'xC2YbO10vaM';
    return NextResponse.json({
      title: 'Música de Adoración',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: '--:--',
      channel: 'Ambiente de oración'
    });
  }
}

