import sql from "@/lib/db";

export type AlbumTrack = {
  trackNo: number;
  title: string;
  durationMS: number;
  id: string;
};

export type Album = {
  id: string;
  title: string;
  cover: string;
  releaseDate: number;
  tracks: AlbumTrack[];
};

type AlbumRow = {
  id: string;
  title: string;
  cover: string;
  release_date: string;
  tracks: AlbumTrack[] | string;
};

function toAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    title: row.title,
    cover: row.cover,
    releaseDate: Number(row.release_date),
    tracks:
      typeof row.tracks === "string" ? JSON.parse(row.tracks) : row.tracks,
  };
}

export async function getAlbums(): Promise<Album[]> {
  const rows = await sql<AlbumRow[]>`
    SELECT id, title, cover, release_date, tracks
    FROM godhandusa.albums
    ORDER BY release_date DESC
  `;

  return rows.map(toAlbum);
}

export async function upsertAlbum(album: Album): Promise<void> {
  await sql`
    INSERT INTO godhandusa.albums (id, title, cover, release_date, tracks)
    VALUES (${album.id}, ${album.title}, ${album.cover}, ${album.releaseDate}, ${sql.json(album.tracks)})
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        cover = EXCLUDED.cover,
        release_date = EXCLUDED.release_date,
        tracks = EXCLUDED.tracks
  `;
}

export async function updateAlbumTracks(
  id: string,
  tracks: AlbumTrack[]
): Promise<void> {
  await sql`
    UPDATE godhandusa.albums
    SET tracks = ${sql.json(tracks)}
    WHERE id = ${id}
  `;
}

export async function deleteAlbum(id: string): Promise<void> {
  await sql`DELETE FROM godhandusa.albums WHERE id = ${id}`;
}
