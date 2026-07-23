import { Album, AlbumTrack } from "@/lib/albums";

const SPOTIFY_ID_REGEX = /^[A-Za-z0-9]{22}$/;

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Extracts a Spotify album ID from a bare ID, an open.spotify.com
 * album URL, or a spotify:album: URI. Returns null if no album ID
 * can be found.
 */
export function parseSpotifyAlbumId(input: string): string | null {
  const value = input.trim();

  if (SPOTIFY_ID_REGEX.test(value)) {
    return value;
  }

  const uriMatch = value.match(/^spotify:album:([A-Za-z0-9]{22})$/);

  if (uriMatch) {
    return uriMatch[1];
  }

  let url: URL;

  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }

  if (!url.hostname.endsWith("spotify.com")) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const albumIndex = segments.indexOf("album");

  if (albumIndex === -1) {
    return null;
  }

  const id = segments[albumIndex + 1] || "";
  return SPOTIFY_ID_REGEX.test(id) ? id : null;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are not configured");
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status}`);
  }

  const data = await response.json();

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.value;
}

type SpotifyTrack = {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
};

/**
 * Fetches an album from the Spotify API and computes the album
 * shape used by the site.
 */
export async function fetchSpotifyAlbum(albumId: string): Promise<Album> {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    { headers, cache: "no-store" }
  );

  if (response.status === 404 || response.status === 400) {
    throw new Error("Album not found on Spotify");
  }

  if (!response.ok) {
    throw new Error(`Spotify request failed: ${response.status}`);
  }

  const data = await response.json();

  const tracks: SpotifyTrack[] = [...data.tracks.items];
  let next: string | null = data.tracks.next;

  while (next) {
    const pageResponse = await fetch(next, { headers, cache: "no-store" });

    if (!pageResponse.ok) {
      throw new Error(`Spotify request failed: ${pageResponse.status}`);
    }

    const page = await pageResponse.json();
    tracks.push(...page.items);
    next = page.next;
  }

  const albumTracks: AlbumTrack[] = tracks.map((track) => ({
    trackNo: track.track_number,
    title: track.name,
    durationMS: track.duration_ms,
    id: track.id,
  }));

  return {
    id: data.id,
    title: data.name,
    cover: data.images?.[0]?.url || "",
    releaseDate: Date.parse(data.release_date),
    tracks: albumTracks,
  };
}
