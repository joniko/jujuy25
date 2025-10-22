interface MediaDisplayProps {
  media: string;
  title?: string;
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function MediaDisplay({ media, title = 'Media' }: MediaDisplayProps) {
  console.log('🎥 MediaDisplay received:', { media, title });
  
  if (!media) {
    console.log('❌ No media URL provided');
    return null;
  }

  const youtubeId = extractYouTubeId(media);
  console.log('🔍 YouTube ID:', youtubeId);
  console.log('🔍 Is YouTube URL:', isYouTubeUrl(media));

  if (isYouTubeUrl(media) && youtubeId) {
    console.log('✅ Rendering YouTube video with ID:', youtubeId);
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  console.log('🖼️ Rendering image with URL:', media);
  
  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-muted">
      <img
        src={media}
        alt={title}
        loading="lazy"
        className="w-full h-auto object-cover"
        onError={(e) => {
          console.error('❌ Error loading image:', media);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
}

