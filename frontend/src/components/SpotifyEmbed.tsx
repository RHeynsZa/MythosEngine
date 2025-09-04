import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpotifyEmbedProps {
  spotifyUrl: string;
  className?: string;
}

/**
 * Converts various Spotify URL formats to the embed format
 * Supports:
 * - https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
 * - https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh?si=...
 * - spotify:track:4iV5W9uYEdYUVa79Axb7Rh
 */
function getSpotifyEmbedUrl(url: string): string | null {
  try {
    // Handle spotify: protocol
    if (url.startsWith('spotify:')) {
      const parts = url.split(':');
      if (parts.length >= 3 && parts[1] === 'track') {
        return `https://open.spotify.com/embed/track/${parts[2]}`;
      }
      return null;
    }

    // Handle https://open.spotify.com URLs
    if (url.includes('open.spotify.com')) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      if (pathParts.length >= 3 && pathParts[1] === 'track') {
        const trackId = pathParts[2];
        return `https://open.spotify.com/embed/track/${trackId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function SpotifyEmbed({ spotifyUrl, className }: SpotifyEmbedProps) {
  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  if (!embedUrl) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Mood Music</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Invalid Spotify URL provided. Please check the URL format.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Mood Music</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-md"
          title="Spotify player"
        />
      </CardContent>
    </Card>
  );
}