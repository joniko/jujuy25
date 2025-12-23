import Image from 'next/image';

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
  if (!media) {
    return null;
  }

  const youtubeId = extractYouTubeId(media);

  if (isYouTubeUrl(media) && youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-b-lg overflow-hidden bg-muted">
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
  
  return (
    <div className="relative w-full overflow-hidden rounded-b-lg bg-muted" style={{ minHeight: '200px' }}>
      <Image
        src={media}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
        onError={(e) => {
          console.error('❌ Error loading image:', media);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
}

